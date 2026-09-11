import Link from 'next/link'
import { localePath, type Locale } from '@/lib/i18n'
import { getMessages } from '@/lib/messages'
import { AUTHOR_NAME } from '@/lib/config'
import { LanguageSwitcher } from './LanguageSwitcher'
import { SiteNav } from './SiteNav'

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getMessages(locale)

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={localePath(locale)}
          className="font-mono text-sm font-semibold tracking-tight"
        >
          {AUTHOR_NAME}
        </Link>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <SiteNav locale={locale} labels={t.nav} />
          <LanguageSwitcher locale={locale} labels={t.languageSwitcher} />
        </div>
      </div>
    </header>
  )
}
