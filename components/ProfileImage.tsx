import fs from 'node:fs'
import path from 'node:path'
import Image from 'next/image'
import { AUTHOR_NAME, PROFILE_IMAGE, PROFILE_IMAGE_SIZE } from '@/lib/config'

type Props = {
  /** Alt deskriptif, berbeda per bahasa (docs/07-assets-guide.md §A2). */
  alt: string
  /** Alt untuk placeholder inisial, dipakai kalau file foto belum ada. */
  fallbackAlt: string
}

/**
 * Inisial nama untuk placeholder: huruf awal kata pertama + kata terakhir.
 * "M. Mifthahul Amien" -> "MA" (sama dengan favicon).
 */
function initials(): string {
  const words = AUTHOR_NAME.replace(/[^A-Za-z\s]/g, '')
    .split(/\s+/)
    .filter(Boolean)

  const first = words.at(0)?.[0] ?? ''
  const last = words.length > 1 ? (words.at(-1)?.[0] ?? '') : ''

  return `${first}${last}`.toUpperCase()
}

function profileImageExists(): boolean {
  return fs.existsSync(path.join(process.cwd(), 'public', PROFILE_IMAGE))
}

/**
 * Foto profil hero. Ini kandidat elemen LCP: `priority`, ukuran eksplisit,
 * tidak lazy load (docs/03-seo-strategy.md §6, docs/07-assets-guide.md §A2).
 *
 * Kalau public/images/profile.jpg belum ditaruh, komponen ini merender
 * placeholder inisial dengan dimensi yang sama — layout tidak pecah dan
 * `npm run dev` tidak crash sebelum Amien memasukkan fotonya.
 */
export function ProfileImage({ alt, fallbackAlt }: Props) {
  const size = 'h-28 w-28 shrink-0 overflow-hidden rounded-full border border-border sm:h-36 sm:w-36'

  if (!profileImageExists()) {
    return (
      <div
        className={`${size} flex items-center justify-center bg-surface`}
        role="img"
        aria-label={fallbackAlt}
      >
        <span className="font-mono text-3xl font-semibold text-accent sm:text-4xl">
          {initials()}
        </span>
      </div>
    )
  }

  return (
    <div className={size}>
      <Image
        src={PROFILE_IMAGE}
        alt={alt}
        width={PROFILE_IMAGE_SIZE}
        height={PROFILE_IMAGE_SIZE}
        priority
        sizes="144px"
        className="h-full w-full object-cover"
      />
    </div>
  )
}
