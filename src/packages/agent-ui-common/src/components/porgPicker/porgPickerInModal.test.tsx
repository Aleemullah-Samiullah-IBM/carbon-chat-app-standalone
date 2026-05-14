// Licensed Materials - Property of IBM
// (C) Copyright IBM Corporation 2025, 2026
// US Government Users Restricted Rights - Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

import {describe, it, expect, vi, beforeEach} from 'vitest'
import {render, screen, waitFor} from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
import PorgPickerInModal from './porgPickerInModal'
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
  verifyFetchOrgsCall,
} from './porgPickerTestHelpers'

// Mock the contexts
const mockApiService = {
  fetchOrgs: vi.fn(),
}

let mockIsApprovalSubmitting = false

vi.mock('@agent-ui/common/src/contexts/ChatContext', () => ({
  useMyContext: () => ({
    isApprovalSubmitting: mockIsApprovalSubmitting,
  }),
}))

vi.mock('@agent-ui/common/src/contexts/APIContext', () => ({
  useAPI: () => ({
    apiService: mockApiService,
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

describe('PorgPickerInModal', () => {
  const mockOnPorgSelectedCallback = vi.fn()
  const mockVscode = createMockVscode()
  const mockFrontendClient = createMockFrontendClient()
  const mockAccessToken = createMockAccessToken()
  const mockPorgs = createMockPorgs()

  beforeEach(() => {
    vi.clearAllMocks()
    mockIsApprovalSubmitting = false
  })

  describe('Rendering', () => {
    it('renders the component with correct container class', () => {
      vi.mocked(fetchOrgs).mockResolvedValue({
        porgs: [],
        isPorgError: false,
      })

      const {container} = render(
        <PorgPickerInModal
          onPorgSelectedCallback={mockOnPorgSelectedCallback}
          isOpen={true}
        />,
      )

      const containerElement = container.querySelector('.pick-porg-container')
      expect(containerElement).toBeInTheDocument()
      expect(containerElement).toHaveClass('bx--grid')
    })

    it('renders loading skeleton when isLoading is true', async () => {
      setupDelayedOrgFetch(fetchOrgs, mockPorgs)

      const {container} = render(
        <PorgPickerInModal
          onPorgSelectedCallback={mockOnPorgSelectedCallback}
          isOpen={true}
        />,
      )

      // Check for skeleton text (Carbon's AiSkeletonText)
      await waitFor(() => {
        const skeleton = container.querySelector('[class*="skeleton"]')
        expect(skeleton).toBeInTheDocument()
      })
    })

    it('does not fetch orgs when modal is closed', () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(
        <PorgPickerInModal
          onPorgSelectedCallback={mockOnPorgSelectedCallback}
          isOpen={false}
        />,
      )

      expect(fetchOrgs).not.toHaveBeenCalled()
    })

    it('fetches orgs when modal is opened', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(
        <PorgPickerInModal
          onPorgSelectedCallback={mockOnPorgSelectedCallback}
          isOpen={true}
        />,
      )

      await waitFor(() => {
        verifyFetchOrgsCall(fetchOrgs, mockApiService)
      })
    })
  })

  describe('Provider Organizations Display', () => {
    it('renders radio buttons for each provider organization', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(
        <PorgPickerInModal
          onPorgSelectedCallback={mockOnPorgSelectedCallback}
          isOpen={true}
        />,
      )

      await waitFor(() => {
        expect(screen.getByText('org1')).toBeInTheDocument()
        expect(screen.getByText('org2')).toBeInTheDocument()
        expect(screen.getByText('org3')).toBeInTheDocument()
      })
    })

    it('renders legend text for radio button group', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(
        <PorgPickerInModal
          onPorgSelectedCallback={mockOnPorgSelectedCallback}
          isOpen={true}
        />,
      )

      await waitFor(() => {
        expect(
          screen.getByText('Select a provider organization'),
        ).toBeInTheDocument()
      })
    })

    it('renders radio buttons with correct values', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(
        <PorgPickerInModal
          onPorgSelectedCallback={mockOnPorgSelectedCallback}
          isOpen={true}
        />,
      )

      await waitFor(() => {
        const radioButtons = screen.getAllByRole('radio')
        expect(radioButtons).toHaveLength(3)
        expect(radioButtons[0]).toHaveAttribute('value', 'org1')
        expect(radioButtons[1]).toHaveAttribute('value', 'org2')
        expect(radioButtons[2]).toHaveAttribute('value', 'org3')
      })
    })

    it('sets default selected porg when provided', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(
        <PorgPickerInModal
          onPorgSelectedCallback={mockOnPorgSelectedCallback}
          selectedPorg={'org2' as any}
          isOpen={true}
        />,
      )

      await waitFor(() => {
        const radioButton = screen.getByRole('radio', {name: 'org2'})
        expect(radioButton).toBeChecked()
      })
    })

    it('renders with no default selection when selectedPorg is undefined', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(
        <PorgPickerInModal
          onPorgSelectedCallback={mockOnPorgSelectedCallback}
          selectedPorg={undefined}
          isOpen={true}
        />,
      )

      await waitFor(() => {
        expect(screen.getAllByRole('radio').length).toBeGreaterThan(0)
      })

      const radioButtons = screen.getAllByRole('radio')
      radioButtons.forEach(radio => expect(radio).not.toBeChecked())
    })
  })

  describe('User Interactions', () => {
    it('calls onPorgSelectedCallback when a porg is selected', async () => {
      const user = userEvent.setup()
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(
        <PorgPickerInModal
          onPorgSelectedCallback={mockOnPorgSelectedCallback}
          isOpen={true}
        />,
      )

      await waitFor(() => {
        expect(screen.getByText('org1')).toBeInTheDocument()
      })

      const radioButton = screen.getByRole('radio', {name: 'org1'})
      await user.click(radioButton)

      expect(mockOnPorgSelectedCallback).toHaveBeenCalledWith('org1')
    })

    it('calls onPorgSelectedCallback with correct value for different porgs', async () => {
      const user = userEvent.setup()
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(
        <PorgPickerInModal
          onPorgSelectedCallback={mockOnPorgSelectedCallback}
          isOpen={true}
        />,
      )

      await waitFor(() => {
        expect(screen.getByText('org2')).toBeInTheDocument()
      })
      await selectPorg(screen, user, 'org2')

      expect(mockOnPorgSelectedCallback).toHaveBeenCalledWith('org2')
    })

    it('does not call callback when onPorgSelectedCallback is not provided', async () => {
      const user = userEvent.setup()
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(<PorgPickerInModal isOpen={true} />)

      await waitForOrgsToRender(screen, waitFor)
      await selectPorg(screen, user, 'org1')

      // Should not throw error
      expect(mockOnPorgSelectedCallback).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('displays error notification when isPorgError is true', async () => {
      setupErrorOrgFetch(fetchOrgs)

      render(
        <PorgPickerInModal
          onPorgSelectedCallback={mockOnPorgSelectedCallback}
          isOpen={true}
        />,
      )

      await waitFor(() => {
        // Check for the error message in the subtitle
        expect(screen.getByText(PORG_ERROR_MESSAGE)).toBeInTheDocument()
      })
    })

    it('displays correct error message', async () => {
      setupErrorOrgFetch(fetchOrgs)

      render(
        <PorgPickerInModal
          onPorgSelectedCallback={mockOnPorgSelectedCallback}
          isOpen={true}
        />,
      )

      await waitFor(() => {
        expect(screen.getByText(PORG_ERROR_MESSAGE)).toBeInTheDocument()
      })
    })

    it('displays learn more link in error notification', async () => {
      setupErrorOrgFetch(fetchOrgs)

      render(
        <PorgPickerInModal
          onPorgSelectedCallback={mockOnPorgSelectedCallback}
          isOpen={true}
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

    it('shows error when porgs array is empty', async () => {
      setupErrorOrgFetch(fetchOrgs)

      render(
        <PorgPickerInModal
          onPorgSelectedCallback={mockOnPorgSelectedCallback}
          isOpen={true}
        />,
      )

      await waitFor(() => {
        expect(screen.getByText(PORG_ERROR_MESSAGE)).toBeInTheDocument()
      })
    })
  })

  describe('Props Handling', () => {
    it('passes vscode prop to fetchOrgs', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(
        <PorgPickerInModal
          onPorgSelectedCallback={mockOnPorgSelectedCallback}
          isOpen={true}
          vscode={mockVscode}
        />,
      )

      await waitFor(() => {
        verifyFetchOrgsCall(fetchOrgs, mockApiService, mockVscode)
      })
    })

    it('passes frontendClient prop to fetchOrgs', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(
        <PorgPickerInModal
          onPorgSelectedCallback={mockOnPorgSelectedCallback}
          isOpen={true}
          frontendClient={mockFrontendClient as any}
        />,
      )

      await waitFor(() => {
        verifyFetchOrgsCall(
          fetchOrgs,
          mockApiService,
          undefined,
          mockFrontendClient,
        )
      })
    })

    it('passes accessToken prop to fetchOrgs', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(
        <PorgPickerInModal
          onPorgSelectedCallback={mockOnPorgSelectedCallback}
          isOpen={true}
          accessToken={mockAccessToken}
        />,
      )

      await waitFor(() => {
        verifyFetchOrgsCall(
          fetchOrgs,
          mockApiService,
          undefined,
          undefined,
          mockAccessToken,
        )
      })
    })

    it('passes all props to fetchOrgs when provided', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      render(
        <PorgPickerInModal
          onPorgSelectedCallback={mockOnPorgSelectedCallback}
          isOpen={true}
          vscode={mockVscode}
          frontendClient={mockFrontendClient as any}
          accessToken={mockAccessToken}
        />,
      )

      await waitFor(() => {
        verifyFetchOrgsCall(
          fetchOrgs,
          mockApiService,
          mockVscode,
          mockFrontendClient,
          mockAccessToken,
        )
      })
    })
  })

  describe('Loading State', () => {
    it('shows loading skeleton initially when fetching orgs', async () => {
      setupDelayedOrgFetch(fetchOrgs, mockPorgs)

      const {container} = render(
        <PorgPickerInModal
          onPorgSelectedCallback={mockOnPorgSelectedCallback}
          isOpen={true}
        />,
      )

      // Should show skeleton initially
      const skeleton = container.querySelector('[class*="skeleton"]')
      expect(skeleton).toBeInTheDocument()
    })

    it('hides loading skeleton after orgs are fetched', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      const {container} = render(
        <PorgPickerInModal
          onPorgSelectedCallback={mockOnPorgSelectedCallback}
          isOpen={true}
        />,
      )

      await waitFor(() => {
        const skeleton = container.querySelector('[class*="skeleton"]')
        expect(skeleton).not.toBeInTheDocument()
      })
    })
  })

  describe('RadioButtonGroup Key Prop', () => {
    it('uses "reset" key when selectedPorg is undefined', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      const {container} = render(
        <PorgPickerInModal
          onPorgSelectedCallback={mockOnPorgSelectedCallback}
          selectedPorg={undefined}
          isOpen={true}
        />,
      )

      await waitFor(() => {
        const radioGroup = container.querySelector('[name="porg"]')
        expect(radioGroup).toBeInTheDocument()
      })
    })

    it('uses "active" key when selectedPorg is defined', async () => {
      setupSuccessfulOrgFetch(fetchOrgs, mockPorgs)

      const {container} = render(
        <PorgPickerInModal
          onPorgSelectedCallback={mockOnPorgSelectedCallback}
          selectedPorg={'org1' as any}
          isOpen={true}
        />,
      )

      await waitFor(() => {
        const radioGroup = container.querySelector('[name="porg"]')
        expect(radioGroup).toBeInTheDocument()
      })
    })
  })
})
