'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LOCALES, swapLocaleInPath, type Locale } from '@/lib/i18n'
import type { Messages } from '@/lib/messages'

type Props = {
  locale: Locale
  labels: Messages['languageSwitcher']
}

/**
 * Dirender sebagai <a href> asli (bukan tombol JS) supaya crawler bisa
 * mengikutinya dan user bisa buka di tab baru. Mempertahankan halaman saat ini
 * dengan menukar prefix locale (docs/06-i18n-spec.md §4).
 *
 * Client component hanya untuk membaca pathname; href-nya tetap ikut ter-render
 * penuh di HTML statis karena setiap halaman di-prerender per route.
 */
export function LanguageSwitcher({ locale, labels }: Props) {
  const pathname = usePathname()

  return (
    <div
      className="flex items-center gap-1 rounded-md border border-border p-0.5"
      role="group"
      aria-label={labels.label}
    >
      {LOCALES.map((target) => {
        const isActive = target === locale
        const shortLabel = target === 'id' ? labels.idShort : labels.enShort
        const fullLabel = target === 'id' ? labels.id : labels.en

        return (
          <Link
            key={target}
            href={swapLocaleInPath(pathname, target)}
            hrefLang={target}
            aria-current={isActive ? 'true' : undefined}
            title={fullLabel}
            className={
              isActive
                ? 'rounded bg-accent px-2 py-1 text-xs font-semibold text-accent-fg'
                : 'rounded px-2 py-1 text-xs font-medium text-muted transition-colors hover:text-fg'
            }
          >
            <span aria-hidden="true">{shortLabel}</span>
            <span className="sr-only">{fullLabel}</span>
          </Link>
        )
      })}
    </div>
  )
}
