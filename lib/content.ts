import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import type { Locale } from '@/lib/i18n'
import type { Profile, Project, ProjectFrontmatter } from '@/lib/schema'

/**
 * Loader konten file-based. Hanya dipanggil di server / build time
 * (docs/04-technical-spec.md §2-§3).
 */

const CONTENT_ROOT = path.join(process.cwd(), 'content')

export function profileDir(): string {
  return path.join(CONTENT_ROOT, 'profile')
}

export function projectsDir(locale: Locale): string {
  return path.join(CONTENT_ROOT, 'projects', locale)
}

export function getProfile(locale: Locale): Profile {
  const file = path.join(profileDir(), `${locale}.json`)
  const raw = fs.readFileSync(file, 'utf8')
  return JSON.parse(raw) as Profile
}

/** Daftar slug proyek yang ada untuk satu locale, tanpa membaca isinya. */
export function getProjectSlugs(locale: Locale): string[] {
  const dir = projectsDir(locale)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => name.replace(/\.mdx$/, ''))
    .sort()
}

export function getProject(locale: Locale, slug: string): Project | null {
  const file = path.join(projectsDir(locale), `${slug}.mdx`)
  if (!fs.existsSync(file)) return null

  const { data, content } = matter(fs.readFileSync(file, 'utf8'))
  const frontmatter = data as ProjectFrontmatter

  return { ...frontmatter, body: content.trim() }
}

/**
 * Semua proyek untuk satu locale, sudah terurut:
 * featured lebih dulu, lalu urutan content brief (field `order`).
 */
export function getAllProjects(locale: Locale): Project[] {
  return getProjectSlugs(locale)
    .map((slug) => getProject(locale, slug))
    .filter((project): project is Project => project !== null)
    .sort(compareProjects)
}

export function getFeaturedProjects(locale: Locale): Project[] {
  return getAllProjects(locale).filter((project) => project.featured)
}

function compareProjects(a: Project, b: Project): number {
  if (a.featured !== b.featured) return a.featured ? -1 : 1
  if (a.order !== b.order) return a.order - b.order
  return a.title.localeCompare(b.title)
}
