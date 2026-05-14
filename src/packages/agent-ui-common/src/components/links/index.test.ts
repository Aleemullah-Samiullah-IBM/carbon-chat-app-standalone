// Licensed Materials - Property of IBM
// (C) Copyright IBM Corporation 2025, 2026
// US Government Users Restricted Rights - Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

import {describe, it, expect} from 'vitest'
import {documentationLink, getLearnMoreLink} from './index'
import {documentationLink as originalDocumentationLink} from './documentationLink'
import {getLearnMoreLink as originalGetLearnMoreLink} from './learnMoreLink'
import * as indexModule from './index'

describe('links/index', () => {
  describe('exports', () => {
    it('exports documentationLink function', () => {
      expect(documentationLink).toBeDefined()
      expect(typeof documentationLink).toBe('function')
    })

    it('exports getLearnMoreLink function', () => {
      expect(getLearnMoreLink).toBeDefined()
      expect(typeof getLearnMoreLink).toBe('function')
    })
  })

  describe('re-exported functions', () => {
    it('documentationLink is the same function from documentationLink module', () => {
      expect(documentationLink).toBe(originalDocumentationLink)
    })

    it('getLearnMoreLink is the same function from learnMoreLink module', () => {
      expect(getLearnMoreLink).toBe(originalGetLearnMoreLink)
    })
  })

  describe('module structure', () => {
    it('exports exactly two named exports', () => {
      const exportNames = Object.keys(indexModule).filter(
        key => key !== 'default',
      )
      expect(exportNames).toHaveLength(2)
      expect(exportNames).toContain('documentationLink')
      expect(exportNames).toContain('getLearnMoreLink')
    })

    it('does not have a default export', () => {
      expect((indexModule as any).default).toBeUndefined()
    })
  })
})
