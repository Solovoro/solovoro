import type { Metadata } from 'next'
import { type Locale } from '@/app/lib/i18n'

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.solovoro.ca'

export function urlFor(locale: Locale, slug = '') {
  const s = slug.replace(/^\//, '')
  return `${BASE}/${locale}/${s}`
}

export function buildMeta({
  locale,
  title,
  description,
  slug = '',
}: {
  locale: Locale
  title: string
  description: string
  slug?: string
}): Metadata {
  const canonical = urlFor(locale, slug)
  const enUrl = urlFor('en' as Locale, slug)
  const frUrl = urlFor('fr' as Locale, slug)
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { en: enUrl, fr: frUrl },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Solovoro',
      locale,
      type: 'website',
    },
  }
}

export function buildOrganizationJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: locale === 'en' ? 'Solovoro' : 'Solovoro',
    alternateName:
      locale === 'en' ? 'Solovoro Moving' : 'Solovoro D\u00e9m\u00e9nagement',
    url: urlFor(locale),
  }
}

export function buildWebSiteJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Solovoro',
    alternateName:
      locale === 'en' ? 'Solovoro Moving' : 'Solovoro D\u00e9m\u00e9nagement',
    inLanguage: locale,
    url: urlFor(locale),
  }
}
