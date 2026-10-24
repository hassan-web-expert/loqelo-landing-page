'use client'

import { createContext, useContext } from 'react'
import type { Locale, Messages } from '@/lib/i18n'

type I18nValue = { locale: Locale; messages: Messages }

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({ locale, messages, children }: I18nValue & { children: React.ReactNode }) {
  return <I18nContext.Provider value={{ locale, messages }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used within I18nProvider')
  return value
}
