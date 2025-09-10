'use client'

import { useState } from 'react'
import { getT, type Locale } from '@/app/lib/i18n'

interface Props { locale: Locale }

export default function LeadForm({ locale }: Props) {
  const t = getT(locale)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setSuccess(null)
    setError(null)
    const fd = new FormData(e.currentTarget)
    const payload = {
      locale,
      name: String(fd.get('name') || '').trim(),
      email: String(fd.get('email') || '').trim(),
      phone: String(fd.get('phone') || '').trim(),
      city: String(fd.get('city') || '').trim(),
      service: String(fd.get('service') || '').trim(),
      message: String(fd.get('message') || '').trim(),
    }

    // client validation
    if (!payload.name || !payload.email) {
      setLoading(false)
      setError(t('form.required'))
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      setLoading(false)
      setError(t('form.invalidEmail'))
      return
    }

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('bad status')
      const data = await res.json()
      if (data?.ok) {
        setSuccess(t('form.success'))
        ;(e.currentTarget as HTMLFormElement).reset()
      } else {
        setError(t('form.error'))
      }
    } catch {
      setError(t('form.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="block text-sm mb-1">{t('form.name')}</label>
        <input name="name" className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm mb-1">{t('form.email')}</label>
        <input name="email" type="email" className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm mb-1">{t('form.phone')}</label>
        <input name="phone" className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm mb-1">{t('form.city')}</label>
        <input name="city" className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm mb-1">{t('form.service')}</label>
        <input name="service" className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm mb-1">{t('form.message')}</label>
        <textarea name="message" className="w-full border rounded px-3 py-2" rows={4} />
      </div>

      <button
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? '…' : t('form.submit')}
      </button>

      {success && <p className="text-green-600">{success}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </form>
  )
}
