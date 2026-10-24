import type { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n'
import { siteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}`]))
  return [
    ...locales.map((l) => ({
      url: `${siteUrl}/${l}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
      alternates: { languages },
    })),
    ...locales.map((l) => ({
      url: `${siteUrl}/${l}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
  ]
}
