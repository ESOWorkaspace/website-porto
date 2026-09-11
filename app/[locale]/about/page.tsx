import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/i18n'
import { getMessages } from '@/lib/messages'
import { getProfile } from '@/lib/content'
import { aboutPageSchema, buildPageMetadata } from '@/lib/seo'
import { JsonLd } from '@/components/JsonLd'

type Params = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const { meta } = getProfile(locale)
  return buildPageMetadata({
    locale,
    segments: ['about'],
    title: meta.about.title,
    description: meta.about.description,
  })
}

export default async function AboutPage({ params }: Params) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const profile = getProfile(locale)
  const t = getMessages(locale).about

  return (
    <>
      <JsonLd schema={aboutPageSchema(locale, profile, profile.meta.about.title)} />

      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        {t.bioHeading}
      </h1>

      <div className="mt-6 space-y-4">
        {profile.bio.map((paragraph) => (
          <p key={paragraph} className="text-sm leading-relaxed text-muted">
            {paragraph}
          </p>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight">
          {t.educationHeading}
        </h2>
        <ul className="mt-4 space-y-3">
          {profile.education.map((item) => (
            <li key={item.degree} className="text-sm">
              <span className="font-medium">{item.degree}</span>
              <span className="text-muted"> — {item.institution}</span>
              {item.note && (
                <span className="text-muted"> ({item.note})</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight">
          {t.experienceHeading}
        </h2>
        <ul className="mt-4 space-y-2">
          {profile.experience.map((item) => (
            <li
              key={item}
              className="border-l-2 border-border pl-4 text-sm leading-relaxed text-muted"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight">
          {t.philosophyHeading}
        </h2>
        <div className="mt-4 space-y-4">
          {profile.philosophy.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight">
          {t.skillsHeading}
        </h2>
        <div className="mt-5 space-y-6">
          {profile.skills.map((group) => (
            <div key={group.category}>
              <h3 className="text-sm font-semibold">{group.category}</h3>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded border border-border bg-surface px-2 py-0.5 font-mono text-[11px] text-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/*
        Sertifikasi: conditional render penuh. Selama array kosong, heading-nya
        pun tidak dirender — itu thin content (docs/07-assets-guide.md §B2).
        Cara mengisinya ada di docs/07-assets-guide.md §B1.
      */}
      {profile.certifications.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold tracking-tight">
            {t.certificationsHeading}
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {profile.certifications.map((cert) => (
              <li
                key={cert.name}
                className="rounded-lg border border-border bg-surface p-4"
              >
                {cert.image && (
                  <Image
                    src={cert.image}
                    alt={cert.name}
                    width={800}
                    height={565}
                    // Di bawah fold: lazy load (docs/07-assets-guide.md §B2).
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, 320px"
                    className="mb-3 w-full rounded border border-border"
                  />
                )}
                <h3 className="text-sm font-semibold">{cert.name}</h3>
                <p className="mt-1 text-xs text-muted">
                  {t.certificationIssuedBy} {cert.issuer}
                  {cert.year !== undefined && ` · ${cert.year}`}
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs">
                  {cert.file && (
                    <a
                      href={cert.file}
                      download
                      className="text-accent hover:underline"
                    >
                      {t.certificationDownload}
                    </a>
                  )}
                  {cert.url && (
                    <a
                      href={cert.url}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="text-accent hover:underline"
                    >
                      {t.certificationVerify}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
