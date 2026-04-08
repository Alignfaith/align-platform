import { NextRequest, NextResponse } from 'next/server'

const APP_HOST = 'app.alignfaith.com'
const MARKETING_HOSTS = ['alignfaith.com', 'www.alignfaith.com', 'alignfaith.local']

// Marketing paths — internal prefix is /marketing
const MARKETING_ROUTES = ['/', '/about', '/framework', '/book', '/join']

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || ''
  const pathname = req.nextUrl.pathname

  const isMarketingHost = MARKETING_HOSTS.some(h => host === h || host.startsWith(h + ':'))

  if (isMarketingHost) {
    // Only serve defined marketing routes; 404 everything else
    const isKnownMarketingRoute = MARKETING_ROUTES.some(
      r => pathname === r || pathname.startsWith(r === '/' ? '/marketing' : r + '/')
    )

    // Rewrite to internal /marketing prefix
    const url = req.nextUrl.clone()
    url.pathname = `/marketing${pathname === '/' ? '' : pathname}`

    // Prevent direct access to /marketing/* from non-marketing hosts
    return NextResponse.rewrite(url)
  }

  // Block direct access to /marketing/* from app subdomain (keep it internal)
  if (pathname.startsWith('/marketing')) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Run on all paths except _next internals, static files, and API routes
    '/((?!_next/static|_next/image|favicon.ico|icon.png|apple-touch-icon.png|manifest.json|images/).*)',
  ],
}
