import type { Metadata } from 'next'
import {
  AUTHOR_EMAIL,
  AUTHOR_NAME,
  ALUMNI_OF,
  LOCATION,
  OG_IMAGE,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  ORGANIZATION_NAME,
  PROFILE_IMAGE,
  SAME_AS,
  SITE_URL,
  absoluteUrl,
} from '@/lib/config'
import {
  DEFAULT_LOCALE,
  HTML_LANG,
  LOCALES,
  OG_LOCALE,
  localePath,
  otherLocales,
  type Locale,
} from '@/lib/i18n'
import type { Certification, Profile } from '@/lib/schema'

type PageMetaInput = {
  locale: Locale
  /** Segment di dalam locale, mis. ['projects', 'hermes-mcp']. Kosong = home. */
  segments?: string[]
  title: string
  description: string
  /** true untuk Home: title dipakai apa adanya, tanpa suffix nama. */
  absoluteTitle?: boolean
}

/**
 * Peta hreflang untuk `alternates.languages`.
 * Bidirectional + x-default -> versi ID (docs/03-seo-strategy.md §4).
 */
function hreflangMap(segments: string[]): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const locale of LOCALES) {
    languages[HTML_LANG[locale]] = absoluteUrl(localePath(locale, ...segments))
  }
  languages['x-default'] = absoluteUrl(localePath(DEFAULT_LOCALE, ...segments))
  return languages
}

/**
 * Builder metadata tunggal untuk semua halaman. Canonical selalu menunjuk ke
 * dirinya sendiri per bahasa — versi EN TIDAK canonical ke versi ID
 * (docs/06-i18n-spec.md §5).
 */
export function buildPageMetadata({
  locale,
  segments = [],
  title,
  description,
  absoluteTitle = false,
}: PageMetaInput): Metadata {
  const path = localePath(locale, ...segments)
  const canonical = absoluteUrl(path)

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
      languages: hreflangMap(segments),
    },
    openGraph: {
      type: 'website',
      url: canonical,
      siteName: AUTHOR_NAME,
      title: absoluteTitle ? title : `${title} | ${AUTHOR_NAME}`,
      description,
      locale: OG_LOCALE[locale],
      alternateLocale: otherLocales(locale).map((l) => OG_LOCALE[l]),
      images: [
        {
          url: absoluteUrl(OG_IMAGE),
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: AUTHOR_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: absoluteTitle ? title : `${title} | ${AUTHOR_NAME}`,
      description,
      images: [absoluteUrl(OG_IMAGE)],
    },
  }
}

/* ------------------------------ JSON-LD ------------------------------ */

type JsonLdValue = Record<string, unknown>

/**
 * `Person` schema. `hasCredential` otomatis ikut begitu array certifications
 * di content/profile/{locale}.json terisi (docs/07-assets-guide.md §B2).
 */
export function personSchema(locale: Locale, profile: Profile): JsonLdValue {
  const person: JsonLdValue = {
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: AUTHOR_NAME,
    jobTitle: profile.jobTitle,
    description: profile.valueProposition,
    email: `mailto:${AUTHOR_EMAIL}`,
    image: absoluteUrl(PROFILE_IMAGE),
    url: absoluteUrl(localePath(locale)),
    worksFor: {
      '@type': 'Organization',
      name: ORGANIZATION_NAME,
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: ALUMNI_OF,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: LOCATION.city,
      addressRegion: LOCATION.region,
      addressCountry: LOCATION.countryCode,
    },
    knowsAbout: profile.knowsAbout,
  }

  if (SAME_AS.length > 0) person.sameAs = [...SAME_AS]

  const credentials = credentialSchema(profile.certifications)
  if (credentials.length > 0) person.hasCredential = credentials

  return person
}

function credentialSchema(certifications: readonly Certification[]) {
  return certifications.map((cert) => {
    const credential: JsonLdValue = {
      '@type': 'EducationalOccupationalCredential',
      name: cert.name,
      credentialCategory: 'certificate',
      recognizedBy: { '@type': 'Organization', name: cert.issuer },
    }
    if (cert.year !== undefined) credential.dateCreated = String(cert.year)
    if (cert.url) credential.url = cert.url
    return credential
  })
}

/** ProfilePage yang membungkus Person, untuk Home (docs/03-seo-strategy.md §5). */
export function profilePageSchema(locale: Locale, profile: Profile): JsonLdValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${absoluteUrl(localePath(locale))}#profilepage`,
    url: absoluteUrl(localePath(locale)),
    inLanguage: HTML_LANG[locale],
    name: `${AUTHOR_NAME} — ${profile.jobTitle}`,
    mainEntity: personSchema(locale, profile),
  }
}

export function aboutPageSchema(locale: Locale, profile: Profile, title: string): JsonLdValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${absoluteUrl(localePath(locale, 'about'))}#aboutpage`,
    url: absoluteUrl(localePath(locale, 'about')),
    inLanguage: HTML_LANG[locale],
    name: title,
    mainEntity: personSchema(locale, profile),
  }
}

export function creativeWorkSchema(
  locale: Locale,
  project: { title: string; slug: string; summary: string; stack: readonly string[]; year?: number },
): JsonLdValue {
  const schema: JsonLdValue = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${absoluteUrl(localePath(locale, 'projects', project.slug))}#project`,
    url: absoluteUrl(localePath(locale, 'projects', project.slug)),
    name: project.title,
    description: project.summary,
    inLanguage: HTML_LANG[locale],
    keywords: [...project.stack].join(', '),
    author: { '@id': `${SITE_URL}/#person` },
  }
  if (project.year !== undefined) schema.dateCreated = String(project.year)
  return schema
}

export function breadcrumbSchema(
  items: readonly { name: string; path: string }[],
): JsonLdValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}
