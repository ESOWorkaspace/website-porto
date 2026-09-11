/**
 * Tipe untuk konten file-based di /content.
 * Semua field wajib divalidasi di scripts/validate-content.ts.
 */

/** docs/07-assets-guide.md §B2 — `image`, `file`, `url` opsional. */
export type Certification = {
  name: string
  issuer: string
  year?: number
  image?: string
  file?: string
  url?: string
}

export type SkillCategory = {
  /** Nama kategori diterjemahkan; isi `items` (nama teknologi) tidak. */
  category: string
  items: string[]
}

export type ExpertiseArea = {
  title: string
  description: string
}

export type Education = {
  degree: string
  institution: string
  note?: string
}

export type Profile = {
  /** Untuk JSON-LD Person.jobTitle. */
  jobTitle: string
  /** Satu kalimat untuk hero Home. */
  headline: string
  /** Value proposition (docs/05-content-brief.md §4). */
  valueProposition: string
  /** Bio naratif halaman About, satu paragraf per elemen array. */
  bio: string[]
  education: Education[]
  experience: string[]
  philosophy: string[]
  /** 3-4 poin ringkasan area keahlian untuk Home. */
  expertiseAreas: ExpertiseArea[]
  skills: SkillCategory[]
  /** Untuk JSON-LD Person.knowsAbout. */
  knowsAbout: string[]
  /** Kosong untuk sekarang — section Sertifikasi tidak dirender selama kosong. */
  certifications: Certification[]
  meta: {
    home: PageMeta
    about: PageMeta
    projects: PageMeta
    contact: PageMeta
  }
}

export type PageMeta = {
  title: string
  description: string
}

/** Frontmatter file content/projects/{locale}/{slug}.mdx */
export type ProjectFrontmatter = {
  title: string
  slug: string
  summary: string
  /** Nama teknologi — tidak diterjemahkan. */
  stack: string[]
  role: string
  /** Opsional dan tidak ditampilkan di UI (keputusan Amien). */
  year?: number
  featured: boolean
  /**
   * Urutan tampil di dalam kelompoknya (featured / non-featured), mengikuti
   * urutan di docs/05-content-brief.md §6. Ada di frontmatter — bukan di
   * komponen — supaya menambah proyek tetap cukup dengan menambah file.
   * Harus sama di kedua bahasa (divalidasi di prebuild).
   */
  order: number
  /** Meta description khusus halaman detail; jatuh ke `summary` kalau kosong. */
  metaDescription?: string
}

export type Project = ProjectFrontmatter & {
  /** Isi MDX mentah, dirender di halaman detail. */
  body: string
}
