'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Globe } from 'lucide-react'
import { localeNames, locales } from '@/lib/i18n'
import { useI18n } from '@/components/i18n-provider'
import { cn } from '@/lib/utils'

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, messages } = useI18n()
  const pathname = usePathname()
  const rest = pathname.split('/').slice(2).join('/')

  return (
    <nav aria-label={messages.nav.language} className={cn('flex items-center gap-1', className)}>
      <Globe className="size-4 text-muted-foreground" aria-hidden="true" />
      <ul className="flex items-center rounded-full border border-border bg-card/70 p-0.5">
        {locales.map((l) => (
          <li key={l}>
            <Link
              href={`/${l}${rest ? `/${rest}` : ''}`}
              hrefLang={l}
              lang={l}
              aria-current={l === locale ? 'true' : undefined}
              title={localeNames[l]}
              className={cn(
                'block rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                l === locale ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <span className="sr-only">{localeNames[l]}</span>
              <span aria-hidden="true">{l}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
