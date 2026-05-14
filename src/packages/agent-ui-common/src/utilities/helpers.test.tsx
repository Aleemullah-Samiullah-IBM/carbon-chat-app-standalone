import {describe, it, expect, vi} from 'vitest'
import {
  getCurrentTime,
  getExpirationDate,
  transformChatMessagesData,
  isNestedObject,
  getFileName,
  getFileExtension,
  getFileMetadata,
  parseToolcallArguments,
  decodeToken,
  tokenizeInput,
  cleanInput,
  getMissingRequiredFields,
  parseInputandValidate,
  isAgentResponse,
  shouldResetToolcalls,
  shouldUpdatePlan,
} from './helpers'
import {jwtDecode} from 'jwt-decode'
import {ArtifactMetadata} from '../types/FileData'
import {Command} from '../types/Command'

vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(),
}))

describe('getCurrentTime', () => {
  const cases: Array<[string, string | undefined]> = [
    ['formats time correctly from a date string', '2025-07-29T15:30:00Z'],
    ['formats current time if no date string is provided', undefined],
  ]

  test.each(cases)('%s', (_, input) => {
    const time = input ? getCurrentTime(input) : getCurrentTime()
    expect(time).toMatch(/\d{1,2}:\d{2} (AM|PM)/)
  })
})

describe('getExpirationDate', () => {
  it('returns ISO string for expiration date', () => {
    const result = getExpirationDate(3600)
    expect(new Date(result).getTime()).toBeGreaterThan(Date.now())
  })
})

describe('transformChatMessagesData', () => {
  it('filters and formats chat events', () => {
    const events = [
      {
        event: {type: 'user-message', content: 'Hello'},
        timestamp: '2025-07-29T15:30:00Z',
      },
      {
        event: {type: 'irrelevant-event', content: 'Ignore me'},
        timestamp: '2025-07-29T15:30:00Z',
      },
    ]
    const result = transformChatMessagesData(events as any)
    expect(result).toHaveLength(1)
    expect(result[0].timestamp).toMatch(/\d{1,2}:\d{2} (AM|PM)/)
  })
})

describe('isNestedObject', () => {
  it('detects nested objects', () => {
    expect(isNestedObject({a: {b: 1}})).toBe(true)
    expect(isNestedObject({a: 1})).toBe(false)
    expect(isNestedObject(null)).toBe(false)
  })
})

describe('getFileName', () => {
  it.each([
    ['/path/to/file.txt', 'file.txt'],
    ['some@file.txt', 'some@file.txt'],
    ['file.txt', 'file.txt'],
  ])('returns correct filename for %s', (input, expected) => {
    expect(getFileName(input)).toBe(expected)
  })
})

describe('getFileExtension', () => {
  it.each([
    ['file.txt', 'txt'],
    ['file', null],
  ])('returns correct extension for %s', (input, expected) => {
    expect(getFileExtension(input)).toBe(expected)
  })
})

describe('getFileMetadata', () => {
  it('returns matching metadata', () => {
    const attachments = [{filename: 'file.txt', size: 123}]
    expect(getFileMetadata('file.txt', attachments as any)).toEqual(
      attachments[0],
    )
  })

  it('returns undefined if no match', () => {
    expect(getFileMetadata('missing.txt', [])).toBeUndefined()
  })
})

describe('parseToolcallArguments', () => {
  it('parses nested file objects', () => {
    const input = {
      param1: 'value',
      file: {filename: 'doc.pdf'},
      nested: {file2: {filename: 'image.png'}},
    }

    const result = parseToolcallArguments(input)
    expect(result.file).toBe('doc.pdf')
    expect(result.nested.file2).toBe('image.png')
    expect(result.param1).toBe('value')
  })

  it('parses arrays of files and values', () => {
    const input = {
      files: [{filename: 'file1.txt'}, {filename: 'file2.txt'}, 'note', null],
    }

    const result = parseToolcallArguments(input)
    expect(result.files).toEqual(['file1.txt', 'file2.txt', 'note', undefined])
  })

  // test for null values
})

describe('decodeToken', () => {
  it('returns decoded data on success', () => {
    const mockPayload = {username: 'test-user'}
    ;(jwtDecode as any).mockReturnValue(mockPayload)

    const result = decodeToken('fake-token')
    expect(result.data).toEqual(mockPayload)
    expect(result.error).toBeUndefined()
  })

  it('returns error on failure', () => {
    const mockError = new Error('Invalid token')
    ;(jwtDecode as any).mockImplementation(() => {
      throw mockError
    })

    const result = decodeToken('bad-token')
    expect(result.data).toBeUndefined()
    expect(result.error).toBe(mockError)
  })
})

