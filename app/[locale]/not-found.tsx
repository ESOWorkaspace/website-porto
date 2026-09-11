import Link from 'next/link'
import { DEFAULT_LOCALE, localePath } from '@/lib/i18n'
import { getMessages } from '@/lib/messages'

/**
 * 404 di dalam segment locale. Next.js tidak meneruskan params ke not-found,
 * jadi teksnya memakai default locale.
 */
export default function LocaleNotFound() {
  const t = getMessages(DEFAULT_LOCALE).notFound

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        {t.heading}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">{t.body}</p>
      <Link
        href={localePath(DEFAULT_LOCALE)}
        className="mt-6 inline-block text-sm font-medium text-accent hover:underline"
      >
        <span aria-hidden="true">←</span> {t.backHome}
      </Link>
    </>
  )
}
