import id from '@/messages/id.json'
import en from '@/messages/en.json'
import type { Locale } from '@/lib/i18n'

/**
 * UI string per locale. Import statis supaya ikut terbundel di build
 * dan strukturnya ter-type-check terhadap messages/id.json.
 * Lihat docs/06-i18n-spec.md §3.
 */
export type Messages = typeof id

const MESSAGES: Record<Locale, Messages> = {
  id,
  // Struktur en.json wajib identik dengan id.json — divalidasi juga di
  // scripts/validate-content.ts, tapi di sini sudah ketahuan saat type-check.
  en: en satisfies Messages,
}

export function getMessages(locale: Locale): Messages {
  return MESSAGES[locale]
}