describe('tokenizeInput', () => {
  const cases: Array<[string, string, string[]]> = [
    [
      'tokenizes simple space-separated words',
      'one two three',
      ['one', 'two', 'three'],
    ],
    [
      'handles single-quoted strings',
      "one 'two three' four",
      ['one', "'two three'", 'four'],
    ],
    [
      'handles double-quoted strings',
      'one "two three" four',
      ['one', '"two three"', 'four'],
    ],
    [
      'handles @-prefixed single-quoted strings',
      "one @'two three' four",
      ['one', "@'two three'", 'four'],
    ],
    [
      'handles @-prefixed double-quoted strings',
      'one @"two three" four',
      ['one', '@"two three"', 'four'],
    ],
    [
      'handles mixed quoted and unquoted tokens',
      '@"a b" c \'d e\' f',
      ['@"a b"', 'c', "'d e'", 'f'],
    ],
    ['returns empty array for empty input', '', []],
    [
      'handles input with extra spaces',
      '  one   "two three"   four  ',
      ['one', '"two three"', 'four'],
    ],
    [
      'handles input with only quoted strings',
      '"one two" \'three four\'',
      ['"one two"', "'three four'"],
    ],
  ]

  test.each(cases)('%s', (_, input, expected) => {
    expect(tokenizeInput(input)).toEqual(expected)
  })
})

describe('cleanInput', () => {
  const cases: Array<[string, string, string]> = [
    ['returns input unchanged if no @ tokens', 'run test', 'run test'],
    ['replaces @file with filename', '@src/utils/file.ts', 'file.ts'],
    [
      'handles multiple @ tokens',
      'run @src/index.ts and @lib/main.js',
      'run index.ts and main.js',
    ],
    ['handles quoted @ tokens', 'open @"src/utils/file.ts"', 'open file.ts'],
    [
      'handles mixed tokens',
      'run @"src/index.ts" with config.json',
      'run index.ts with config.json',
    ],
    ['handles single-quoted @ tokens', "run @'src/index.ts'", 'run index.ts'],
    ['handles empty input', '', ''],
    [
      'handles input with extra spaces',
      '  run   @src/index.ts   now  ',
      'run index.ts now',
    ],
  ]

  test.each(cases)('%s', (_, input, expected) => {
    expect(cleanInput(input)).toBe(expected)
  })
})

