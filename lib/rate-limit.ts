import 'server-only'

/**
 * Best-effort in-memory fixed-window limiter (per serverless instance).
 * For strict global limits, swap in Upstash Ratelimit — see README.
 */
const WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS = 5
const hits = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(key: string): boolean {
  const now = Date.now()
  const entry = hits.get(key)
  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS })
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (v.resetAt < now) hits.delete(k)
    }
    return true
  }
  entry.count += 1
  return entry.count <= MAX_REQUESTS
}
