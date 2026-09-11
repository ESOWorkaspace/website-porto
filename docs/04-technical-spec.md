# Technical Spec — Portfolio Website

## 1. Fase Saat Ini: LOCAL DEVELOPMENT
Target fase ini adalah aplikasi yang jalan di `localhost` dan bisa diuji Amien. **Belum ada deployment, belum ada domain, belum ada Docker.** Bagian deployment di dokumen ini ditulis sebagai catatan arah, bukan pekerjaan yang dikerjakan sekarang.

## 2. Stack
Konsisten dengan stack yang sudah dipakai di proyek Mantiq lainnya:

- **Framework**: Next.js (App Router), TypeScript
- **Styling**: Tailwind CSS
- **Content**: MDX atau Markdown+frontmatter di dalam repo (`/content/`)
- **i18n**: sub-path routing native Next.js App Router (`app/[locale]/...`) + file translasi JSON untuk UI string. Tidak wajib pakai library i18n berat — untuk 2 bahasa dan konten statis, implementasi manual lebih ringan dan tidak nambah dependency. Kalau Claude Code menilai `next-intl` lebih rapi, boleh dipakai, tapi catat trade-off-nya.
- **Image**: `next/image`
- **SEO**: Next.js Metadata API + `sitemap.ts` / `robots.ts` (konvensi bawaan Next.js, tidak butuh library tambahan)

## 3. Rendering Strategy
- Semua halaman **Static Site Generation (SSG)** — tidak butuh database, tidak butuh SSR per-request
- `generateStaticParams` untuk locale × slug proyek

## 4. Struktur Folder yang Disarankan
```
/app
  /[locale]
    /page.tsx                  Home
    /about/page.tsx
    /projects/page.tsx
    /projects/[slug]/page.tsx
    /contact/page.tsx
    layout.tsx                 set <html lang>, nav, footer
  /sitemap.ts
  /robots.ts
  /layout.tsx
/content
  /projects
    /id/*.mdx
    /en/*.mdx
  /profile
    id.json                    bio, pendidikan, pengalaman, skills
    en.json
/messages
  id.json                      UI string: nav, tombol, label
  en.json
/components
/lib
  /seo.ts                      helper metadata + hreflang + JSON-LD
  /content.ts                  loader baca /content
  /i18n.ts                     locale config, helper
/public
  /images
    profile.jpg                foto profil — lihat 07-assets-guide.md
  /og
```

## 5. Config Terpusat
Satu file config (`/lib/config.ts` atau sejenis) yang memegang:
```ts
SITE_URL       // process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
LOCALES        // ['id', 'en']
DEFAULT_LOCALE // 'id'
AUTHOR_NAME    // 'M. Mifthahul Amien'
AUTHOR_EMAIL   // 'mifthahulamien@gmail.com'
```
**Jangan hardcode domain atau email di banyak tempat.** Saat nanti deploy, cukup ganti satu env var.

## 6. Deployment (CATATAN ARAH — JANGAN DIKERJAKAN SEKARANG)
Nanti akan pakai pola yang sama dengan proyek Mantiq lain: Dockerfile multi-stage (`output: 'standalone'`) → Coolify → Traefik untuk HTTPS. Karena itu, hindari hal yang bikin susah di-containerize nanti:
- Jangan pakai `output: 'export'` (bikin susah kalau nanti mau tambah API route)
- Jangan pakai fitur yang butuh filesystem write saat runtime
- Semua konfigurasi environment-dependent lewat env var, bukan hardcode

## 7. Performance Budget
- Lighthouse Performance ≥90 di mobile
- Total JS bundle initial load: target <150KB gzipped
- LCP <2.5s (koneksi 4G simulasi) — foto profil hero adalah kandidat LCP, wajib `priority` + ukuran eksplisit

## 8. Yang Sengaja Tidak Dipakai
- **Tanpa CMS eksternal**: konten sedikit, jarang berubah, git sebagai source of truth lebih sejalan dengan no vendor lock-in
- **Tanpa database**: tidak ada state dinamis
- **Tanpa auth**: tidak ada area privat
- **Tanpa contact form backend**: v1 cukup `mailto:`
