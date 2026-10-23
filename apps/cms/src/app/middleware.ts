import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const allowedOrigins = [
  'http://localhost:4321',
  'http://localhost:3000',
  'https://blog.tonyzoooo.me',
  'https://cms.tonyzoooo.me',
]

function isAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  return origin ? allowedOrigins.includes(origin) : true
}

export async function middleware(request: NextRequest) {
  // Handle CORS for API routes
  if (
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.startsWith('/media/')
  ) {
    const response = NextResponse.next()

    if (isAllowedOrigin(request)) {
      response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      response.headers.set('Access-Control-Allow-Credentials', 'true')
    }

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: response.headers,
      })
    }

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*', '/media/:path*'],
}
