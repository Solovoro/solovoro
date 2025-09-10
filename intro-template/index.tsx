// intro-template/index.tsx
// Safe, framework-agnostic intro. No Sanity, no next/link typing issues.
import React from 'react'

type Props = {
  createPostURL?: string | null
  siteTitle?: string | null
  siteDescription?: string | null
}

export default function IntroTemplate({
  createPostURL,
  siteTitle = 'Solovoro',
  siteDescription = 'Local services, quotes, and providers.',
}: Props) {
  return (
    <section className="mx-auto my-12 max-w-3xl rounded-lg border p-6">
      <h2 className="mb-3 text-2xl font-semibold">{siteTitle}</h2>
      <p className="mb-6 text-gray-600">{siteDescription}</p>

      {createPostURL ? (
        <a
          className="inline-flex rounded-sm bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
          href={createPostURL}
          rel="noopener noreferrer"
        >
          Go to Studio
        </a>
      ) : (
        <div className="text-sm text-gray-500">
          Studio link unavailable. You can add content later.
        </div>
      )}
    </section>
  )
}
