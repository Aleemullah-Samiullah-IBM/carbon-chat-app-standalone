import {
  combineDebugResponses,
  formatUserCommand,
  getEventFlags,
  getModalHeading,
  isPlanPending,
  isPlanCompleted,
  hasFilename,
} from './message-helpers'
import {
  AgentMessageEvent,
  PlanEvent,
  PlanItem,
  SelectionRequestEvent,
  UserCommandEvent,
  UserEvent,
} from '../../types'

const mockPlanEvent: PlanEvent = {
  type: 'agent-plan',
  agent_message: 'Mock agent message',
  planned_toolcalls: [],
  executed_toolcalls: [],
  reasoning: null,
}

const mockPlanItem: PlanItem = {
  name: 'mock-tool',
  arguments: {},
  title: 'Mock Tool',
  description: 'A mock tool for testing',
  status: 'success',
}

describe('combineDebugResponses', () => {
  it('combines debug strings from response_details', () => {
    const input = [{debug: 'log1'}, {debug: 'log2'}]
    expect(combineDebugResponses(input)).toBe('log1log2')
  })

  it('returns empty string when input is empty', () => {
    expect(combineDebugResponses([])).toBe('')
  })
})

describe('formatUserCommand', () => {
  it('formats command with simple key-value args', () => {
    const result = formatUserCommand('run', {foo: 'bar', baz: 123})
    expect(result).toBe('run foo:bar baz:123')
  })

  it('formats command with file-like args', () => {
    const result = formatUserCommand('upload', {
      file: {filename: 'test.txt'},
      type: 'text',
    })
    expect(result).toBe('upload file:test.txt type:text')
  })
})

describe('getEventFlags', () => {
  it('detects agent-plan with plan and first message', () => {
    const event: PlanEvent = {
      ...mockPlanEvent,
      type: 'agent-plan',
      planned_toolcalls: [
        {
          name: 'test name 1',
          arguments: {a: 'b', c: 'd'},
          title: 'Test title 1',
          description: 'Test description 1.',
          status: 'success',
          summarized_output: 'Fetched 1 API.',
        },
      ],
      executed_toolcalls: [
        {
          name: 'test name 2',
          arguments: {a: 'b', c: 'd'},
          title: 'Test title 2',
          description: 'Test description 2.',
          status: 'success',
          summarized_output: 'Fetched 2 APIs.',
        },
      ],
      first_message: true,
    }
    const flags = getEventFlags(event)
    expect(flags).toEqual({
      isAgent: true,
      isOnlyAgentMessage: false,
      isSelectionMessage: false,
      isUser: false,
      isUserMessage: false,
      isUserCommand: false,
      isPlanEvent: true,
      isFirstMessage: true,
    })
  })

  it('detects agent-message', () => {
    const event: AgentMessageEvent = {
      ...mockPlanEvent,
      type: 'agent-message',
    }
    const flags = getEventFlags(event)
    expect(flags.isOnlyAgentMessage).toBe(true)
  })

  it('detects selection-request', () => {
    const event: SelectionRequestEvent = {
      ...mockPlanEvent,
      type: 'selection-request',
    }
    const flags = getEventFlags(event)
    expect(flags.isSelectionMessage).toBe(true)
  })

  it('detects user-message', () => {
    const event: UserEvent = {
      type: 'user-message',
      message: 'How are you?',
    }
    const flags = getEventFlags(event)
    expect(flags.isUser).toBe(true)
    expect(flags.isUserMessage).toBe(true)
  })

  it('detects user-command', () => {
    const event: UserCommandEvent = {
      type: 'user-command',
      command: 'get chocolates',
      args: [{a: 'b'}],
    }
    const flags = getEventFlags(event)
    expect(flags.isUser).toBe(true)
    expect(flags.isUserCommand).toBe(true)
  })

  it('handles agent-plan without plan or first message', () => {
    const event: PlanEvent = {
      ...mockPlanEvent,
      type: 'agent-plan',
      first_actions: [],
    }
    const flags = getEventFlags(event)
    expect(flags.isPlanEvent).toBe(true)
    expect(flags.isFirstMessage).toBe(false)
  })
})

describe('getModalHeading', () => {
  it.each([
    ['reqID', 'Request ID'],
    ['chatUUID', 'Chat session ID'],
    ['debug', 'Debug'],
    ['other', 'Unknown'],
  ])('returns correct heading for %s', (input, expected) => {
    expect(getModalHeading(input)).toBe(expected)
  })
})

describe('isPlanPending', () => {
  it('returns true when planned_toolcalls exist', () => {
    const event: PlanEvent = {
      ...mockPlanEvent,
      planned_toolcalls: [{} as any],
    }
    expect(isPlanPending(event)).toBe(true)
  })

  it('returns false when planned_toolcalls is empty', () => {
    const event: PlanEvent = {
      ...mockPlanEvent,
      planned_toolcalls: [],
    }
    expect(isPlanPending(event)).toBe(false)
  })
})

describe('isPlanCompleted', () => {
  it('returns true when executed_toolcalls exist and planned_toolcalls is empty', () => {
    const event: PlanEvent = {
      ...mockPlanEvent,
      executed_toolcalls: [mockPlanItem],
    }
    expect(isPlanCompleted(event)).toBe(true)
  })

  it('returns false when planned_toolcalls is not empty', () => {
    const event = {
      ...mockPlanEvent,
      planned_toolcalls: [mockPlanItem],
    }
    expect(isPlanCompleted(event)).toBe(false)
  })
})

describe('hasFilename', () => {
  it('returns true for object with filename', () => {
    expect(hasFilename({filename: 'file.txt'})).toBe(true)
  })

  it('returns false for object without filename', () => {
    expect(hasFilename({name: 'file.txt'})).toBe(false)
  })

  it('returns null or false for non-object', () => {
    expect(hasFilename(null)).toBe(false)
    expect(hasFilename('string')).toBe(false)
  })
})
