// pages/api/og.tsx
import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
import type { Settings } from 'lib/sanity.queries'
import { client } from 'lib/sanity.client'
import { settingsQuery } from 'lib/sanity.queries'

// Keep Edge runtime (OG works here); TS-safe values inside.
export const config = { runtime: 'edge' }

export default async function handler(_req: NextRequest) {
  // TS-safe default; never leave undefined
  let title: string = 'Solovoro'

  try {
    const settings = (await client.fetch<Settings>(settingsQuery)) || ({} as Partial<Settings>)
    // Ensure string | null -> string fallback
    const maybe = (settings as any)?.ogImage?.title as string | null | undefined
    title = maybe ?? title
  } catch {
    // swallow fetch errors; keep default title
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          letterSpacing: '-0.02em',
          fontWeight: 700,
        }}
      >
        {title}
      </div>
    ),
    { width: 1200, height: 630 }
  )
}

