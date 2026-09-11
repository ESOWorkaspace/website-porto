# Content Brief — Konten Aktual (ID + EN)

Ini isi konten yang sudah dikonfirmasi Amien. Claude Code bisa langsung memakainya untuk mengisi `/content/`. Bagian bertanda **[DRAFT]** boleh disesuaikan tone-nya, tapi faktanya jangan diubah. **Jangan mengarang fakta yang tidak ada di dokumen ini.**

---

## 1. Identitas
| Field | Nilai |
|---|---|
| Nama lengkap | M. Mifthahul Amien |
| Nama panggilan | Amien |
| Role | CTO, PT Mesin Kantong Ajaib (Mantiq) |
| Lokasi | Bandung, Jawa Barat, Indonesia |
| Email | mifthahulamien@gmail.com |
| Afiliasi lain | AI Lab (sister R&D lab Mantiq) |
| Foto profil | Ada — lihat `07-assets-guide.md` |

## 2. Pendidikan
- **S1 Fisika — Universitas Negeri Gorontalo (UNG)**
- EN: *Bachelor of Science in Physics — Universitas Negeri Gorontalo*

Catatan penulisan: nama universitas jangan diterjemahkan. Di versi EN boleh ditulis "Universitas Negeri Gorontalo (State University of Gorontalo)" sekali di penyebutan pertama.

## 3. Pengalaman
- **5+ tahun di bidang IIoT (Industrial IoT)**
- Saat ini: CTO di Mantiq, memimpin pengembangan AI automation dan infrastruktur

Latar Fisika + 5 tahun IIoT + sekarang AI automation adalah cerita yang kuat untuk halaman About — jalur dari sains dasar ke sistem industri ke perangkat lunak. Silakan dinarasikan begitu.

## 4. Value Proposition [DRAFT]

**ID:**
> Architect-Operator hybrid yang merancang SOP, pricing framework, dan arsitektur sistem — sekaligus turun langsung debugging sampai level kernel dan Docker internals. Berlatar Fisika dan 5+ tahun di IIoT, kini membangun sistem AI automation dan infrastruktur self-hosted dengan prinsip no vendor lock-in: klien memiliki penuh sistem mereka.

**EN:**
> An architect-operator hybrid who designs SOPs, pricing frameworks, and system architecture — while still debugging down to kernel and Docker internals. With a physics background and 5+ years in industrial IoT, now building AI automation systems and self-hosted infrastructure on a no-vendor-lock-in principle: clients fully own their systems.

## 5. Kategori Keahlian
Nama teknologi **tidak diterjemahkan**; hanya nama kategorinya yang punya versi ID/EN.

| Kategori (ID) | Kategori (EN) | Isi |
|---|---|---|
| Backend & Infrastruktur | Backend & Infrastructure | NestJS, Next.js (App Router), PostgreSQL/Supabase (pgvector), Prisma ORM, TypeScript, Docker, Coolify, Traefik, WireGuard, SeaweedFS, n8n, ERPNext |
| AI & LLM | AI & LLM | OpenRouter integration, RAG (hybrid retrieval + reranking), arsitektur multi-agent, MCP server development |
| DevOps & Sistem | DevOps & Systems | Self-hosted stack management (60+ container via Coolify), automated backup, dev/prod database isolation |
| Hardware & IIoT | Hardware & IIoT | Fingerprint/RFID access control, face recognition (InsightFace), eKTP-as-RFID integration, Raspberry Pi |

## 6. Daftar Proyek
Semua proyek berikut **boleh ditampilkan publik**. Tulis deskripsi di level arsitektur dan hasil, tanpa menyebut kredensial, ID internal, nama klien yang tidak disebut di sini, atau angka finansial.

| Slug | Nama | Ringkasan | Featured |
|---|---|---|---|
| `autoemail-cs` | AutoEmail CS | Sistem inbound email agent untuk customer service. NestJS + Next.js + pgvector, hybrid RAG dengan reranking, anti-hallucination tiga lapis | ✅ |
| `ai-doppelganger` | AI Doppelganger | PoC cloning reasoning dan gaya bicara, pipeline multi-agent (klasifikasi konteks → deteksi register → retrieval → generasi) | ✅ |
| `erp-shared-core` | ERP Shared Core | Arsitektur modul finance dan ledger custom: double-entry, immutable posting, reversal pattern, audit log polymorphic | ✅ |
| `mantiq-ai-agent-platform` | AI Agent Platform | Shared-core AI agent microservice: channel layer, personalization layer, agent core dengan sistem skill per-tenant | |
| `hermes-mcp` | Hermes MCP | MCP server stack untuk AI Lab, menyediakan tool terintegrasi bagi asisten AI | |
| `luna-discord-bot` | Luna | Discord bot asisten product-knowledge untuk program Marathon Claude | |
| `nutrilogic` | Nutrilogic | Layanan panduan nutrisi harian berbasis Telegram | |
| `pulse-fitness` | Pulse Fitness | Sistem manajemen gym custom: akses fingerprint/RFID, server mini PC lokal, integrasi WhatsApp API | |
| `page-slug-manager` | Page/Slug Manager | Internal app manajemen sales dan checkout page dengan integrasi commerce API | |

Setiap proyek butuh dua file (`/content/projects/id/{slug}.mdx` dan `/content/projects/en/{slug}.mdx`) dengan isi yang setara, bukan terjemahan kata per kata.

## 7. Kontak
- Email: **mifthahulamien@gmail.com**
- Tidak ada nomor telepon, tidak ada link sosial media untuk saat ini
- Kalau nanti ada LinkedIn/GitHub, tinggal tambah di file profile dan otomatis muncul di `sameAs` JSON-LD

## 8. Sertifikasi
**Belum ada.** Siapkan struktur data dan komponennya, tapi jangan render section-nya selama datanya kosong. Cara menambahkan nanti ada di `07-assets-guide.md`.

## 9. Testimoni
**Belum ada.** Jangan buat section testimoni, jangan buat placeholder testimoni palsu.
