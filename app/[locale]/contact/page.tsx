import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AUTHOR_EMAIL } from '@/lib/config'
import { isLocale } from '@/lib/i18n'
import { getMessages } from '@/lib/messages'
import { getProfile } from '@/lib/content'
import { buildPageMetadata } from '@/lib/seo'

type Params = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const { meta } = getProfile(locale)
  return buildPageMetadata({
    locale,
    segments: ['contact'],
    title: meta.contact.title,
    description: meta.contact.description,
  })
}

export default async function ContactPage({ params }: Params) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getMessages(locale).contact

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        {t.heading}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">{t.intro}</p>

      {/* mailto saja — tanpa form, tanpa backend (docs/01-PRD.md §3). */}
      <div className="mt-8 rounded-lg border border-border bg-surface p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {t.emailLabel}
        </p>
        <a
          href={`mailto:${AUTHOR_EMAIL}`}
          className="mt-2 inline-block break-all font-mono text-base font-semibold text-accent hover:underline"
        >
          {AUTHOR_EMAIL}
        </a>
      </div>

      <p className="mt-6 text-xs text-muted">{t.note}</p>
    </>
  )
}
