import { z } from 'zod'
import { isCountryCode } from '@/lib/countries'

export const roles = ['customer', 'provider'] as const
export type WaitlistRole = (typeof roles)[number]

/** Error messages are translation keys under `waitlist.errors`. */
export const waitlistFormSchema = z.object({
  email: z.string().trim().min(1, { error: 'required' }).max(254, { error: 'invalidEmail' }).email({ error: 'invalidEmail' }),
  country: z.string().refine((v): boolean => isCountryCode(v), { error: 'invalidCountry' }),
  entityType: z.enum(['', 'individual', 'business']),
  consent: z.boolean().refine((v) => v, { error: 'consent' }),
  website: z.string().max(0),
})

export type WaitlistFormValues = z.infer<typeof waitlistFormSchema>

export const waitlistSubmissionSchema = waitlistFormSchema.extend({
  role: z.enum(roles),
  locale: z.string().max(5),
  startedAt: z.number().int().positive(),
})

export type WaitlistSubmission = z.infer<typeof waitlistSubmissionSchema>

export type WaitlistResult =
  | { ok: true }
  | { ok: false; error: 'invalid' | 'rateLimited' | 'server' }
