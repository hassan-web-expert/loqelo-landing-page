import { notFound } from 'next/navigation'
import { Hero } from '@/components/hero'
import { HowItWorks } from '@/components/how-it-works'
import { LaunchCountdown } from '@/components/launch-countdown'
import { ServicesMarquee } from '@/components/services-marquee'
import { SiteFooter, CONTACT_EMAIL } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { WaitlistSection } from '@/components/waitlist-section'
import { getCountryOptions } from '@/lib/countries'
import { getMessages, isLocale } from '@/lib/i18n'
import { siteUrl } from '@/lib/site'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const messages = getMessages(locale)
  const countries = getCountryOptions(locale)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Loqelo',
      url: siteUrl,
      logo: `${siteUrl}/brand/logo.png`,
      email: CONTACT_EMAIL,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Loqelo',
      url: `${siteUrl}/${locale}`,
      inLanguage: locale,
      description: messages.meta.description,
    },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <SiteHeader />
      <main>
        <Hero />
        <ServicesMarquee messages={messages} />
        <HowItWorks messages={messages} />
        <LaunchCountdown />
        <WaitlistSection messages={messages} countries={countries} />
      </main>
      <SiteFooter />
    </>
  )
}
