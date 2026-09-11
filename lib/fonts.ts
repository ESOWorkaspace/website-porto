import { Inter, JetBrains_Mono } from 'next/font/google'

/** Self-hosted lewat next/font, tidak render-blocking (docs/03-seo-strategy.md §6). */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})

export const fontClassName = `${inter.variable} ${jetbrainsMono.variable}`
