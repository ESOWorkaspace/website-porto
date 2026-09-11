'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { localePath, type Locale } from '@/lib/i18n'
import type { Messages } from '@/lib/messages'

type Props = {
  locale: Locale
  labels: Messages['nav']
}

export function SiteNav({ locale, labels }: Props) {
  const pathname = usePathname()
  const homeHref = localePath(locale)

  const links = [
    { href: homeHref, label: labels.home },
    { href: localePath(locale, 'about'), label: labels.about },
    { href: localePath(locale, 'projects'), label: labels.projects },
    { href: localePath(locale, 'contact'), label: labels.contact },
  ]

  return (
    <nav aria-label={labels.mainNavLabel}>
      <ul className="flex items-center gap-4 text-sm">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== homeHref && pathname.startsWith(`${link.href}/`))

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={
                  isActive
                    ? 'text-fg underline decoration-accent decoration-2 underline-offset-4'
                    : 'text-muted transition-colors hover:text-fg'
                }
              >
                {link.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
