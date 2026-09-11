# PRD — Portfolio Website (M. Mifthahul Amien)

## 1. Tujuan
Membangun personal portfolio website dwibahasa (Indonesia + English) yang SEO friendly untuk menampilkan identitas profesional, keahlian teknis, dan proyek yang sudah dikerjakan, dengan tujuan:
- Ditemukan di Google saat orang cari nama "M. Mifthahul Amien" atau kombinasi "CTO AI automation Bandung"
- Jadi referensi kredibilitas saat networking, pitching klien, atau rekrutmen
- Bisa jadi landing point saat membagikan link ke calon klien/partner

## 2. Target Audience
1. Calon klien Mantiq/AI Lab yang googling nama Amien sebelum meeting (mayoritas berbahasa Indonesia)
2. Rekruter/partner bisnis internasional (berbahasa Inggris)
3. Komunitas developer

## 3. Scope

### In-scope (v1)
- Halaman Home/Hero — identitas singkat + CTA
- Halaman About — bio, pendidikan, filosofi kerja, role, skills
- Halaman Projects — daftar proyek + detail per proyek
- Halaman Contact — email
- **Dwibahasa penuh (ID + EN)** dengan language switcher — lihat `06-i18n-spec.md`
- Foto profil — lihat `07-assets-guide.md`
- SEO teknis penuh (metadata, sitemap, structured data, OG image, hreflang)

### Out-of-scope (v1, bisa masuk v2)
- Blog/artikel teknis
- CMS admin panel — konten dikelola langsung via file di repo
- Contact form dengan backend (v1 cukup mailto)
- Halaman/section sertifikasi — **belum ada sertifikat untuk saat ini**, tapi strukturnya disiapkan supaya tinggal diisi nanti (lihat `07-assets-guide.md`)
- Testimoni klien — belum ada

## 4. Requirement Non-Fungsional
- **SEO-first**: setiap halaman render sebagai static HTML penuh (bukan client-side render kosong), Core Web Vitals hijau, kedua bahasa ter-index terpisah
- **Performance**: Lighthouse score ≥90 di Performance, SEO, Accessibility, Best Practices
- **Mobile-first**: mayoritas trafik pencarian nama orang datang dari mobile
- **No vendor lock-in**: konten & kode 100% dimiliki, file-based content, tidak bergantung SaaS tertutup
- **Maintainable**: nambah proyek baru = tambah file konten (dua bahasa), bukan edit komponen

## 5. Constraint

### Fase saat ini: LOCAL DEVELOPMENT ONLY
- **Belum ada deployment, belum ada domain.** Target fase ini: aplikasi jalan di `localhost` dan bisa diuji manual oleh Amien.
- Claude Code **tidak perlu** membuat Dockerfile, konfigurasi Coolify, atau setup Traefik di fase ini.
- Semua yang bergantung domain (canonical URL absolut, `og:url`, sitemap dengan hostname) harus dibaca dari satu variabel config terpusat (mis. `NEXT_PUBLIC_SITE_URL`, default `http://localhost:3000`) — **jangan hardcode domain di banyak tempat**, supaya nanti tinggal ganti satu nilai saat deploy.
- Tidak perlu database, tidak perlu auth.

### Definisi selesai untuk fase ini
Amien bisa menjalankan `npm run dev`, membuka `localhost:3000`, dan:
- Melihat semua halaman di kedua bahasa
- Switch bahasa dan konten berubah dengan benar
- Melihat foto profilnya tampil
- Menjalankan `npm run build` tanpa error
- Menjalankan Lighthouse audit lokal

## 6. Success Metric (diukur nanti setelah deploy)
- Halaman ter-index Google dalam 1-2 minggu setelah submit ke Search Console
- Nama "M. Mifthahul Amien" muncul di halaman 1 Google
- Lighthouse SEO score 100, Performance ≥90

## 7. Open Decision — SUDAH DIPUTUSKAN
- [x] Domain: **ditunda**, fase ini local development saja
- [x] Bahasa: **dwibahasa Indonesia + English**
- [x] Foto profil: **ya**, satu foto profil (panduan di `07-assets-guide.md`)
- [x] Proyek confidential: **tidak ada** untuk saat ini — semua proyek di content brief boleh ditampilkan
