# Assets Guide — Foto Profil & Sertifikat

Dokumen ini punya dua pembaca: **Amien** (langkah manual memasukkan file) dan **Claude Code** (spesifikasi teknis penanganannya).

---

# BAGIAN A — Foto Profil

## A1. Untuk Amien: cara memasukkan foto

**Langkah 1 — siapkan filenya**
- Format: JPG atau PNG (JPG lebih kecil untuk foto orang)
- Rasio: **kotak 1:1**. Foto potrait/landscape akan ke-crop otomatis dan hasilnya sering tidak enak dilihat — lebih baik crop sendiri dulu supaya kamu yang kontrol framingnya
- Ukuran ideal: **800×800 px sampai 1200×1200 px**. Lebih besar dari itu tidak menambah kualitas tampilan tapi memperlambat halaman
- Ukuran file: usahakan di bawah 500 KB. Kalau kelewat besar, kompres dulu (di Linux bisa pakai `convert profile.jpg -quality 82 -resize 1000x1000 profile-out.jpg` dari ImageMagick)
- Framing: wajah jangan terlalu kecil, ada sedikit ruang di atas kepala, background tidak ramai

**Langkah 2 — taruh di project**
Setelah Claude Code selesai men-generate project, akan ada folder `public/images/`. Copy fotomu ke situ dengan nama persis:

```bash
cp /path/ke/foto-kamu.jpg public/images/profile.jpg
```

**Nama filenya harus `profile.jpg`.** Kode sudah mengacu ke nama itu. Kalau file kamu PNG, rename jadi `profile.jpg` tidak cukup — ganti juga referensinya di `/lib/config.ts`, atau lebih gampang: convert dulu ke JPG.

**Langkah 3 — cek hasilnya**
```bash
npm run dev
```
Buka `localhost:3000`, foto harus muncul di hero. Kalau muncul icon gambar rusak, berarti nama file atau path-nya tidak cocok — cek `ls public/images/`.

**Langkah 4 — OG image (opsional, untuk preview saat link dibagikan)**
Kalau mau preview bagus saat link di-share di WhatsApp/LinkedIn, siapkan satu gambar **1200×630 px** (landscape, bukan kotak) dan taruh di `public/og/default.png`. Ini gambar yang muncul sebagai thumbnail. Kalau belum ada, Claude Code akan generate placeholder sederhana — bisa diganti kapan saja.

## A2. Untuk Claude Code: spesifikasi teknis

- Path: `public/images/profile.jpg`, dirujuk lewat konstanta di `/lib/config.ts` (`PROFILE_IMAGE`), bukan hardcode di komponen
- Pakai `next/image` dengan `width`/`height` eksplisit untuk mencegah CLS
- Foto di hero adalah kandidat **elemen LCP** → wajib `priority`, **jangan** lazy load
- Beri `alt` deskriptif dan **berbeda per bahasa** (ID: "Foto profil M. Mifthahul Amien"; EN: "Portrait of M. Mifthahul Amien")
- Sediakan fallback yang tidak memecah layout kalau file belum ada — komponen tidak boleh crash saat pertama kali `npm run dev` sebelum Amien menaruh fotonya. Placeholder netral (inisial di atas background solid) sudah cukup
- Sertakan `public/images/.gitkeep` supaya folder ada di repo bersih
- Foto profil masuk ke field `image` di JSON-LD `Person` schema, sebagai URL absolut (`${SITE_URL}/images/profile.jpg`)

---

# BAGIAN B — Sertifikat (belum ada, disiapkan untuk nanti)

## B1. Untuk Amien: cara menambahkan sertifikat nanti

Sertifikat kamu ada dalam bentuk PDF atau foto. Saran penanganannya:

**Kalau sertifikatnya PDF:**
1. Taruh file di `public/certificates/nama-sertifikat.pdf`
2. Buat juga versi gambar thumbnail-nya (screenshot halaman pertama, 800px lebar cukup) di `public/certificates/nama-sertifikat.jpg` — supaya bisa ditampilkan sebagai preview tanpa memaksa orang download PDF

**Kalau sertifikatnya foto:**
1. Crop rapi (buang bagian meja/tangan kalau hasil jepretan)
2. Resize ke lebar maksimal 1200px
3. Taruh di `public/certificates/nama-sertifikat.jpg`

**Lalu daftarkan di file data.** Buka `content/profile/id.json` dan `content/profile/en.json`, isi array `certifications`:

```json
"certifications": [
  {
    "name": "Nama Sertifikat",
    "issuer": "Nama Penerbit",
    "year": 2025,
    "image": "/certificates/nama-sertifikat.jpg",
    "file": "/certificates/nama-sertifikat.pdf",
    "url": "https://link-verifikasi-kalau-ada"
  }
]
```

Field `file` dan `url` opsional — hapus saja kalau tidak ada. Begitu array ini terisi, section Sertifikasi otomatis muncul di halaman About. Selama array-nya kosong, section-nya tidak dirender sama sekali.

**Satu pertimbangan sebelum upload:** sertifikat sering memuat nomor ID, tanggal lahir, atau QR verifikasi. Cek dulu apa yang terlihat di gambar sebelum menaruhnya di halaman publik — kalau ada data yang tidak ingin kamu sebar, sensor bagian itu atau tampilkan nama sertifikatnya saja tanpa gambar.

## B2. Untuk Claude Code: spesifikasi teknis

- Definisikan tipe `Certification` di TypeScript dengan field: `name`, `issuer`, `year`, `image?`, `file?`, `url?`
- Array `certifications` ada di `/content/profile/{locale}.json`, **saat ini isinya `[]`**
- Section Sertifikasi di `/about` **conditional render**: kalau array kosong, section (termasuk heading) tidak dirender sama sekali. Jangan tampilkan heading dengan isi kosong — itu thin content dan buruk untuk SEO
- Kalau `image` ada → tampilkan thumbnail via `next/image` (lazy load, ini di bawah fold)
- Kalau `file` ada → link download PDF dengan atribut `download`
- Kalau `url` ada → link eksternal dengan `rel="noopener noreferrer"`
- Buat folder `public/certificates/` dengan `.gitkeep`
- Saat array terisi nanti, tambahkan `hasCredential` ke `Person` JSON-LD schema — siapkan helper-nya sekarang supaya tinggal aktif otomatis
