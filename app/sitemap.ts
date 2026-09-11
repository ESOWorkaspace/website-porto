import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/config'
import {
  DEFAULT_LOCALE,
  HTML_LANG,
  LOCALES,
  localePath,
  type Locale,
} from '@/lib/i18n'
import { getProjectSlugs } from '@/lib/content'

/**
 * Satu sitemap mencakup semua URL kedua bahasa, dengan anotasi alternate
 * per entri (Next.js memancarkannya sebagai xhtml:link).
 * Lihat docs/03-seo-strategy.md §3.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Slug identik di kedua bahasa (docs/02-information-architecture.md §3),
  // jadi cukup ambil dari default locale.
  const projectSlugs = getProjectSlugs(DEFAULT_LOCALE)

  const routes: { segments: string[]; priority: number }[] = [
    { segments: [], priority: 1 },
    { segments: ['about'], priority: 0.8 },
    { segments: ['projects'], priority: 0.8 },
    { segments: ['contact'], priority: 0.5 },
    ...projectSlugs.map((slug) => ({
      segments: ['projects', slug],
      priority: 0.6,
    })),
  ]

  const lastModified = new Date()

  return routes.flatMap(({ segments, priority }) =>
    LOCALES.map((locale: Locale) => ({
      url: absoluteUrl(localePath(locale, ...segments)),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority,
      alternates: {
        languages: {
          ...Object.fromEntries(
            LOCALES.map((l) => [
              HTML_LANG[l],
              absoluteUrl(localePath(l, ...segments)),
            ]),
          ),
          'x-default': absoluteUrl(localePath(DEFAULT_LOCALE, ...segments)),
        },
      },
    })),
  )
}
