# Information Architecture — Portfolio Website

## 1. Sitemap (v1, dwibahasa)

```
/id                      Home (Indonesia)
/id/about
/id/projects
/id/projects/[slug]
/id/contact

/en                      Home (English)
/en/about
/en/projects
/en/projects/[slug]
/en/contact

/                        redirect ke /id (default locale)
```

Struktur ini pakai **sub-path routing** (`/id/...` dan `/en/...`), bukan subdomain atau query param. Alasan: paling mudah di-setup di Next.js App Router, paling jelas untuk crawler, dan tidak butuh konfigurasi DNS tambahan saat nanti deploy.

Detail implementasi i18n ada di `06-i18n-spec.md`.

## 2. Catatan struktur halaman
- **Skills tidak dibuat sebagai halaman terpisah** — dijadikan section di `/about`. Halaman skills berdiri sendiri isinya tipis dan justru kurang bagus untuk SEO.
- **Pendidikan** masuk sebagai section di `/about`, bukan halaman sendiri.
- **Sertifikasi** belum ada isinya. Siapkan struktur data + komponennya, tapi section-nya tidak dirender kalau datanya kosong (jangan tampilkan heading "Sertifikasi" dengan isi kosong — itu thin content).

## 3. URL Structure
- Slug proyek pakai kebab-case deskriptif: `/id/projects/autoemail-cs`, `/en/projects/autoemail-cs`
- **Slug proyek sama persis di kedua bahasa.** Yang beda hanya isi kontennya. Ini menyederhanakan language switcher (tinggal tukar prefix locale) dan mapping hreflang.
- Konvensi: tanpa trailing slash, konsisten di seluruh site
- Canonical URL eksplisit per halaman per bahasa

## 4. Outline Konten per Halaman

### Home (`/{locale}`)
- Hero: foto profil, nama, role (CTO, Mantiq), satu kalimat value proposition
- Ringkasan area keahlian (3-4 poin)
- Highlight 3 proyek unggulan (`featured: true`)
- CTA ke contact

### About (`/{locale}/about`)
- Bio naratif
- Pendidikan: S1 Fisika, Universitas Negeri Gorontalo
- Pengalaman: 5+ tahun di bidang IIoT (Industrial IoT), kini CTO di Mantiq
- Filosofi kerja: Architect-Operator hybrid, no vendor lock-in
- Section Skills terkategori (Backend/Infra, AI/LLM, DevOps, Hardware-adjacent)
- Section Sertifikasi — conditional render, saat ini kosong

### Projects (`/{locale}/projects`)
- Grid/list semua proyek: nama, satu baris deskripsi, tag stack, link ke detail

### Project detail (`/{locale}/projects/[slug]`)
- Nama, deskripsi, problem yang diselesaikan, stack, role Amien
- Breadcrumb: Home → Projects → {nama proyek}

### Contact (`/{locale}/contact`)
- Email: mifthahulamien@gmail.com (link `mailto:`)
- Tidak ada form, tidak ada backend

## 5. Navigasi
- Header: Home, About, Projects, Contact + **language switcher**
- Language switcher harus mempertahankan halaman saat ini (dari `/id/projects/hermes-mcp` pindah ke `/en/projects/hermes-mcp`, bukan balik ke home)
- Footer: copyright, email

## 6. Struktur Data Konten
Setiap proyek satu file per bahasa, dengan slug yang sama:
```
/content/projects/id/autoemail-cs.mdx
/content/projects/en/autoemail-cs.mdx
```

Frontmatter minimum:
```yaml
title: string
slug: string          # sama di kedua bahasa
summary: string       # satu baris untuk halaman list
stack: string[]       # nama teknologi — TIDAK diterjemahkan
role: string
year: number
featured: boolean
```

Halaman `/projects` dan `/projects/[slug]` di-generate otomatis dari folder ini via `generateStaticParams`, tidak hardcode di komponen.

**Validasi build**: kalau ada file proyek yang cuma punya versi ID tanpa versi EN (atau sebaliknya), build harus gagal dengan pesan jelas — bukan diam-diam menampilkan halaman kosong.
