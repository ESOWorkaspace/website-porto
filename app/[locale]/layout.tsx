import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AUTHOR_NAME, SITE_URL } from '@/lib/config'
import { HTML_LANG, LOCALES, isLocale } from '@/lib/i18n'
import { getMessages } from '@/lib/messages'
import { fontClassName } from '@/lib/fonts'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getMessages(locale)

  return {
    // Basis untuk resolusi URL relatif di metadata. Satu-satunya sumber
    // domain adalah NEXT_PUBLIC_SITE_URL (docs/04-technical-spec.md §5).
    metadataBase: new URL(SITE_URL),
    // Pola title per docs/03-seo-strategy.md §2: `{Judul} | M. Mifthahul Amien`
    title: {
      default: `${AUTHOR_NAME} — ${t.site.tagline}`,
      template: `%s | ${AUTHOR_NAME}`,
    },
    authors: [{ name: AUTHOR_NAME }],
    creator: AUTHOR_NAME,
  }
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

/** Locale di luar daftar langsung 404, bukan render halaman kosong. */
export const dynamicParams = false

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getMessages(locale)

  return (
    <html lang={HTML_LANG[locale]} className={fontClassName}>
      <body className="flex min-h-screen flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-sm focus:text-accent-fg"
        >
          {t.nav.skipToContent}
        </a>
        <SiteHeader locale={locale} />
        <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-5 py-12">
          {children}
        </main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  )
}
