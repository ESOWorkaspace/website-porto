import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Kept out of `output: 'export'` on purpose (see docs/04-technical-spec.md §6).
  // Standalone output: minimal server bundle for the Docker image (see Dockerfile).
  output: 'standalone',
  reactStrictMode: true,
  async redirects() {
    return [
      // Static, permanent (308) redirect. No Accept-Language detection —
      // see docs/06-i18n-spec.md §2.
      { source: '/', destination: '/id', permanent: true },
    ]
  },
}

export default nextConfig
