'use server'

import { createHash } from 'node:crypto'
import { headers } from 'next/headers'
import { rateLimit } from '@/lib/rate-limit'
import { saveContact } from '@/lib/waitlist/backend'
import { waitlistSubmissionSchema, type WaitlistResult } from '@/lib/waitlist/schema'

const MIN_FILL_MS = 1500

export async function joinWaitlist(input: unknown): Promise<WaitlistResult> {
  const requestHeaders = await headers()
  const ip = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() || requestHeaders.get('x-real-ip') || 'unknown'
  const ipKey = createHash('sha256').update(ip).digest('hex').slice(0, 32)

  if (!rateLimit(ipKey)) return { ok: false, error: 'rateLimited' }

  const parsed = waitlistSubmissionSchema.safeParse(input)
  if (!parsed.success) {
    const honeypotTriggered = parsed.error.issues.some((issue) => issue.path[0] === 'website')
    return honeypotTriggered ? { ok: true } : { ok: false, error: 'invalid' }
  }

  const data = parsed.data
  if (Date.now() - data.startedAt < MIN_FILL_MS) return { ok: true }

  try {
    await saveContact({
      email: data.email.toLowerCase(),
      country: data.country,
      role: data.role,
      entityType: data.entityType || null,
      locale: data.locale,
      consentAt: new Date().toISOString(),
    })
    return { ok: true }
  } catch (error) {
    console.error('[waitlist] failed to save contact:', error instanceof Error ? error.message : 'unknown error')
    return { ok: false, error: 'server' }
  }
}
