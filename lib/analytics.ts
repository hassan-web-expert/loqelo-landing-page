/**
 * Consent-gated GA4 wrapper. Events are dropped unless the user accepted analytics
 * and gtag has loaded. Only whitelisted, non-identifying params are ever sent.
 */

export type AnalyticsEvent =
  | 'view_hero'
  | 'play_video'
  | 'click_cta_customer'
  | 'click_cta_provider'
  | 'submit_customer_form'
  | 'submit_provider_form'
  | 'form_error'

type SafeParams = {
  form?: 'customer' | 'provider'
  reason?: 'validation' | 'rate_limited' | 'server'
  location?: 'hero' | 'nav' | 'countdown' | 'footer'
}

export const CONSENT_COOKIE = 'loqelo_consent'
export type ConsentState = 'granted' | 'denied'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export function track(event: AnalyticsEvent, params: SafeParams = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  const safe: SafeParams = {}
  if (params.form) safe.form = params.form
  if (params.reason) safe.reason = params.reason
  if (params.location) safe.location = params.location
  window.gtag('event', event, safe)
}

export function readConsent(): ConsentState | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=(granted|denied)`))
  return (match?.[1] as ConsentState | undefined) ?? null
}

export function writeConsent(value: ConsentState) {
  const maxAge = 60 * 60 * 24 * 180
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${maxAge}; samesite=lax${
    location.protocol === 'https:' ? '; secure' : ''
  }`
  window.dispatchEvent(new CustomEvent('loqelo:consent', { detail: value }))
}

export function resetConsent() {
  document.cookie = `${CONSENT_COOKIE}=; path=/; max-age=0`
  window.dispatchEvent(new CustomEvent('loqelo:consent', { detail: null }))
}
