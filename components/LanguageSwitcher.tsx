'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function LanguageSwitcher({ locale }: { locale: 'en' | 'fr' }) {
  const pathname = usePathname() || '/'
  const segs = pathname.split('/').filter(Boolean)
  const cur = segs[0] === 'en' || segs[0] === 'fr' ? segs[0] : 'en'
  const next = cur === 'en' ? 'fr' : 'en'
  segs[0] = next
  const href = '/' + segs.join('/') + (pathname.endsWith('/') ? '/' : '')
  const label = cur === 'en' ? 'Français' : 'English'
  return (
    <Link href={href} prefetch={false} aria-label="switch language" className="underline">
      {label}
    </Link>
  )
}
