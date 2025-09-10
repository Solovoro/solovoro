import en from '@/app/i18n/en.json'
import fr from '@/app/i18n/fr.json'

export const LOCALES = ['en', 'fr'] as const
export type Locale = (typeof LOCALES)[number]
export const isLocale = (x: string): x is Locale => LOCALES.includes(x as Locale)

const dict: Record<Locale, Record<string, any>> = { en, fr }

export function getT(locale: Locale) {
  const d = dict[locale]
  return (key: string) => {
    const parts = key.split('.')
    let cur: any = d
    for (const p of parts) cur = cur?.[p]
    return typeof cur === 'string' ? cur : ''
  }
}
