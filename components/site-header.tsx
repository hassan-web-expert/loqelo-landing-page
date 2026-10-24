'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useI18n } from '@/components/i18n-provider'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const { locale, messages } = useI18n()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 12))

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'border-b border-border/70 bg-background/75 backdrop-blur-xl' : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:h-18">
        <Link href={`/${locale}`} aria-label={messages.nav.home} className="shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Image src="/brand/logo.png" alt="Loqelo" width={2400} height={610} priority className="h-7 w-auto md:h-8" />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-7 text-sm text-muted-foreground lg:flex">
          <a href="#how-it-works" className="transition-colors hover:text-foreground">{messages.nav.howItWorks}</a>
          <a href="#launch" className="transition-colors hover:text-foreground">{messages.nav.launch}</a>
          <a href="#waitlist" className="transition-colors hover:text-foreground">{messages.nav.waitlist}</a>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher className="hidden sm:flex" />
          <a
            href="#waitlist"
            onClick={() => track('click_cta_customer', { location: 'nav' })}
            className="inline-flex h-9 items-center rounded-full bg-foreground px-4 text-sm font-medium text-background transition-transform hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {messages.nav.joinWaitlist}
          </a>
        </div>
      </div>
    </header>
  )
}
