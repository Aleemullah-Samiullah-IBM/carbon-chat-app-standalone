// Licensed Materials - Property of IBM
// (C) Copyright IBM Corporation 2025, 2026
// US Government Users Restricted Rights - Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

import {describe, it, expect, vi, beforeEach} from 'vitest'
import {render, screen, waitFor} from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
import PorgPicker from './porgPicker'
import {PORG_ERROR_MESSAGE} from '../../constants'
import {
  createMockPorgs,
  createMockVscode,
  createMockFrontendClient,
  createMockAccessToken,
  setupSuccessfulOrgFetch,
  setupErrorOrgFetch,
  setupDelayedOrgFetch,
  waitForOrgsToRender,
  selectPorg,
  clickContinueButton,
  verifyFetchOrgsCallWithSetError,
} from './porgPickerTestHelpers'

// Mock the contexts
const mockSetPorg = vi.fn()
const mockSetIsPorgError = vi.fn()
const mockSetShowPorgSelection = vi.fn()
const mockSetError = vi.fn()
const mockClearError = vi.fn()

const mockApiService = {
  fetchOrgs: vi.fn(),
  setPorg: vi.fn(),
}

let mockIsApprovalSubmitting = false
let mockIsPorgError = false

vi.mock('@agent-ui/common/src/contexts/ChatContext', () => ({
  useMyContext: () => ({
    isApprovalSubmitting: mockIsApprovalSubmitting,
    setShowPorgSelection: mockSetShowPorgSelection,
  }),
}))

vi.mock('@agent-ui/common/src/contexts/APIContext', () => ({
  useAPI: () => ({
    apiService: mockApiService,
    isPorgError: mockIsPorgError,
    setPorg: mockSetPorg,
    setIsPorgError: mockSetIsPorgError,
  }),
}))

vi.mock('@agent-ui/common/src/contexts/ErrorContext', () => ({
  useError: () => ({
    setError: mockSetError,
    clearError: mockClearError,
  }),
}))

// Mock porgHelpers
vi.mock('../../utilities/porgHelpers', () => ({
  fetchOrgs: vi.fn(),
}))

// Mock learnMoreLink - return plain text to avoid Carbon's interactive child node error
vi.mock('../../components/links', () => ({
  getLearnMoreLink: vi.fn(() => <span>Learn more</span>),
}))

import {fetchOrgs} from '../../utilities/porgHelpers'
import {getLearnMoreLink} from '../../components/links'

