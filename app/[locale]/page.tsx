import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AUTHOR_NAME } from '@/lib/config'
import { isLocale, localePath } from '@/lib/i18n'
import { getMessages } from '@/lib/messages'
import { getFeaturedProjects, getProfile } from '@/lib/content'
import { buildPageMetadata, profilePageSchema } from '@/lib/seo'
import { JsonLd } from '@/components/JsonLd'
import { ProfileImage } from '@/components/ProfileImage'
import { ProjectCard } from '@/components/ProjectCard'

type Params = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const { meta } = getProfile(locale)
  return buildPageMetadata({
    locale,
    title: meta.home.title,
    description: meta.home.description,
    // Home memakai title-nya apa adanya — nama lengkap sudah ada di dalamnya
    // (docs/03-seo-strategy.md §1).
    absoluteTitle: true,
  })
}

export default async function HomePage({ params }: Params) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const profile = getProfile(locale)
  const t = getMessages(locale)
  const featured = getFeaturedProjects(locale)

  return (
    <>
      <JsonLd schema={profilePageSchema(locale, profile)} />

      {/* Hero */}
      <section className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <ProfileImage
          alt={t.common.profilePhotoAlt}
          fallbackAlt={t.common.profilePhotoFallbackAlt}
        />
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {AUTHOR_NAME}
          </h1>
          <p className="mt-1 font-mono text-sm text-accent">{t.site.tagline}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {profile.headline}
          </p>
        </div>
      </section>

      <p className="mt-8 border-l-2 border-accent pl-4 text-sm leading-relaxed text-muted">
        {profile.valueProposition}
      </p>

      {/* Area keahlian */}
      <section className="mt-14">
        <h2 className="text-lg font-semibold tracking-tight">
          {t.home.expertiseHeading}
        </h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {profile.expertiseAreas.map((area) => (
            <li
              key={area.title}
              className="rounded-lg border border-border bg-surface p-4"
            >
              <h3 className="text-sm font-semibold">{area.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {area.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Proyek unggulan */}
      {featured.length > 0 && (
        <section className="mt-14">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-lg font-semibold tracking-tight">
              {t.home.featuredHeading}
            </h2>
            <Link
              href={localePath(locale, 'projects')}
              className="text-sm font-medium text-accent hover:underline"
            >
              {t.home.featuredViewAll} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <ul className="mt-5 grid gap-4">
            {featured.map((project) => (
              <ProjectCard
                key={project.slug}
                locale={locale}
                project={project}
                labels={t.projects}
              />
            ))}
          </ul>
        </section>
      )}

      {/* CTA */}
      <section className="mt-14 rounded-lg border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold tracking-tight">
          {t.home.ctaHeading}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {t.home.ctaBody}
        </p>
        <Link
          href={localePath(locale, 'contact')}
          className="mt-4 inline-block rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-fg transition-opacity hover:opacity-90"
        >
          {t.home.ctaButton}
        </Link>
      </section>
    </>
  )
}
