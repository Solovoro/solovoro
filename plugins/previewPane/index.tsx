// plugins/previewPane/index.tsx
// Minimal, schema-agnostic preview pane. Removes imports of `schemas/*` to avoid TS/module errors.

import type { DefaultDocumentNodeResolver } from 'sanity/structure'
import { Iframe } from 'sanity-plugin-iframe-pane'

type Doc = { slug?: { current?: string } }

const getPreviewUrl = (doc: Doc): string => {
  const slug = doc?.slug?.current || ''
  const base =
    process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : 'http://localhost:3000'
  const path = slug ? `/posts/${slug}` : '/'
  return `${base}${path}?preview=1`
}

const defaultDocumentNode: DefaultDocumentNodeResolver = (S, { schemaType }) => {
  if (schemaType === 'post') {
    return S.document().views([
      S.view.form(),
      S.view
        .component(Iframe)
        .options({
          url: (doc: Doc) => getPreviewUrl(doc),
          reload: { button: true },
        })
        .title('Preview'),
    ])
  }

  if (schemaType === 'author') {
    // Form only for authors; no external imports needed.
    return S.document().views([S.view.form()])
  }

  return S.document().views([S.view.form()])
}

export { defaultDocumentNode }
export default defaultDocumentNode
