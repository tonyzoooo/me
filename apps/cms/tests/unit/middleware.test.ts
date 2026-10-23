import { describe, expect, it } from 'vitest'
import { isDirectCmsVisit } from '@/middleware'

const CMS_HOST = 'tonyzoooo-me-cms.vercel.app'
const SITE_HOST = 'tonyzoooo.me'

describe('isDirectCmsVisit', () => {
  it('redirects a direct visit to the cms url', () => {
    expect(isDirectCmsVisit(CMS_HOST, CMS_HOST, CMS_HOST)).toBe(true)
  })

  it('passes through requests proxied from the site domain', () => {
    expect(isDirectCmsVisit(CMS_HOST, SITE_HOST, CMS_HOST)).toBe(false)
  })

  it('fails closed when x-forwarded-host is missing', () => {
    expect(isDirectCmsVisit(CMS_HOST, null, CMS_HOST)).toBe(false)
  })

  it('ignores preview deployments and localhost', () => {
    expect(isDirectCmsVisit('localhost:3000', 'localhost:3000', CMS_HOST)).toBe(false)
    expect(isDirectCmsVisit('abc123.vercel.app', 'abc123.vercel.app', CMS_HOST)).toBe(false)
  })

  it('does nothing when the host header is missing', () => {
    expect(isDirectCmsVisit(null, CMS_HOST, CMS_HOST)).toBe(false)
  })
})
