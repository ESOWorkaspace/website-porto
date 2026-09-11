# Portfolio — M. Mifthahul Amien

Personal portfolio dwibahasa (Indonesia + English), SEO-first, static generation.
Fase saat ini: **local development saja** — belum ada Dockerfile, belum ada
konfigurasi deployment, belum ada domain.

Spesifikasinya ada di `docs/`. Mulai dari `docs/08-build-handoff.md`.

## Menjalankan

```bash
npm install
npm run dev
```

Buka <http://localhost:3000> — otomatis diarahkan ke `/id`.

## Perintah lain

| Perintah | Kegunaan |
|---|---|
| `npm run dev` | Development server di port 3000 |
| `npm run build` | Production build (menjalankan validasi konten dulu) |
| `npm start` | Menjalankan hasil build (jalankan `npm run build` dulu) |
| `npm run validate:content` | Validasi konten saja, tanpa build |
| `npm run typecheck` | Type-check tanpa build |

## Foto profil

Taruh foto di **`public/images/profile.jpg`** — nama filenya harus tepat itu:

```bash
cp /path/ke/foto-kamu.jpg public/images/profile.jpg
```

Kotak 1:1, 800×800 – 1200×1200 px, di bawah 500 KB. Detail di
`docs/07-assets-guide.md` §A1 dan `public/images/README.md`.

Selama file itu belum ada, hero merender placeholder inisial (`MA`) dengan
dimensi yang sama, jadi layout tidak pecah.

## Mengubah konten

Semua konten ada di file, tidak ada satu pun yang di-hardcode di komponen.

| Mau mengubah apa | Edit file ini |
|---|---|
| Bio, pendidikan, pengalaman, filosofi, skills, area keahlian, meta description tiap halaman, sertifikasi | `content/profile/id.json` **dan** `content/profile/en.json` |
| Isi satu proyek | `content/projects/id/{slug}.mdx` **dan** `content/projects/en/{slug}.mdx` |
| Label UI (menu, tombol, heading generik) | `messages/id.json` **dan** `messages/en.json` |
| Domain, email, nama, path foto, lokasi | `lib/config.ts` (domain lewat `NEXT_PUBLIC_SITE_URL` di `.env.local`) |

Aturannya: **setiap perubahan konten harus dilakukan di kedua bahasa.**
`npm run build` akan gagal kalau tidak.

### Menambah proyek baru

1. Buat `content/projects/id/{slug}.mdx` dan `content/projects/en/{slug}.mdx`
   dengan slug yang sama persis.
2. Frontmatter wajib: `title`, `slug`, `summary`, `stack`, `role`, `featured`,
   `order`. `year` dan `metaDescription` opsional.
3. `slug`, `featured`, `order`, dan `year` harus identik di kedua file.
4. Selesai — halaman list, halaman detail, dan sitemap ikut otomatis.

### Menambah sertifikat

Lihat `public/certificates/README.md`. Selama array `certifications` kosong,
section Sertifikasi tidak dirender sama sekali.

### Menambah bahasa ketiga

Tambah kode locale di `LOCALES` (`lib/i18n.ts`), tambah `messages/{kode}.json`,
`content/profile/{kode}.json`, dan folder `content/projects/{kode}/`. Tidak ada
komponen yang perlu diubah.

## Struktur

```
app/
  layout.tsx              hanya meneruskan children
  [locale]/
    layout.tsx            <html lang>, header, footer
    page.tsx              Home
    about/ contact/ projects/ projects/[slug]/
    not-found.tsx
  sitemap.ts  robots.ts  icon.svg
content/
  profile/{id,en}.json    bio, pendidikan, skills, meta, sertifikasi
  projects/{id,en}/*.mdx  satu file per proyek per bahasa
messages/{id,en}.json     UI string
components/
lib/
  config.ts               domain, email, nama, path aset — SATU sumber
  i18n.ts                 locale config + helper path
  seo.ts                  metadata, hreflang, JSON-LD
  content.ts              loader /content
  schema.ts               tipe konten
  messages.ts  fonts.ts
scripts/
  validate-content.ts     guard yang jalan otomatis di `prebuild`
public/images/            profile.jpg (ditaruh manual)
public/og/default.png     OG image placeholder 1200×630
public/certificates/      kosong untuk sekarang
```

## Catatan

- Root `/` redirect **308 permanen dan statis** ke `/id`. Tidak ada deteksi
  `Accept-Language` — itu disengaja (`docs/06-i18n-spec.md` §2).
- Setiap halaman **self-canonical per bahasa**. Versi EN tidak canonical ke ID.
- Semua halaman SSG: HTML penuh sudah berisi `<title>`, meta description,
  hreflang, dan JSON-LD tanpa perlu JS jalan.
