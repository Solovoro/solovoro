// pages/api/og.tsx
import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

// Keep OG on Edge runtime.
export const config = { runtime: 'edge' }

export default function handler(req: NextRequest) {
  // No Sanity deps — read ?title= from URL or fall back.
  const { searchParams } = new URL(req.url)
  const title = (searchParams.get('title') ?? 'Solovoro') as string

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
          color: 'black',
          fontSize: 64,
          letterSpacing: '-0.02em',
          fontWeight: 700,
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial',
        }}
      >
        {title}
      </div>
    ),
    { width: 1200, height: 630 }
  )
}


