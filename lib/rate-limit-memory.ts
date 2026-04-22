// Simple in-memory per-IP rate limiter.
// NOTE: Vercel runs stateless serverless functions — this Map is NOT shared across
// invocations or instances. It provides basic protection against single-burst abuse
// on a cold instance but is not a substitute for Redis-backed limiting (e.g.
// @upstash/ratelimit). Replace before scaling beyond a single-server deployment.

const store = new Map<string, { count: number; resetAt: number }>()

const WINDOW_MS = 60_000 // 1 minute
const MAX_REQUESTS = 5

export function checkRateLimit(ip: string, endpoint: string): { limited: boolean } {
  const key = `${endpoint}:${ip}`
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { limited: false }
  }

  entry.count += 1
  return { limited: entry.count > MAX_REQUESTS }
}
