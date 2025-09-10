// pages/api/revalidate.ts
/**
 * Sanity webhook that revalidates pages when content changes.
 * Keeps original behavior, but fixes TS errors (strictNullChecks) that break the build.
 */

import { isValidSignature as verifySignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import { apiVersion, dataset, projectId } from 'lib/sanity.api'
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  createClient,
  groq,
  type SanityClient,
  type SanityDocument,
} from 'next-sanity'
import type { ParsedBody } from 'next-sanity/webhook'

export const config = {
  api: {
    // Next.js will by default parse the body, which can lead to invalid signatures.
    bodyParser: false,
  },
}

export default async function revalidate(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { body, isValidSignature } = await parseBody(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    )

    if (!isValidSignature) {
      const message = 'Invalid signature'
      console.log(message)
      return res.status(401).send(message)
    }

    if (!body || typeof (body as any)?._id !== 'string') {
      const invalidId = 'Invalid _id'
      console.error(invalidId, { body })
      return res.status(400).send(invalidId)
    }

    const staleRoutes = await queryStaleRoutes(body as any)

    // Type of `revalidate` isn’t in NextApiResponse’s typings in some versions.
    await Promise.all(
      staleRoutes.map((route) => (res as any).revalidate(route))
    )

    const updatedRoutes = `Updated routes: ${staleRoutes.join(', ')}`
    console.log(updatedRoutes)
    return res.status(200).send(updatedRoutes)
  } catch (err: any) {
    console.error(err)
    return res.status(500).send(err?.message ?? 'Internal error')
  }
}

async function parseBody<Body = SanityDocument>(
  req: NextApiRequest,
  secret?: string,
  waitForContentLakeEventualConsistency = true,
): Promise<ParsedBody<Body>> {
  let signature = req.headers[SIGNATURE_HEADER_NAME]
  if (Array.isArray(signature)) {
    signature = signature[0]
  }
  if (!signature) {
    console.error('Missing signature header')
    return { body: null, isValidSignature: null }
  }

  if (req.readableEnded) {
    throw new Error(
      `Request already ended and the POST body can't be read. Have you setup \`export {config} from 'next-sanity/webhook' in your webhook API handler?\``,
    )
  }

  const raw = await readBody(req)
  const validSignature =
    secret ? await verifySignature(raw, signature as string, secret.trim()) : null

  if (validSignature !== false && waitForContentLakeEventualConsistency) {
    // wait for Sanity's eventual consistency window
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  return {
    body: raw.trim() ? (JSON.parse(raw) as Body) : (null as any),
    isValidSignature: validSignature,
  }
}

async function readBody(readable: NextApiRequest): Promise<string> {
  const chunks: Buffer[] = []
  for await (const chunk of readable as any) {
    // Avoid “any to never” error: ensure Buffer[]
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks).toString('utf8')
}

type StaleRoute = '/' | `/posts/${string}`

async function queryStaleRoutes(
  body: Pick<
    ParsedBody<SanityDocument>['body'],
    '_type' | '_id' | 'date' | 'slug'
  >,
): Promise<StaleRoute[]> {
  const client = createClient({ projectId, dataset, apiVersion, useCdn: false })

  // Handle possible deletions
  if ((body as any)._type === 'post') {
    const exists = await client.fetch(groq`*[_id == $id][0]`, { id: (body as any)._id })
    if (!exists) {
      const staleRoutes: StaleRoute[] = ['/']
      const maybeSlug = (body as any)?.slug?.current as string | undefined
      if (maybeSlug) {
        staleRoutes.push(`/posts/${maybeSlug}`)
      }
      // If deleted post could affect “More stories”, decide whether to revalidate everything
      const moreStories = await client.fetch(
        groq`count(
          *[_type == "post"] | order(date desc, _updatedAt desc) [0...3] [dateTime(date) > dateTime($date)]
        )`,
        { date: (body as any).date },
      )
      if (moreStories < 3) {
        return [...new Set([...(await queryAllRoutes(client)), ...staleRoutes])]
      }
      return staleRoutes
    }
  }

  switch ((body as any)._type) {
    case 'author':
      return await queryStaleAuthorRoutes(client, (body as any)._id)
    case 'post':
      return await queryStalePostRoutes(client, (body as any)._id)
    case 'settings':
      return await queryAllRoutes(client)
    default:
      throw new TypeError(`Unknown type: ${(body as any)._type}`)
  }
}

async function _queryAllRoutes(client: SanityClient): Promise<string[]> {
  return await client.fetch(groq`*[_type == "post"].slug.current`)
}

async function queryAllRoutes(client: SanityClient): Promise<StaleRoute[]> {
  const slugs = await _queryAllRoutes(client)
  return ['/', ...slugs.map((slug) => `/posts/${slug}` as StaleRoute)]
}

async function mergeWithMoreStories(
  client: SanityClient,
  slugs: string[],
): Promise<string[]> {
  const moreStories: string[] = await client.fetch(
    groq`*[_type == "post"] | order(date desc, _updatedAt desc) [0...3].slug.current`,
  )
  if (slugs.some((slug) => moreStories.includes(slug))) {
    const allSlugs = await _queryAllRoutes(client)
    return [...new Set([...slugs, ...allSlugs])]
  }
  return slugs
}

async function queryStaleAuthorRoutes(
  client: SanityClient,
  id: string,
): Promise<StaleRoute[]> {
  let slugs: string[] = await client.fetch(
    groq`*[_type == "author" && _id == $id] {
      "slug": *[_type == "post" && references(^._id)].slug.current
    }["slug"][]`,
    { id },
  )

  if (slugs.length > 0) {
    slugs = await mergeWithMoreStories(client, slugs)
    return ['/', ...slugs.map((slug) => `/posts/${slug}` as StaleRoute)]
  }

  return []
}

async function queryStalePostRoutes(
  client: SanityClient,
  id: string,
): Promise<StaleRoute[]> {
  let slugs: string[] = await client.fetch(
    groq`*[_type == "post" && _id == $id].slug.current`,
    { id },
  )
  slugs = await mergeWithMoreStories(client, slugs)
  return ['/', ...slugs.map((slug) => `/posts/${slug}` as StaleRoute)]
}
