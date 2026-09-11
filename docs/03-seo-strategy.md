# SEO Strategy — Portfolio Website (Dwibahasa)

## 1. Target Keyword

### Bahasa Indonesia (`/id`)
- "M. Mifthahul Amien" / "Mifthahul Amien" — prioritas #1
- "CTO Mantiq Bandung"
- "developer AI automation Bandung"
- "konsultan AI automation Indonesia"

### English (`/en`)
- "M. Mifthahul Amien"
- "AI automation engineer Indonesia"
- "IIoT engineer Indonesia"
- "Next.js developer Bandung"

Keyword nama sendiri adalah prioritas tertinggi dan paling gampang menang karena kompetisinya nyaris nol. Pastikan nama lengkap ada di title tag, H1, dan meta description Home — di **kedua** bahasa.

## 2. On-Page SEO Checklist (per halaman, per bahasa)
- [ ] Satu `<h1>` per halaman
- [ ] Title tag unik per halaman **per bahasa**: `{Judul} | M. Mifthahul Amien`
- [ ] Meta description unik per halaman per bahasa, 140-160 karakter, ditulis natural dalam bahasa tsb (bukan hasil terjemahan mentah)
- [ ] Heading hierarchy logis (h1 → h2 → h3)
- [ ] Semua `<img>` punya `alt` deskriptif **dalam bahasa halaman tsb**
- [ ] Internal linking antar halaman dalam locale yang sama
- [ ] `<html lang="id">` / `<html lang="en">` sesuai locale — sering terlewat, tapi penting

## 3. Technical SEO — wajib ada

| Item | Detail |
|---|---|
| `sitemap.xml` | Satu sitemap mencakup **semua** URL kedua bahasa, dengan anotasi `xhtml:link` alternate per entri |
| `robots.txt` | Allow all, referensi ke sitemap.xml |
| **hreflang** | Wajib. Tiap halaman menunjuk ke versi bahasa lainnya + `x-default`. Lihat section 4 |
| Canonical tag | Eksplisit per halaman per bahasa — versi ID dan EN masing-masing self-canonical, **jangan** saling canonical (itu bikin salah satu bahasa tidak ter-index) |
| Open Graph | `og:title`, `og:description`, `og:image`, `og:locale` (`id_ID` / `en_US`), `og:locale:alternate` |
| Structured data | JSON-LD, lihat section 5 |
| Mobile responsive | Test di viewport 375px |
| Core Web Vitals | LCP <2.5s, CLS <0.1, INP <200ms |
| Favicon | Standar, tidak perlu PWA penuh |

## 4. hreflang — detail implementasi
Setiap halaman harus punya tiga tag:
```html
<link rel="alternate" hreflang="id" href="{SITE_URL}/id/{path}" />
<link rel="alternate" hreflang="en" href="{SITE_URL}/en/{path}" />
<link rel="alternate" hreflang="x-default" href="{SITE_URL}/id/{path}" />
```
Aturan penting:
- Hreflang harus **bidirectional** — kalau ID menunjuk EN, EN juga harus menunjuk ID. Kalau tidak, Google mengabaikannya
- URL harus **absolut**, pakai `NEXT_PUBLIC_SITE_URL` (default `http://localhost:3000` di local dev)
- `x-default` diarahkan ke versi ID (audiens utama Indonesia)

Ini bisa di-generate otomatis dari Next.js Metadata API lewat field `alternates.languages` — jangan hardcode manual di tiap halaman.

## 5. Structured Data (Schema.org JSON-LD)
- **Home**: `ProfilePage` yang membungkus `Person`
  - `name`: M. Mifthahul Amien
  - `jobTitle`: CTO (versi EN) / CTO (versi ID)
  - `worksFor`: Organization → PT Mesin Kantong Ajaib (Mantiq)
  - `alumniOf`: Universitas Negeri Gorontalo
  - `email`: mifthahulamien@gmail.com
  - `image`: URL foto profil
  - `address`: Bandung, Jawa Barat, Indonesia
  - `knowsAbout`: array topik keahlian
  - `inLanguage`: sesuai locale halaman
- **Project detail**: `SoftwareApplication` atau `CreativeWork` — name, description, dateCreated
- **Project detail**: `BreadcrumbList`

Kalau nanti sertifikasi terisi, tambahkan `hasCredential` di `Person` schema.

## 6. Performance sebagai bagian dari SEO
- Static generation (SSG) di build time — crawler dapat HTML penuh tanpa eksekusi JS
- `next/image` dengan format modern (WebP/AVIF), lazy load di bawah fold
- Foto profil di hero: **jangan** lazy load (itu elemen LCP), pakai `priority`
- Font via `next/font` (self-hosted, tidak render-blocking)
- Minimalkan client-side JS

## 7. Off-Page (setelah deploy nanti, bukan bagian build)
- Submit sitemap ke Google Search Console & Bing Webmaster Tools
- Pasang link ke website ini di profil LinkedIn/GitHub
- Di Search Console, set international targeting kalau perlu

## 8. Monitoring (nanti)
- Google Search Console: index coverage per bahasa, query performance
- Analytics: disarankan self-hosted (Umami/Plausible) untuk konsisten dengan prinsip no vendor lock-in. Siapkan slot di layout, jangan pasang di v1
