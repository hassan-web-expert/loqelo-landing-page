'use client'

import Image from 'next/image'
import Link from 'next/link'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useI18n } from '@/components/i18n-provider'
import { resetConsent } from '@/lib/analytics'

export const CONTACT_EMAIL = 'hello@loqelo.com'

export function SiteFooter() {
  const { locale, messages } = useI18n()
  const t = messages.footer
  return (
    <footer className="border-t border-border px-5 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Image src="/brand/logo.png" alt="Loqelo" width={2400} height={610} loading="lazy" className="h-8 w-auto" />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t.blurb}</p>
        </div>
        <div className="flex flex-col gap-6 md:items-end">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <li>
              <Link href={`/${locale}/privacy`} className="text-muted-foreground transition-colors hover:text-foreground">{t.privacy}</Link>
            </li>
            <li>
              <button type="button" onClick={resetConsent} className="text-muted-foreground transition-colors hover:text-foreground">{t.cookies}</button>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-muted-foreground transition-colors hover:text-foreground">
                {t.contact}: {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
          <LanguageSwitcher />
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-xs text-muted-foreground">
        {`© ${new Date().getFullYear()} Loqelo. ${t.rights}`}
      </p>
    </footer>
  )
}
