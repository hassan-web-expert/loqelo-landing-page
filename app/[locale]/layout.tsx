import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { notFound } from 'next/navigation'
import { Analytics } from '@vercel/analytics/next'
import { ConsentAnalytics } from '@/components/consent-analytics'
import { I18nProvider } from '@/components/i18n-provider'
import { getMessages, isLocale, locales } from '@/lib/i18n'
import { siteUrl } from '@/lib/site'
import '../globals.css'

const geist = Geist({ subsets: ['latin', 'latin-ext'], variable: '--font-geist', display: 'swap' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' })

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const m = getMessages(locale)
  return {
    metadataBase: new URL(siteUrl),
    title: m.meta.title,
    description: m.meta.description,
    applicationName: 'Loqelo',
    alternates: {
      canonical: `/${locale}`,
      languages: { ...Object.fromEntries(locales.map((l) => [l, `/${l}`])), 'x-default': '/en' },
    },
    openGraph: {
      type: 'website',
      siteName: 'Loqelo',
      url: `/${locale}`,
      title: m.meta.title,
      description: m.meta.description,
      locale: locale === 'pl' ? 'pl_PL' : 'en_US',
      images: [{ url: '/media/poster.png', width: 1376, height: 768, alt: m.meta.ogAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: m.meta.title,
      description: m.meta.description,
      images: ['/media/poster.png'],
    },
    icons: { icon: '/brand/icon.png', apple: '/brand/icon.png' },
  }
}

export const viewport: Viewport = {
  themeColor: '#fafbfb',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const messages = getMessages(locale)

  return (
    <html lang={locale} className={`${geist.variable} ${geistMono.variable}`}>
      <body className="bg-background font-sans text-foreground antialiased">
        <I18nProvider locale={locale} messages={messages}>
          {children}
          <ConsentAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        </I18nProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
