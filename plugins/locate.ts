// plugins/locate.ts
// Fix: only pass primitive params to `listenQuery` (Sanity requires QueryParams).
// Previous code forwarded `version` / `perspectiveStack` which broke typing.

import type {Observable} from 'rxjs'

type Doc = {
  slug?: { current?: string }
  title?: string
}

/**
 * Export a function (or whatever your Studio expects) that creates
 * an Observable of the doc's slug/title for a given _id.
 *
 * `context.documentStore.listenQuery` requires primitive params only.
 */
export default function locate(
  context: {
    documentStore: {
      listenQuery: (
        query: string,
        params: Record<string, string | number | boolean | string[]>,
        options?: {perspective?: 'drafts' | 'published'}
      ) => unknown
    }
  },
  params: { id?: string } & Record<string, unknown>
): Observable<Doc | null> {
  const id = typeof params.id === 'string' ? params.id : ''

  // Only pass the primitive `id` param. No `version`, no `perspectiveStack`, etc.
  const safeParams: Record<string, string> = { id }

  const query =
    `*[_id == $id && defined(slug.current)][0]{slug,title}`

  return context.documentStore.listenQuery(
    query,
    safeParams,
    { perspective: 'drafts' }
  ) as Observable<Doc | null>
}
