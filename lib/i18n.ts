/**
 * Locale config + helper. Implementasi manual, tanpa library i18n.
 * Menambah bahasa ketiga: tambahkan kodenya di LOCALES, tambah messages/{kode}.json
 * dan content/{profile,projects}/{kode}/. Tidak ada komponen yang perlu diubah.
 * Lihat docs/06-i18n-spec.md §8.
 */

export const LOCALES = ['id', 'en'] as const
export const DEFAULT_LOCALE = 'id' satisfies Locale

export type Locale = (typeof LOCALES)[number]

/** Untuk atribut <html lang> dan hreflang. */
export const HTML_LANG: Record<Locale, string> = {
  id: 'id',
  en: 'en',
}

/** Untuk og:locale. */
export const OG_LOCALE: Record<Locale, string> = {
  id: 'id_ID',
  en: 'en_US',
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

export function otherLocales(locale: Locale): Locale[] {
  return LOCALES.filter((l) => l !== locale)
}

/**
 * Bangun path bertingkat locale. `segments` adalah path di dalam locale,
 * mis. ['projects', 'hermes-mcp'] -> '/id/projects/hermes-mcp'.
 * Tanpa trailing slash (docs/02-information-architecture.md §3).
 */
export function localePath(locale: Locale, ...segments: string[]): string {
  const parts = segments.filter(Boolean).join('/')
  return parts ? `/${locale}/${parts}` : `/${locale}`
}

/**
 * Tukar prefix locale pada sebuah pathname, mempertahankan sisa path.
 * '/id/projects/hermes-mcp' + 'en' -> '/en/projects/hermes-mcp'
 * Dipakai language switcher (docs/06-i18n-spec.md §4).
 */
export function swapLocaleInPath(pathname: string, target: Locale): string {
  const segments = pathname.split('/').filter(Boolean)
  const [first, ...rest] = segments
  if (first && isLocale(first)) {
    return localePath(target, ...rest)
  }
  return localePath(target, ...segments)
}
