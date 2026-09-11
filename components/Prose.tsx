import { MDXRemote } from 'next-mdx-remote/rsc'

/**
 * Merender body MDX konten proyek di server (tanpa JS ke client).
 *
 * Komentar HTML (`<!-- ... -->`) dibuang sebelum dikompilasi: sintaks itu
 * tidak valid di MDX v3, sementara penanda TODO di file konten sengaja
 * ditulis dengan gaya itu supaya mudah dicari dan tidak pernah ikut tampil.
 */
function stripHtmlComments(source: string): string {
  return source.replace(/<!--[\s\S]*?-->/g, '').trim()
}

export function Prose({ source }: { source: string }) {
  return (
    <div className="prose-mdx">
      <MDXRemote source={stripHtmlComments(source)} />
    </div>
  )
}
