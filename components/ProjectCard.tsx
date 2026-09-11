import Link from 'next/link'
import { localePath, type Locale } from '@/lib/i18n'
import type { Messages } from '@/lib/messages'
import type { Project } from '@/lib/schema'

type Props = {
  locale: Locale
  project: Project
  labels: Messages['projects']
}

export function ProjectCard({ locale, project, labels }: Props) {
  const href = localePath(locale, 'projects', project.slug)

  return (
    <li className="group rounded-lg border border-border bg-surface transition-colors hover:border-accent">
      <Link href={href} className="block p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold tracking-tight">
            {project.title}
          </h3>
          {project.featured && (
            <span className="shrink-0 rounded-full border border-accent px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent">
              {labels.featuredBadge}
            </span>
          )}
        </div>

        <p className="mt-2 text-sm leading-relaxed text-muted">
          {project.summary}
        </p>

        <ul className="mt-3 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded border border-border px-1.5 py-0.5 font-mono text-[11px] text-muted"
            >
              {tech}
            </li>
          ))}
        </ul>

        <span className="mt-4 inline-block text-sm font-medium text-accent">
          {labels.viewDetail} <span aria-hidden="true">→</span>
        </span>
      </Link>
    </li>
  )
}
