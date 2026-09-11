# public/og

`default.png` adalah **placeholder** OG image (1200×630) yang dibuat otomatis.
Isinya hanya fakta dari `docs/05-content-brief.md`. Timpa kapan saja:

```bash
cp /path/ke/og-kamu.png public/og/default.png
```

Ukuran wajib 1200×630 px (landscape). Path-nya diatur di `lib/config.ts`
(konstanta `OG_IMAGE`).
