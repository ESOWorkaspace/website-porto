import type { ReactNode } from 'react'
import './globals.css'

/**
 * Root layout sengaja hanya meneruskan children: elemen <html> dan <body>
 * dirender di app/[locale]/layout.tsx supaya atribut lang mengikuti locale
 * (docs/06-i18n-spec.md §5, docs/03-seo-strategy.md §2).
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
