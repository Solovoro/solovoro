import LeadForm from '@/components/LeadForm'
import { getT, isLocale, type Locale } from '@/app/lib/i18n'

export default function Page({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? (params.locale as Locale) : 'en'
  const t = getT(locale)

  return (
    <div className="py-12 space-y-10">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold">{t('hero.title')}</h1>
        <p className="text-lg text-gray-600">{t('hero.subtitle')}</p>
      </section>
      <section className="max-w-xl">
        <LeadForm locale={locale} />
      </section>
    </div>
  )
}
