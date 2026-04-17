import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

const APP_HOST = 'app.alignfaith.com'
const MARKETING_HOSTS = ['alignfaith.com', 'www.alignfaith.com', 'alignfaith.local']

// Marketing paths — internal prefix is /marketing
const MARKETING_ROUTES = ['/', '/about', '/framework', '/book', '/join']

// Routes that require a fully complete profile (isComplete: true).
// Listed as prefixes — anything under these paths is gated.
const GATED_PREFIXES = [
  '/matches',
  '/messages',
  '/profile/edit',
  '/settings',
  '/pillars',
  '/checkout',
]

// Returns true if this pathname requires full onboarding completion.
// /dashboard is gated, but /dashboard/assessment and /dashboard/book are carved out
// so users can complete onboarding without being redirected in a loop.
function requiresFullOnboarding(pathname: string): boolean {
  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
    return (
      !pathname.startsWith('/dashboard/assessment') &&
      !pathname.startsWith('/dashboard/book')
    )
  }
  return GATED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

export async function middleware(req: NextRequest) {
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

  // ── Onboarding gate ──────────────────────────────────────────────────────────
  if (requiresFullOnboarding(pathname)) {
    const token = await getToken({ req })

    if (!token) {
      // Not authenticated — redirect to login with return path
      return NextResponse.redirect(
        new URL(`/login?redirect=${encodeURIComponent(pathname)}`, req.url)
      )
    }

    if (!token.profileComplete) {
      // Authenticated but onboarding not finished — route to the correct step
      if (!token.profileSetup) {
        return NextResponse.redirect(new URL('/profile/setup', req.url))
      }
      return NextResponse.redirect(new URL('/dashboard/assessment?onboarding=1', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Run on all paths except _next internals, static files, and API routes
    '/((?!_next/static|_next/image|favicon.ico|icon.png|apple-touch-icon.png|manifest.json|images/|api/).*)',
  ],
}
