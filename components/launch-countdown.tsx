'use client'

import { useSyncExternalStore } from 'react'
import { useI18n } from '@/components/i18n-provider'
import { Reveal } from '@/components/reveal'
import { track } from '@/lib/analytics'

export const LAUNCH_DATE = new Date('2027-02-01T00:00:00+01:00')

function subscribe(callback: () => void) {
  const id = window.setInterval(callback, 1000)
  return () => window.clearInterval(id)
}
const getSecond = () => Math.floor(Date.now() / 1000)
const getServerSecond = () => null

export function LaunchCountdown() {
  const { messages } = useI18n()
  const nowSec = useSyncExternalStore(subscribe, getSecond, getServerSecond)

  const remaining = nowSec === null ? null : Math.max(0, Math.floor(LAUNCH_DATE.getTime() / 1000) - nowSec)
  const units = [
    { label: messages.countdown.days, value: remaining === null ? null : Math.floor(remaining / 86400) },
    { label: messages.countdown.hours, value: remaining === null ? null : Math.floor((remaining % 86400) / 3600) },
    { label: messages.countdown.minutes, value: remaining === null ? null : Math.floor((remaining % 3600) / 60) },
    { label: messages.countdown.seconds, value: remaining === null ? null : remaining % 60 },
  ]

  return (
    <section id="launch" aria-labelledby="launch-title" className="scroll-mt-20 px-5 py-6">
      <Reveal className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[24px] bg-brand-deep px-6 py-12 text-white md:px-12 md:py-16">
          <div aria-hidden="true" className="countdown-glow pointer-events-none absolute inset-0" />
          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-md">
              <p className="text-sm font-medium text-brand-mint">{messages.countdown.eyebrow}</p>
              <h2 id="launch-title" className="mt-3 text-balance text-heading font-semibold tracking-tight">
                {messages.countdown.title}
              </h2>
              <p className="mt-3 text-white/70">{messages.countdown.body}</p>
              <a
                href="#waitlist"
                onClick={() => track('click_cta_customer', { location: 'countdown' })}
                className="mt-6 inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-medium text-brand-deep transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mint focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep"
              >
                {messages.nav.joinWaitlist}
              </a>
            </div>
            <div>
              <p className="sr-only">{messages.countdown.srLabel}</p>
              <dl className="grid grid-cols-4 gap-2 sm:gap-4">
                {units.map((unit) => (
                  <div key={unit.label} className="flex min-w-0 flex-col items-center rounded-2xl border border-white/10 bg-white/5 px-2 py-4 sm:min-w-24 sm:px-4 sm:py-5">
                    <dd className="order-1 font-mono text-3xl font-semibold tabular-nums tracking-tight sm:text-5xl">
                      {unit.value === null ? '--' : String(unit.value).padStart(2, '0')}
                    </dd>
                    <dt className="order-2 mt-2 text-[10px] uppercase tracking-widest text-white/60 sm:text-xs">{unit.label}</dt>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
