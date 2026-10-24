import en from '@/messages/en.json'
import pl from '@/messages/pl.json'

export const locales = ['en', 'pl'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'
export const LOCALE_COOKIE = 'NEXT_LOCALE'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  pl: 'Polski',
}

/** Country (ISO 3166-1 alpha-2) → locale, used as a geo fallback when Accept-Language has no match. */
export const countryLocale: Record<string, Locale> = {
  PL: 'pl',
}

export type Messages = typeof en

const dictionaries: Record<Locale, Messages> = { en, pl }

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value)
}

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale] ?? dictionaries[defaultLocale]
}

export function matchAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null
  const ranked = header
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=')
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 }
    })
    .sort((a, b) => b.q - a.q)
  for (const { tag } of ranked) {
    const base = tag.split('-')[0]
    if (isLocale(base)) return base
  }
  return null
}
