import { AUTHOR_EMAIL, AUTHOR_NAME } from '@/lib/config'
import type { Locale } from '@/lib/i18n'
import { getMessages } from '@/lib/messages'

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getMessages(locale).footer
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {AUTHOR_NAME}. {t.rights}
        </p>
        <a
          href={`mailto:${AUTHOR_EMAIL}`}
          className="font-mono text-xs transition-colors hover:text-fg"
        >
          {AUTHOR_EMAIL}
        </a>
      </div>
      {/*
        Slot analytics (self-hosted, mis. Umami/Plausible) — sengaja tidak
        dipasang di v1. Lihat docs/03-seo-strategy.md §8.
      */}
    </footer>
  )
}
