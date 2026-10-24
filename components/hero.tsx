'use client'

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { useI18n } from '@/components/i18n-provider'
import { VideoCard } from '@/components/video-card'
import { ScreensStrip } from '@/components/screens-strip'
import { track } from '@/lib/analytics'

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const { messages } = useI18n()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60])

  useEffect(() => {
    const timer = window.setTimeout(() => track('view_hero'), 800)
    return () => window.clearTimeout(timer)
  }, [])

  const fade = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease } }

  return (
    <section ref={ref} className="relative overflow-hidden px-5 pb-16 pt-28 md:pb-24 md:pt-36">
      <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px]" />
      <div className="mx-auto max-w-4xl text-center">
        <motion.p {...fade(0)} className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
          <span className="size-1.5 rounded-full bg-brand-mint" aria-hidden="true" />
          {messages.hero.eyebrow}
        </motion.p>
        <motion.h1 {...fade(0.05)} className="text-balance text-display font-semibold tracking-tight text-foreground">
          {messages.hero.title}
        </motion.h1>
        <motion.p {...fade(0.12)} className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          {messages.hero.subtitle}
        </motion.p>
        <motion.div {...fade(0.2)} className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <a
            href="#join-customer"
            onClick={() => track('click_cta_customer', { location: 'hero' })}
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-[0_10px_30px_-12px_oklch(0.51_0.09_205/0.7)] transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {messages.hero.ctaCustomer}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
          <a
            href="#join-provider"
            onClick={() => track('click_cta_provider', { location: 'hero' })}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-medium text-foreground transition-all hover:-translate-y-0.5 hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {messages.hero.ctaProvider}
          </a>
        </motion.div>
        <motion.p {...fade(0.28)} className="mt-6 text-sm text-muted-foreground">
          {messages.hero.trust}
        </motion.p>
      </div>

      <motion.div style={{ y }} {...fade(0.35)} className="mx-auto mt-14 max-w-4xl md:mt-20">
        <VideoCard />
      </motion.div>
      <ScreensStrip />
    </section>
  )
}
