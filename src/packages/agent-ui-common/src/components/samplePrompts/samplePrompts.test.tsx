import {render, screen, fireEvent} from '@testing-library/react'
import {describe, it, expect, vi, beforeEach} from 'vitest'
import {SamplePromptsModal} from './samplePrompts'

beforeEach(() => {
  Object.assign(navigator, {
    clipboard: {
      writeText: vi.fn(),
    },
  })
})

describe('SamplePrompts Modal Component', () => {
  const prompts = [
    'List draft APIs from [providerOrganization] in API Connect.',
    'Review the security definitions of [apiName] in an API Connect instance.',
    'Validate [apiName].',
    'Publish [apiName] on API Connect.',
    'Run test cases for [apiName].',
  ]

  it('renders all sample prompts', () => {
    render(<SamplePromptsModal prompts={prompts} />)

    prompts.forEach(prompt => {
      expect(screen.getByText(prompt)).toBeDefined()
    })
  })

  it('copies prompt text to clipboard when copy button is clicked', () => {
    render(<SamplePromptsModal prompts={prompts} />)

    const copyButtons = screen.getAllByRole('button')
    fireEvent.click(copyButtons[0])

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(prompts[0])
  })
})
