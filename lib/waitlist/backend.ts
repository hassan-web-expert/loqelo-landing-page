import 'server-only'
import type { WaitlistRole } from './schema'

export type WaitlistContact = {
  email: string
  country: string
  role: WaitlistRole
  entityType: 'individual' | 'business' | null
  locale: string
  consentAt: string
}

/**
 * Brevo (free tier: unlimited contacts, CSV export, separate lists per role).
 * Customers and providers go into two lists, plus a SIGNUP_ROLE attribute for filtering.
 * To swap providers, implement another function with the same signature and change `saveContact`.
 */
async function saveToBrevo(contact: WaitlistContact, apiKey: string) {
  const listId = Number(
    contact.role === 'customer' ? process.env.BREVO_LIST_ID_CUSTOMERS : process.env.BREVO_LIST_ID_PROVIDERS,
  )
  const response = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      email: contact.email,
      updateEnabled: true,
      listIds: Number.isFinite(listId) && listId > 0 ? [listId] : undefined,
      attributes: {
        SIGNUP_ROLE: contact.role,
        COUNTRY_CODE: contact.country,
        ENTITY_TYPE: contact.entityType ?? '',
        LOCALE: contact.locale,
        CONSENT_AT: contact.consentAt,
      },
    }),
    cache: 'no-store',
  })
  if (!response.ok) {
    throw new Error(`Brevo responded with ${response.status}`)
  }
}

export async function saveContact(contact: WaitlistContact) {
  const brevoKey = process.env.BREVO_API_KEY
  if (brevoKey) return saveToBrevo(contact, brevoKey)

  if (process.env.VERCEL_ENV === 'production') {
    throw new Error('Waitlist backend is not configured (BREVO_API_KEY missing)')
  }
  console.warn('[waitlist] BREVO_API_KEY not set — submission accepted but not stored (preview/dev mode).')
}
