import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { SiteFooter, CONTACT_EMAIL } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { getMessages, isLocale } from '@/lib/i18n'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const m = getMessages(locale)
  return { title: `${m.privacy.title} — Loqelo`, alternates: { canonical: `/${locale}/privacy` } }
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getMessages(locale).privacy

  return (
    <>
      <SiteHeader />
      <main className="px-5 pb-20 pt-28 md:pt-36">
        <article className="mx-auto max-w-2xl">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" aria-hidden="true" />
            {t.back}
          </Link>
          <h1 className="mt-6 text-heading font-semibold tracking-tight">{t.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t.updated}</p>
          <div className="mt-10 flex flex-col gap-8">
            {t.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="text-lg font-semibold">{s.heading}</h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">{s.body}</p>
              </section>
            ))}
            <p className="text-muted-foreground">
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-foreground underline underline-offset-4">{CONTACT_EMAIL}</a>
            </p>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  )
}
