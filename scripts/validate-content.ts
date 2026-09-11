/**
 * Guard build-time. Dijalankan di `prebuild` (docs/06-i18n-spec.md §7).
 * Gagal dengan pesan jelas, bukan diam-diam menampilkan halaman kosong.
 *
 *   npm run validate:content
 */
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { LOCALES, type Locale } from '../lib/i18n'

const ROOT = process.cwd()
const errors: string[] = []
const warnings: string[] = []

function fail(message: string) {
  errors.push(message)
}

function rel(p: string) {
  return path.relative(ROOT, p)
}

/* -------- 1. Paritas file proyek antar locale -------- */

function projectSlugs(locale: Locale): string[] {
  const dir = path.join(ROOT, 'content', 'projects', locale)
  if (!fs.existsSync(dir)) {
    fail(`Folder proyek untuk locale "${locale}" tidak ada: ${rel(dir)}`)
    return []
  }
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}

const slugsByLocale = new Map<Locale, string[]>()
for (const locale of LOCALES) slugsByLocale.set(locale, projectSlugs(locale))

const allSlugs = new Set(
  [...slugsByLocale.values()].flatMap((slugs) => slugs),
)

if (allSlugs.size === 0) fail('Tidak ada satu pun file proyek di content/projects/.')

for (const slug of [...allSlugs].sort()) {
  const missing = LOCALES.filter(
    (locale) => !slugsByLocale.get(locale)?.includes(slug),
  )
  if (missing.length > 0) {
    fail(
      `Proyek "${slug}" tidak lengkap — file yang hilang: ` +
        missing.map((l) => `content/projects/${l}/${slug}.mdx`).join(', '),
    )
  }
}

/* -------- 2. Frontmatter proyek -------- */

const REQUIRED_FRONTMATTER = [
  'title',
  'slug',
  'summary',
  'stack',
  'role',
  'featured',
  'order',
] as const

type Frontmatter = Record<string, unknown>
const frontmatterBySlug = new Map<string, Partial<Record<Locale, Frontmatter>>>()

for (const locale of LOCALES) {
  for (const slug of slugsByLocale.get(locale) ?? []) {
    const file = path.join(ROOT, 'content', 'projects', locale, `${slug}.mdx`)
    const parsed = matter(fs.readFileSync(file, 'utf8'))
    const data = parsed.data as Frontmatter

    for (const field of REQUIRED_FRONTMATTER) {
      const value = data[field]

      /* `featured: false` adalah nilai sah, bukan field kosong. */
      const isEmpty =
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === 0)

      if (isEmpty) {
        fail(`${rel(file)}: field frontmatter "${field}" kosong atau tidak ada.`)
      }
    }

    if (data.slug !== undefined && data.slug !== slug) {
      fail(
        `${rel(file)}: frontmatter slug "${String(data.slug)}" tidak cocok dengan nama file "${slug}".`,
      )
    }

    if (parsed.content.trim() === '') {
      fail(`${rel(file)}: body MDX kosong.`)
    }

    const entry = frontmatterBySlug.get(slug) ?? {}
    entry[locale] = data
    frontmatterBySlug.set(slug, entry)
  }
}

/* Field yang harus identik di semua bahasa (bukan konten yang diterjemahkan). */
const LOCALE_INVARIANT = ['slug', 'featured', 'order', 'year'] as const

for (const [slug, byLocale] of frontmatterBySlug) {
  for (const field of LOCALE_INVARIANT) {
    const values = LOCALES.map((locale) =>
      JSON.stringify(byLocale[locale]?.[field] ?? null),
    )
    if (new Set(values).size > 1) {
      fail(
        `Proyek "${slug}": field "${field}" harus sama di semua bahasa, tapi bernilai ` +
          LOCALES.map((l, i) => `${l}=${values[i]}`).join(', '),
      )
    }
  }

  /* stack adalah nama teknologi — tidak diterjemahkan, jadi harus identik. */
  const stacks = LOCALES.map((locale) =>
    JSON.stringify(byLocale[locale]?.stack ?? null),
  )
  if (new Set(stacks).size > 1) {
    warnings.push(
      `Proyek "${slug}": daftar "stack" berbeda antar bahasa. Nama teknologi tidak diterjemahkan (docs/06-i18n-spec.md §3) — pastikan ini memang disengaja.`,
    )
  }
}

/* -------- 3. Paritas key messages/{locale}.json -------- */

function flattenKeys(value: unknown, prefix = ''): string[] {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return [prefix]
  }
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    flattenKeys(child, prefix ? `${prefix}.${key}` : key),
  )
}

