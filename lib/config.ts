/**
 * Config terpusat. Satu-satunya sumber untuk domain, email, dan path aset.
 * Jangan hardcode nilai-nilai ini di komponen mana pun.
 * Lihat docs/04-technical-spec.md §5.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
).replace(/\/$/, '')

export const AUTHOR_NAME = 'M. Mifthahul Amien'
export const AUTHOR_SHORT_NAME = 'Amien'
export const AUTHOR_EMAIL = 'mifthahulamien@gmail.com'

export const ORGANIZATION_NAME = 'PT Mesin Kantong Ajaib (Mantiq)'
export const ORGANIZATION_SHORT_NAME = 'Mantiq'
export const ALUMNI_OF = 'Universitas Negeri Gorontalo'

export const LOCATION = {
  city: 'Bandung',
  region: 'Jawa Barat',
  country: 'Indonesia',
  countryCode: 'ID',
} as const

/** Foto profil. Lihat docs/07-assets-guide.md — Amien menaruh filenya di sini. */
export const PROFILE_IMAGE = '/images/profile.jpg'
export const PROFILE_IMAGE_SIZE = 400

/** OG image default (1200x630). Bisa ditimpa kapan saja. */
export const OG_IMAGE = '/og/default.png'
export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630

/** Kosong untuk sekarang — belum ada LinkedIn/GitHub (docs/05-content-brief.md §7). */
export const SAME_AS: readonly string[] = []

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
