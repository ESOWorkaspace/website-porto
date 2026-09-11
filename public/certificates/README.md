# public/certificates

Kosong untuk sekarang — belum ada sertifikat (`docs/05-content-brief.md` §8).

Cara menambahkan nanti (ringkasan dari `docs/07-assets-guide.md` §B1):

1. Taruh file di sini, mis. `public/certificates/nama-sertifikat.jpg`
   (kalau PDF: sertakan juga versi thumbnail `.jpg`-nya).
2. Daftarkan di array `certifications` di **kedua** file:
   `content/profile/id.json` dan `content/profile/en.json`.

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

Field `year`, `image`, `file`, dan `url` opsional — hapus saja kalau tidak ada.

Begitu array ini terisi, section **Sertifikasi** otomatis muncul di halaman
About dan `hasCredential` otomatis masuk ke JSON-LD `Person`. Selama array
kosong, section-nya tidak dirender sama sekali.

> Sebelum upload: sertifikat sering memuat nomor ID, tanggal lahir, atau QR
> verifikasi. Cek dulu apa yang terlihat di gambar. Kalau ada data yang tidak
> ingin disebar, sensor bagian itu atau cukup daftarkan namanya tanpa `image`.
