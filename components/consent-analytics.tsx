'use client'

import Link from 'next/link'
import Script from 'next/script'
import { useSyncExternalStore } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useI18n } from '@/components/i18n-provider'
import { readConsent, writeConsent, type ConsentState } from '@/lib/analytics'

function subscribe(callback: () => void) {
  window.addEventListener('loqelo:consent', callback)
  return () => window.removeEventListener('loqelo:consent', callback)
}
const getServerConsent = (): ConsentState | 'unknown' => 'unknown'
const getConsent = (): ConsentState | 'unset' => readConsent() ?? 'unset'

export function ConsentAnalytics({ gaId }: { gaId?: string }) {
  const { locale, messages } = useI18n()
  const reduce = useReducedMotion()
  const consent = useSyncExternalStore(subscribe, getConsent, getServerConsent)
  const t = messages.consent

  return (
    <>
      {gaId && consent === 'granted' && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      <AnimatePresence>
        {consent === 'unset' && (
          <motion.div
            role="dialog"
            aria-modal="false"
            aria-labelledby="consent-title"
            aria-describedby="consent-body"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: 24 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-[20px] border border-border bg-card/95 p-5 shadow-[0_30px_80px_-30px_oklch(0.26_0.04_215/0.5)] backdrop-blur-xl sm:inset-x-6 sm:bottom-6"
          >
            <h2 id="consent-title" className="text-sm font-semibold">{t.title}</h2>
            <p id="consent-body" className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {t.body}{' '}
              <Link href={`/${locale}/privacy`} className="font-medium text-foreground underline underline-offset-4">{t.more}</Link>
            </p>
            <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => writeConsent('denied')}
                className="h-10 rounded-full border border-border px-4 text-sm font-medium transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {t.decline}
              </button>
              <button
                type="button"
                onClick={() => writeConsent('granted')}
                className="h-10 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {t.accept}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
