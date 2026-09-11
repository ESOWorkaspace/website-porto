# i18n Spec — Dwibahasa Indonesia + English

## 1. Locale
| Kode | Bahasa | Peran |
|---|---|---|
| `id` | Bahasa Indonesia | **Default locale**, audiens utama |
| `en` | English | Audiens internasional |

## 2. Strategi Routing
**Sub-path routing**: `/id/...` dan `/en/...`

Root `/` melakukan redirect ke `/id`. Redirect harus **permanen (308)** dan **statis** — jangan pakai deteksi bahasa dari header `Accept-Language`. Alasan: deteksi otomatis bikin Googlebot (yang crawl dari US dengan `Accept-Language: en`) tidak pernah melihat versi Indonesia, dan bikin URL tidak deterministik. Biarkan user memilih lewat switcher.

Kenapa sub-path, bukan alternatif lain:
- Subdomain (`en.domain.com`) butuh konfigurasi DNS terpisah dan memecah authority domain
- Query param (`?lang=en`) buruk untuk SEO, sering tidak di-index terpisah
- Sub-path paling didukung Next.js App Router dan paling jelas untuk crawler

## 3. Pemisahan Jenis Konten
Ada tiga jenis teks, ditangani berbeda:

| Jenis | Contoh | Disimpan di |
|---|---|---|
| **UI string** | "Lihat semua proyek", "Kontak", "Kembali" | `/messages/{locale}.json` |
| **Konten profil** | Bio, pendidikan, pengalaman, kategori skill | `/content/profile/{locale}.json` |
| **Konten proyek** | Deskripsi panjang tiap proyek | `/content/projects/{locale}/{slug}.mdx` |

Yang **tidak** diterjemahkan: nama teknologi (NestJS, PostgreSQL, Docker), nama proyek, nama perusahaan, nama universitas, slug URL.

## 4. Language Switcher
Requirement:
- Mempertahankan halaman saat ini: dari `/id/projects/hermes-mcp` → `/en/projects/hermes-mcp`, **bukan** balik ke home
- Rendered sebagai `<a href>` (link asli), bukan tombol JS — supaya crawler bisa mengikutinya dan user bisa buka di tab baru
- Tampil di header, terlihat di mobile

## 5. SEO Requirement Khusus i18n
Detail lengkap ada di `03-seo-strategy.md`, ringkasnya:
- `<html lang="id">` / `<html lang="en">` sesuai locale — set di `app/[locale]/layout.tsx`
- hreflang bidirectional + `x-default` → `/id`
- **Self-canonical per bahasa.** Versi EN canonical ke dirinya sendiri, jangan ke versi ID. Ini kesalahan paling umum di site dwibahasa dan akibatnya salah satu bahasa tidak ter-index
- `og:locale` (`id_ID` / `en_US`) + `og:locale:alternate`
- Sitemap memuat semua URL kedua bahasa dengan anotasi alternate

## 6. Kualitas Terjemahan
Konten EN harus ditulis sebagai teks Inggris yang natural, **bukan terjemahan harfiah dari ID**. Meta description khususnya — deskripsi hasil terjemahan mentah terbaca canggung dan menurunkan click-through rate. Panjang paragraf boleh berbeda antar bahasa selama informasinya setara.

## 7. Guard di Build Time
Build harus gagal (dengan pesan jelas, bukan silent) kalau:
- Ada proyek yang punya file `id` tapi tidak punya `en`, atau sebaliknya
- Ada key di `/messages/id.json` yang tidak ada di `/messages/en.json`, atau sebaliknya
- Ada field wajib di `/content/profile/{locale}.json` yang kosong

Ini murah dibuat (satu script validasi yang jalan di `prebuild`) dan mencegah kelas bug yang paling menyebalkan di site dwibahasa: halaman yang tampil kosong atau setengah bahasa tanpa ada yang sadar.

## 8. Menambah Bahasa Ketiga Nanti
Kalau desainnya benar, nambah bahasa cukup: tambah kode locale di config, tambah `/messages/{kode}.json`, tambah folder `/content/projects/{kode}/`. Tidak boleh ada perubahan di komponen. Kalau nambah bahasa berarti harus edit banyak komponen, berarti ada hardcode yang kelewat.
