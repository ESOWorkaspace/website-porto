# public/images

Taruh foto profil di sini dengan nama **`profile.jpg`**:

```bash
cp /path/ke/foto-kamu.jpg public/images/profile.jpg
```

Spesifikasi (dari `docs/07-assets-guide.md` §A1):

- Format JPG, rasio **kotak 1:1**
- Ukuran 800×800 px – 1200×1200 px
- Ukuran file di bawah 500 KB

Contoh kompresi dengan ImageMagick:

```bash
magick /path/ke/foto-kamu.jpg -quality 82 -resize 1000x1000 public/images/profile.jpg
```

Selama file ini belum ada, hero merender placeholder inisial (`MA`) dengan
dimensi yang sama — layout tidak pecah. Nama file diatur di `lib/config.ts`
(konstanta `PROFILE_IMAGE`); kalau mau pakai nama/format lain, ubah di sana.
