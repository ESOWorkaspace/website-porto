import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/i18n'
import { getMessages } from '@/lib/messages'
import { getAllProjects, getProfile } from '@/lib/content'
import { buildPageMetadata } from '@/lib/seo'
import { ProjectCard } from '@/components/ProjectCard'

type Params = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const { meta } = getProfile(locale)
  return buildPageMetadata({
    locale,
    segments: ['projects'],
    title: meta.projects.title,
    description: meta.projects.description,
  })
}

export default async function ProjectsPage({ params }: Params) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getMessages(locale).projects
  // Sudah terurut: featured dulu, lalu urutan content brief.
  const projects = getAllProjects(locale)

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        {t.heading}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">{t.intro}</p>

      <ul className="mt-8 grid gap-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.slug}
            locale={locale}
            project={project}
            labels={t}
          />
        ))}
      </ul>
    </>
  )
}
