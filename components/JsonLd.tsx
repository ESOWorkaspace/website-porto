/**
 * Menyuntikkan JSON-LD ke HTML saat render di server, jadi ikut terbaca
 * crawler tanpa eksekusi JS (docs/03-seo-strategy.md §5, §6).
 */
export function JsonLd({ schema }: { schema: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Konten berasal dari file lokal di repo, bukan input user.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