function readJson(file: string): unknown | null {
  if (!fs.existsSync(file)) {
    fail(`File tidak ada: ${rel(file)}`)
    return null
  }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch (error) {
    fail(`${rel(file)}: JSON tidak valid — ${(error as Error).message}`)
    return null
  }
}

const messageKeys = new Map<Locale, Set<string>>()
for (const locale of LOCALES) {
  const data = readJson(path.join(ROOT, 'messages', `${locale}.json`))
  if (data) messageKeys.set(locale, new Set(flattenKeys(data)))
}

const [referenceLocale, ...otherLocaleList] = LOCALES
const referenceKeys = messageKeys.get(referenceLocale)

if (referenceKeys) {
  for (const locale of otherLocaleList) {
    const keys = messageKeys.get(locale)
    if (!keys) continue

    for (const key of referenceKeys) {
      if (!keys.has(key)) {
        fail(
          `messages/${locale}.json: key "${key}" ada di messages/${referenceLocale}.json tapi tidak di sini.`,
        )
      }
    }
    for (const key of keys) {
      if (!referenceKeys.has(key)) {
        fail(
          `messages/${referenceLocale}.json: key "${key}" ada di messages/${locale}.json tapi tidak di sini.`,
        )
      }
    }
  }
}

/* -------- 4. Field wajib di content/profile/{locale}.json -------- */

/** Path field wajib; `[]` berarti array yang tidak boleh kosong. */
const REQUIRED_PROFILE_FIELDS = [
  'jobTitle',
  'headline',
  'valueProposition',
  'bio[]',
  'education[]',
  'experience[]',
  'philosophy[]',
  'expertiseAreas[]',
  'skills[]',
  'knowsAbout[]',
  'meta.home.title',
  'meta.home.description',
  'meta.about.title',
  'meta.about.description',
  'meta.projects.title',
  'meta.projects.description',
  'meta.contact.title',
  'meta.contact.description',
] as const

function resolvePath(source: unknown, dottedPath: string): unknown {
  return dottedPath
    .split('.')
    .reduce<unknown>((acc, key) =>
      acc && typeof acc === 'object'
        ? (acc as Record<string, unknown>)[key]
        : undefined,
    source)
}

for (const locale of LOCALES) {
  const file = path.join(ROOT, 'content', 'profile', `${locale}.json`)
  const profile = readJson(file)
  if (!profile) continue

  for (const spec of REQUIRED_PROFILE_FIELDS) {
    const isArray = spec.endsWith('[]')
    const fieldPath = isArray ? spec.slice(0, -2) : spec
    const value = resolvePath(profile, fieldPath)

    if (isArray) {
      if (!Array.isArray(value) || value.length === 0) {
        fail(`${rel(file)}: field "${fieldPath}" harus array yang tidak kosong.`)
      }
      continue
    }

    if (typeof value !== 'string' || value.trim() === '') {
      fail(`${rel(file)}: field wajib "${fieldPath}" kosong atau tidak ada.`)
    }
  }

  /* certifications boleh kosong (belum ada isinya), tapi harus berupa array. */
  const certifications = resolvePath(profile, 'certifications')
  if (!Array.isArray(certifications)) {
    fail(
      `${rel(file)}: field "certifications" harus array (boleh kosong: []). Lihat docs/07-assets-guide.md §B2.`,
    )
  } else {
    certifications.forEach((cert, index) => {
      const item = cert as Record<string, unknown>
      for (const field of ['name', 'issuer'] as const) {
        if (typeof item[field] !== 'string' || item[field].trim() === '') {
          fail(
            `${rel(file)}: certifications[${index}].${field} kosong atau tidak ada.`,
          )
        }
      }
    })
  }

  /* Meta description: 140-160 karakter (docs/03-seo-strategy.md §2). */
  for (const page of ['home', 'about', 'projects', 'contact'] as const) {
    const description = resolvePath(profile, `meta.${page}.description`)
    if (typeof description === 'string') {
      const length = description.length
      if (length < 140 || length > 160) {
        warnings.push(
          `${rel(file)}: meta.${page}.description panjangnya ${length} karakter, di luar rentang 140-160 yang disarankan.`,
        )
      }
    }
  }
}

/* -------- Hasil -------- */

for (const warning of warnings) {
  console.warn(`  ! ${warning}`)
}

if (errors.length > 0) {
  console.error(`\n✗ Validasi konten gagal — ${errors.length} masalah:\n`)
  for (const error of errors) console.error(`  • ${error}`)
  console.error('\nBuild dihentikan. Perbaiki dulu file di atas.\n')
  process.exit(1)
}

console.log(
  `✓ Validasi konten lolos (${allSlugs.size} proyek × ${LOCALES.length} bahasa` +
    (warnings.length > 0 ? `, ${warnings.length} peringatan` : '') +
    ').',
)