describe('getMissingRequiredFields', () => {
  const commands: Command[] = [
    {
      name: 'deploy',
      description: 'Deploy the app',
      parameters: [
        {type: 'string', description: '', name: 'file', required: true},
        {type: 'string', description: '', name: 'version', required: true},
        {type: 'string', description: '', name: 'database', required: false},
      ],
    },
  ]

  it('returns missing required fields', () => {
    const args = {file: '', database: 'db2'}
    expect(getMissingRequiredFields(commands, 'deploy', args)).toEqual([
      'file',
      'version',
    ])
  })

  it('returns empty array when all required fields are present', () => {
    const args = {file: 'prod', version: '1.0.0', database: 'db2'}
    expect(getMissingRequiredFields(commands, 'deploy', args)).toEqual([])
  })

  it('returns empty array if command not found', () => {
    const args = {file: 'prod'}
    expect(getMissingRequiredFields(commands, 'unknown', args)).toEqual([])
  })

  it('returns empty array if parameters is not an array', () => {
    const badCommands = [
      {name: 'bad-deploy', description: 'Deploy the bad app', parameters: []},
    ]
    expect(getMissingRequiredFields(badCommands, 'deploy-bad', {})).toEqual([])
  })
})
describe('parseInputandValidate', () => {
  const commands: Command[] = [
    {
      name: 'deploy',
      description: 'Deploy command',
      parameters: [
        {type: 'string', description: '', name: 'env', required: true},
        {type: 'string', description: '', name: 'version', required: true},
        {type: 'string', description: '', name: 'api_name', required: false},
        {type: 'string', description: '', name: 'env', required: false},
        {type: 'string', description: '', name: 'config', required: false},
      ],
    },
  ]

  const attachments: ArtifactMetadata[] = [
    {
      filename: 'taro.yaml',
      artifact_id: 'abc123',
      data_hash: '',
      data_size: 883312,
      description: '',
      source: '',
      created_at: '',
      label: 'null',
    },
    {
      filename: 'sesame.yaml',
      artifact_id: 'def456',
      data_hash: '',
      data_size: 123456,
      description: '',
      source: '',
      created_at: '',
      label: 'null',
    },
  ]

  const cases = [
    {
      name: 'parses valid input with all required fields',
      input: '/deploy env:prod version:1.0.0',
      expectedArgs: {env: 'prod', version: '1.0.0'},
      missingFields: [],
    },
    {
      name: 'detects missing required fields',
      input: '/deploy env:prod',
      expectedArgs: {env: 'prod'},
      missingFields: ['version'],
    },
    {
      name: 'parses multi-part values',
      input: '/deploy env:prod version:1.0.0 stable',
      expectedArgs: {env: 'prod', version: '1.0.0 stable'},
      missingFields: [],
    },
    {
      name: 'parses values correctly with colons or spaces',
      input:
        '/deploy env:prod api_name:toystore:1.0.0     stable version: 1.0.0',
      expectedArgs: {
        env: 'prod',
        api_name: 'toystore:1.0.0     stable',
        version: '1.0.0',
      },
      missingFields: [],
    },
    {
      name: 'parses values correctly that are json',
      input:
        '/deploy env:prod version: 1.0.0 api_name: { "path-description": { "description": "All paths lead to the rainbow!!!" } }',
      expectedArgs: {
        env: 'prod',
        api_name:
          '{ "path-description": { "description": "All paths lead to the rainbow!!!" } }',
        version: '1.0.0',
      },
      missingFields: [],
    },
    {
      name: 'parses values correctly that are yaml',
      input:
        '/deploy env:prod version: 7.7.7 api_name: command: deploy arguments: - region: eu - name: debug_mode',
      expectedArgs: {
        env: 'prod',
        api_name: 'command: deploy arguments: - region: eu - name: debug_mode',
        version: '7.7.7',
      },
      missingFields: [],
    },
  ]

  test.each(cases)('$name', ({input, expectedArgs, missingFields}) => {
    const result = parseInputandValidate(input, commands, attachments)
    expect(result.parsedCommandArgs).toMatchObject(expectedArgs)
    expect(result.missingFields).toEqual(missingFields)
  })

  it('resolves @ file reference to attachment metadata', () => {
    const input = '/deploy env:prod config: @taro.yaml version:1.0.0'
    const result = parseInputandValidate(input, commands, attachments)
    expect(result.parsedCommandArgs.config).toEqual(attachments[0])
  })

  it('throws error on invalid format', () => {
    const input = '/deploy env prod'
    expect(() => parseInputandValidate(input, commands, attachments)).toThrow(
      "Invalid format for part: 'env'. Expected 'key:value' or 'key: value'.",
    )
  })

  it('handles quoted @ file reference', () => {
    const input = '/deploy config: @"sesame.yaml" env:prod version:1.0.0'
    const result = parseInputandValidate(input, commands, attachments)
    expect(result.parsedCommandArgs.config).toEqual(attachments[1])
  })
})

describe('isAgentResponse', () => {
  test.each([
    ['agent-plan', true],
    ['agent-message', true],
    ['selection-request', true],
    ['tool-response', false],
    ['user-message', false],
  ])('returns %s for %s', (input, expected) => {
    expect(isAgentResponse(input)).toBe(expected)
  })
})

describe('shouldResetToolcalls', () => {
  test.each([
    ['agent-message', {}, true],
    ['selection-request', {}, true],
    ['agent-plan', {planned_toolcalls: []}, true],
    ['agent-plan', {planned_toolcalls: [{}]}, false],
    ['tool-response', {}, false],
  ])('returns %s for %s', (type, payload, expected) => {
    expect(shouldResetToolcalls(type, payload)).toBe(expected)
  })
})

describe('shouldUpdatePlan', () => {
  test.each([
    ['agent-plan', {executed_toolcalls: [{}], planned_toolcalls: [{}]}, true],
    ['agent-plan', {planned_toolcalls: [{}]}, undefined],
    ['agent-plan', {executed_toolcalls: [{}], planned_toolcalls: []}, false],
    [
      'agent-message',
      {executed_toolcalls: [{}], planned_toolcalls: [{}]},
      false,
    ],
  ])('returns correct value for %s', (type, payload, expected) => {
    expect(shouldUpdatePlan(type, payload)).toBe(expected)
  })
})