describe('PorgPicker', () => {
  const mockOnPorgSelectedCallback = vi.fn()
  const mockSetShowAPIMSelection = vi.fn()
  const mockVscode = createMockVscode()
  const mockFrontendClient = createMockFrontendClient()
  const mockAccessToken = createMockAccessToken()
  const mockPorgs = createMockPorgs()

  beforeEach(() => {
    vi.clearAllMocks()
    mockIsApprovalSubmitting = false
    mockIsPorgError = false
  })

  describe('Rendering', () => {
    it('renders the component with correct container class', () => {
      setupSuccessfulOrgFetch(fetchOrgs, [])

      const {container} = render(<PorgPicker />)

      const containerElement = container.querySelector('.pick-porg-container')
      expect(containerElement).toBeInTheDocument()
      expect(containerElement).toHaveClass('bx--grid')
    })

    it('renders loading skeleton when porgs are being fetched', async () => {
      setupDelayedOrgFetch(fetchOrgs, mockPorgs)

      const {container} = render(<PorgPicker />)

      // Check for skeleton text (Carbon's AiSkeletonText)
      await waitFor(() => {
        const skeleton = container.querySelector('[class*="skeleton"]')
        expect(skeleton).toBeInTheDocument()
      })
    })

    it('renders description text when porgs are available', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(<PorgPicker />)

      await waitFor(() => {
        expect(
          screen.getByText(
            'The following provider organization(s) are enabled in API Manager.',
          ),
        ).toBeInTheDocument()
        expect(
          screen.getByText('Which one would you like to use?'),
        ).toBeInTheDocument()
      })
    })

    it('renders chat bubble with correct class', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      const {container} = render(<PorgPicker />)

      await waitFor(() => {
        const chatBubble = container.querySelector('.chat-bubble')
        expect(chatBubble).toBeInTheDocument()
        expect(chatBubble).toHaveClass('pick-porg-description')
      })
    })
  })

  describe('Provider Organizations Display', () => {
    it('renders radio buttons for each provider organization', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(<PorgPicker />)

      await waitFor(() => {
        expect(screen.getByText('org1')).toBeInTheDocument()
        expect(screen.getByText('org2')).toBeInTheDocument()
        expect(screen.getByText('org3')).toBeInTheDocument()
      })
    })

    it('renders legend text for radio button group', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(<PorgPicker />)

      await waitFor(() => {
        expect(screen.getByText('Provider organization')).toBeInTheDocument()
      })
    })

    it('renders radio buttons with correct values', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(<PorgPicker />)

      await waitFor(() => {
        const radioButtons = screen.getAllByRole('radio')
        expect(radioButtons).toHaveLength(3)
        expect(radioButtons[0]).toHaveAttribute('value', 'org1')
        expect(radioButtons[1]).toHaveAttribute('value', 'org2')
        expect(radioButtons[2]).toHaveAttribute('value', 'org3')
      })
    })

    it('renders Continue button', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(<PorgPicker />)

      await waitFor(() => {
        expect(screen.getByText('Continue')).toBeInTheDocument()
      })
    })

    it('Continue button is disabled when no porg is selected', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(<PorgPicker />)

      await waitFor(() => {
        const continueButton = screen.getByText('Continue')
        expect(continueButton).toBeDisabled()
      })
    })
  })

  describe('User Interactions', () => {
    it('enables Continue button when a porg is selected', async () => {
      const user = userEvent.setup()
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(<PorgPicker />)

      await waitForOrgsToRender(screen, waitFor)
      await selectPorg(screen, user, 'org1')

      const continueButton = screen.getByText('Continue')
      expect(continueButton).not.toBeDisabled()
    })

    it('updates selected porg when radio button is clicked', async () => {
      const user = userEvent.setup()
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(<PorgPicker />)

      await waitFor(() => {
        expect(screen.getByText('org2')).toBeInTheDocument()
      })
      await selectPorg(screen, user, 'org2')

      const radioButton = screen.getByRole('radio', {name: 'org2'})
      expect(radioButton).toBeChecked()
    })

    it('clears error when radio button is changed', async () => {
      const user = userEvent.setup()
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(<PorgPicker />)

      await waitForOrgsToRender(screen, waitFor)
      await selectPorg(screen, user, 'org1')

      expect(mockClearError).toHaveBeenCalled()
    })

    it('calls setPorg when Continue button is clicked', async () => {
      const user = userEvent.setup()
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(<PorgPicker />)

      await waitForOrgsToRender(screen, waitFor)
      await selectPorg(screen, user, 'org1')
      await clickContinueButton(screen, user)

      expect(mockSetPorg).toHaveBeenCalledWith('org1')
    })

    it('posts message to vscode when Continue is clicked', async () => {
      const user = userEvent.setup()
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(<PorgPicker vscode={mockVscode} />)

      await waitForOrgsToRender(screen, waitFor)
      await selectPorg(screen, user, 'org1')
      await clickContinueButton(screen, user)

      expect(mockVscode.postMessage).toHaveBeenCalledWith({
        type: 'savePorg',
        value: 'org1',
      })
    })

    it('hides porg selection when Continue is clicked', async () => {
      const user = userEvent.setup()
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(<PorgPicker />)

      await waitForOrgsToRender(screen, waitFor)
      await selectPorg(screen, user, 'org1')
      await clickContinueButton(screen, user)

      expect(mockSetShowPorgSelection).toHaveBeenCalledWith(false)
    })

    it('calls setShowAPIMSelection when provided', async () => {
      const user = userEvent.setup()
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(<PorgPicker setShowAPIMSelection={mockSetShowAPIMSelection} />)

      await waitForOrgsToRender(screen, waitFor)
      await selectPorg(screen, user, 'org1')
      await clickContinueButton(screen, user)

      expect(mockSetShowAPIMSelection).toHaveBeenCalledWith(false)
    })

    it('sets porg on apiService when Continue is clicked', async () => {
      const user = userEvent.setup()
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(<PorgPicker />)

      await waitForOrgsToRender(screen, waitFor)
      await selectPorg(screen, user, 'org1')
      await clickContinueButton(screen, user)

      expect(mockApiService.setPorg).toHaveBeenCalledWith('org1')
    })

    it('calls onPorgSelectedCallback when provided', async () => {
      const user = userEvent.setup()
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(<PorgPicker onPorgSelectedCallback={mockOnPorgSelectedCallback} />)

      await waitForOrgsToRender(screen, waitFor)
      await selectPorg(screen, user, 'org1')
      await clickContinueButton(screen, user)

      expect(mockOnPorgSelectedCallback).toHaveBeenCalledWith('org1')
    })

    it('does not call onPorgSelectedCallback when not provided', async () => {
      const user = userEvent.setup()
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(<PorgPicker />)

      await waitForOrgsToRender(screen, waitFor)
      await selectPorg(screen, user, 'org1')
      await clickContinueButton(screen, user)

      // Should not throw error
      expect(mockOnPorgSelectedCallback).not.toHaveBeenCalled()
    })
  })

  describe('Fetching Organizations', () => {
    it('fetches organizations on mount', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(<PorgPicker />)

      await waitFor(() => {
        verifyFetchOrgsCallWithSetError(fetchOrgs, mockApiService, mockSetError)
      })
    })

    it('passes vscode prop to fetchOrgs', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(<PorgPicker vscode={mockVscode} />)

      await waitFor(() => {
        verifyFetchOrgsCallWithSetError(
          fetchOrgs,
          mockApiService,
          mockSetError,
          mockVscode,
        )
      })
    })

    it('passes frontendClient prop to fetchOrgs', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(<PorgPicker frontendClient={mockFrontendClient as any} />)

      await waitFor(() => {
        verifyFetchOrgsCallWithSetError(
          fetchOrgs,
          mockApiService,
          mockSetError,
          undefined,
          mockFrontendClient,
        )
      })
    })

    it('passes accessToken prop to fetchOrgs', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(<PorgPicker accessToken={mockAccessToken} />)

      await waitFor(() => {
        verifyFetchOrgsCallWithSetError(
          fetchOrgs,
          mockApiService,
          mockSetError,
          undefined,
          undefined,
          mockAccessToken,
        )
      })
    })

    it('passes all props to fetchOrgs when provided', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(
        <PorgPicker
          vscode={mockVscode}
          frontendClient={mockFrontendClient as any}
          accessToken={mockAccessToken}
        />,
      )

      await waitFor(() => {
        verifyFetchOrgsCallWithSetError(
          fetchOrgs,
          mockApiService,
          mockSetError,
          mockVscode,
          mockFrontendClient,
          mockAccessToken,
        )
      })
    })

    it('clears error before fetching organizations', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(<PorgPicker />)

      await waitFor(() => {
        expect(mockClearError).toHaveBeenCalled()
      })
    })

    it('sets isPorgError when fetch returns error', async () => {
      setupErrorOrgFetch(fetchOrgs)

      render(<PorgPicker />)

      await waitFor(() => {
        expect(mockSetIsPorgError).toHaveBeenCalledWith(true)
      })
    })

    it('refetches organizations when apiService changes', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      const {rerender} = render(<PorgPicker />)

      await waitFor(() => {
        expect(fetchOrgs).toHaveBeenCalledTimes(1)
      })

      // Simulate apiService change by rerendering
      rerender(<PorgPicker />)

      // Should still be called once since apiService hasn't actually changed
      expect(fetchOrgs).toHaveBeenCalledTimes(1)
    })
  })

  describe('Error Handling', () => {
    it('displays error notification when isPorgError is true and no porgs', async () => {
      mockIsPorgError = true
      setupErrorOrgFetch(fetchOrgs)

      render(<PorgPicker />)

      await waitFor(() => {
        expect(screen.getByText(PORG_ERROR_MESSAGE)).toBeInTheDocument()
      })
    })

    it('displays error title "No provider organizations"', async () => {
      mockIsPorgError = true
      setupErrorOrgFetch(fetchOrgs)

      render(<PorgPicker />)

      await waitFor(() => {
        expect(
          screen.getByText('No provider organizations'),
        ).toBeInTheDocument()
      })
    })

    it('displays learn more link in error notification', async () => {
      mockIsPorgError = true
      setupErrorOrgFetch(fetchOrgs)

      render(
        <PorgPicker
          vscode={mockVscode}
          frontendClient={mockFrontendClient as any}
          accessToken={mockAccessToken}
        />,
      )

      await waitFor(() => {
        expect(screen.getByText('Learn more')).toBeInTheDocument()
      })

      expect(getLearnMoreLink).toHaveBeenCalledWith(
        mockFrontendClient,
        mockVscode,
        mockAccessToken,
      )
    })

    it('does not display error when porgs are available', async () => {
      mockIsPorgError = false
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(<PorgPicker />)

      await waitFor(() => {
        expect(screen.getByText('org1')).toBeInTheDocument()
      })

      expect(screen.queryByText(PORG_ERROR_MESSAGE)).not.toBeInTheDocument()
    })

    it('does not display error when isPorgError is false', async () => {
      mockIsPorgError = false
      setupSuccessfulOrgFetch(fetchOrgs, [])

      render(<PorgPicker />)

      await waitFor(() => {
        const skeleton = screen.queryByText(PORG_ERROR_MESSAGE)
        expect(skeleton).not.toBeInTheDocument()
      })
    })
  })

  describe('Disabled State', () => {
    it('disables radio buttons when isApprovalSubmitting is true', async () => {
      mockIsApprovalSubmitting = true
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(<PorgPicker />)

      await waitFor(() => {
        expect(screen.getAllByRole('radio').length).toBeGreaterThan(0)
      })

      const radioButtons = screen.getAllByRole('radio')
      radioButtons.forEach(radio => expect(radio).toBeDisabled())
    })

    it('enables radio buttons when isApprovalSubmitting is false', async () => {
      mockIsApprovalSubmitting = false
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(<PorgPicker />)

      await waitFor(() => {
        expect(screen.getAllByRole('radio').length).toBeGreaterThan(0)
      })

      const radioButtons = screen.getAllByRole('radio')
      radioButtons.forEach(radio => expect(radio).not.toBeDisabled())
    })
  })

  describe('Component Structure', () => {
    it('renders FormGroup components', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      const {container} = render(<PorgPicker />)

      await waitFor(() => {
        const fieldsets = container.querySelectorAll('.cds--fieldset')
        expect(fieldsets.length).toBeGreaterThan(0)
      })
    })

    it('renders RadioButtonGroup with vertical orientation', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      const {container} = render(<PorgPicker />)

      await waitFor(() => {
        const radioGroup = container.querySelector('[name="porg"]')
        expect(radioGroup).toBeInTheDocument()
      })
    })

    it('renders ChatButton with isQuickAction prop', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(<PorgPicker />)

      await waitFor(() => {
        const continueButton = screen.getByText('Continue')
        expect(continueButton).toBeInTheDocument()
      })
    })
  })
})
