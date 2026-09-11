import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LOCALES, isLocale, localePath } from '@/lib/i18n'
import { getMessages } from '@/lib/messages'
import { getProject, getProjectSlugs } from '@/lib/content'
import { getProfile } from '@/lib/content'
import { breadcrumbSchema, buildPageMetadata, creativeWorkSchema } from '@/lib/seo'
import { JsonLd } from '@/components/JsonLd'
import { Prose } from '@/components/Prose'

type Params = { params: Promise<{ locale: string; slug: string }> }

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getProjectSlugs(locale).map((slug) => ({ locale, slug })),
  )
}

export const dynamicParams = false

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const project = getProject(locale, slug)
  if (!project) notFound()

  return buildPageMetadata({
    locale,
    segments: ['projects', slug],
    title: project.title,
    description: project.metaDescription ?? project.summary,
  })
}

export default async function ProjectDetailPage({ params }: Params) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const project = getProject(locale, slug)
  if (!project) notFound()

  const t = getMessages(locale)
  const { meta } = getProfile(locale)

  const breadcrumb = [
    { name: t.nav.home, path: localePath(locale) },
    { name: meta.projects.title, path: localePath(locale, 'projects') },
    { name: project.title, path: localePath(locale, 'projects', slug) },
  ]

  return (
    <>
      <JsonLd schema={creativeWorkSchema(locale, project)} />
      <JsonLd schema={breadcrumbSchema(breadcrumb)} />

      <nav aria-label={t.common.breadcrumbLabel} className="text-xs text-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          {breadcrumb.map((item, index) => {
            const isLast = index === breadcrumb.length - 1
            return (
              <li key={item.path} className="flex items-center gap-1.5">
                {isLast ? (
                  <span aria-current="page" className="text-fg">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link href={item.path} className="hover:text-fg">
                      {item.name}
                    </Link>
                    <span aria-hidden="true">/</span>
                  </>
                )}
              </li>
            )
          })}
        </ol>
      </nav>

      <h1 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
        {project.title}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {project.summary}
      </p>

      <dl className="mt-8 grid gap-5 rounded-lg border border-border bg-surface p-5 sm:grid-cols-[auto_1fr] sm:gap-x-8">
        <dt className="text-xs font-medium uppercase tracking-wide text-muted">
          {t.projects.roleLabel}
        </dt>
        <dd className="text-sm">{project.role}</dd>

        <dt className="text-xs font-medium uppercase tracking-wide text-muted">
          {t.projects.stackLabel}
        </dt>
        <dd>
          <ul className="flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="rounded border border-border px-1.5 py-0.5 font-mono text-[11px] text-muted"
              >
                {tech}
              </li>
            ))}
          </ul>
        </dd>
      </dl>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">
          {t.projects.detailHeading}
        </h2>
        <div className="mt-4">
          <Prose source={project.body} />
        </div>
      </section>

      <Link
        href={localePath(locale, 'projects')}
        className="mt-12 inline-block text-sm font-medium text-accent hover:underline"
      >
        <span aria-hidden="true">←</span> {t.projects.backToProjects}
      </Link>
    </>
  )
}
