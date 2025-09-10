import '../../tailwind.css'
import type { ReactNode } from 'react'
import { buildMeta, buildOrganizationJsonLd, buildWebSiteJsonLd } from '@/app/lib/seo'
import { getT, isLocale, type Locale } from '@/app/lib/i18n'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? (params.locale as Locale) : 'en'
  return buildMeta({
    locale,
    title:
      locale === 'en'
        ? 'Solovoro — Moving & Services'
        : 'Solovoro — Déménagement & Services',
    description:
      locale === 'en'
        ? 'Compare moving providers in Montreal. Simple lead form, fast responses.'
        : 'Comparez les déménageurs à Montréal. Formulaire simple, réponses rapides.',
    slug: '',
  })
}

export default function RootLayout({
  children,
  params,
}: {
  children: ReactNode
  params: { locale: string }
}) {
  const locale: Locale = isLocale(params.locale) ? (params.locale as Locale) : 'en'
  const t = getT(locale)
  const org = buildOrganizationJsonLd(locale)
  const site = buildWebSiteJsonLd(locale)
  return (
    <html lang={locale}>
      <body>
        <header className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href={`/${locale}/`} className="font-semibold">
            {t('nav.brand')}
          </a>
          <LanguageSwitcher locale={locale} />
        </header>
        <main className="max-w-5xl mx-auto px-4">{children}</main>
        <footer className="max-w-5xl mx-auto px-4 py-10 text-sm text-gray-500">
          {t('footer.copy')}
        </footer>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(site) }}
        />
      </body>
    </html>
  )
}
