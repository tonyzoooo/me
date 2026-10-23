import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// True only when a request targets the CMS' default vercel.app URL directly.
// Requests proxied from the web project's rewrites arrive with
// x-forwarded-host set to the site domain and must pass through untouched,
// or the public domain would redirect to itself. The strict equality fails
// closed: a missing forwarded host never redirects.
export function isDirectCmsVisit(
  host: string | null,
  forwardedHost: string | null,
  cmsHost: string,
): boolean {
  return host === cmsHost && forwardedHost === cmsHost
}

// Direct visits to the CMS' default vercel.app URL are normalized to the
// public domain.
export async function middleware(request: NextRequest) {
  const cmsHost = process.env.VERCEL_PROJECT_PRODUCTION_URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (!cmsHost || !siteUrl) {
    return NextResponse.next()
  }

  const host = request.headers.get('host')
  const forwardedHost = request.headers.get('x-forwarded-host')

  if (isDirectCmsVisit(host, forwardedHost, cmsHost)) {
    return NextResponse.redirect(
      `${siteUrl.replace(/\/$/, '')}${request.nextUrl.pathname}${request.nextUrl.search}`,
      308,
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
