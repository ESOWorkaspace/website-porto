# Build Handoff — Instruksi untuk Claude Code

Dokumen ini yang dibaca pertama. Sisanya adalah referensi detail.

## Konteks
Membangun personal portfolio website dwibahasa (Indonesia + English) yang SEO friendly untuk M. Mifthahul Amien, CTO di PT Mesin Kantong Ajaib (Mantiq), Bandung.

## Batas Fase Ini
**Local development saja.** Aplikasi harus jalan di `localhost:3000` dan bisa diuji manual. **Jangan** buat Dockerfile, konfigurasi Coolify, setup Traefik, atau apa pun yang berkaitan dengan deployment dan domain. Itu fase berikutnya.

## Urutan Baca Dokumen
| # | File | Isi |
|---|---|---|
| 1 | `01-PRD.md` | Tujuan, scope, batas fase, definisi selesai |
| 2 | `02-information-architecture.md` | Sitemap, struktur URL, outline tiap halaman |
| 3 | `06-i18n-spec.md` | Strategi dwibahasa — **baca sebelum mulai coding**, ini yang paling mempengaruhi struktur |
| 4 | `04-technical-spec.md` | Stack, struktur folder, config terpusat |
| 5 | `03-seo-strategy.md` | Metadata, hreflang, JSON-LD, checklist |
| 6 | `05-content-brief.md` | Konten aktual — **sumber fakta satu-satunya** |
| 7 | `07-assets-guide.md` | Penanganan foto profil dan sertifikat |

## Aturan yang Tidak Boleh Dilanggar

1. **Jangan mengarang fakta.** Semua klaim tentang Amien harus berasal dari `05-content-brief.md`. Kalau butuh info yang tidak ada di sana (tanggal spesifik, nama klien, angka, jumlah tahun pengalaman per proyek), **tanyakan** — jangan diisi tebakan. Ini website identitas profesional, fakta palsu di sini merugikan.
2. **Jangan hardcode domain atau email.** Semua lewat `/lib/config.ts`.
3. **Self-canonical per bahasa.** Versi EN canonical ke dirinya sendiri. Jangan canonical silang.
4. **Jangan buat section kosong.** Sertifikasi dan testimoni belum ada isinya — jangan render heading atau placeholder-nya.
5. **Slug proyek identik di kedua bahasa.**

## Definisi Selesai
Amien bisa menjalankan:
```bash
npm install
npm run dev
```
lalu di `localhost:3000`:
- [ ] Root `/` redirect ke `/id`
- [ ] Semua halaman tampil di `/id` dan `/en`
- [ ] Language switcher berpindah bahasa tanpa keluar dari halaman saat ini
- [ ] Foto profil tampil (atau placeholder rapi kalau file belum ditaruh)
- [ ] Semua 9 proyek tampil di `/id/projects` dan `/en/projects`, tiap detail bisa dibuka
- [ ] View source: ada `<title>`, `<meta description>`, hreflang, dan JSON-LD di HTML — bukan hanya muncul setelah JS jalan
- [ ] `/sitemap.xml` dan `/robots.txt` bisa diakses
- [ ] `<html lang>` berubah sesuai locale

lalu:
```bash
npm run build
```
- [ ] Build sukses tanpa error dan tanpa warning TypeScript
- [ ] Script validasi konten jalan dan lolos (lihat `06-i18n-spec.md` section 7)

## Yang Perlu Dilaporkan Balik ke Amien Setelah Selesai
1. Cara menjalankan project (perintah persisnya)
2. Di mana menaruh foto profil, dengan path lengkapnya
3. File mana saja yang perlu diedit kalau mau mengubah konten (bukan komponen — file konten)
4. Keputusan teknis apa pun yang menyimpang dari dokumen ini, beserta alasannya
5. Hal yang masih perlu keputusan Amien sebelum bisa dianggap final
