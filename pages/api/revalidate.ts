// pages/api/revalidate.ts
/**
 * Sanity webhook that revalidates pages when content changes.
 * This version removes fragile generics (that resolved to `never` under strictNullChecks)
 * and adds safe guards while keeping the same behavior.
 */

import { SIGNATURE_HEADER_NAME, isValidSignature as verifySignature } from '@sanity/webhook'
import { apiVersion, dataset, projectId } from 'lib/sanity.api'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient, groq, type SanityClient } from 'next-sanity'

// ---- Next config ----
export const config = {
  api: {
    bodyParser: false, // required to validate the webhook signature
  },
}

// ---- Types we actually need ----
type StaleRoute = '/' | `/posts/${string}`

type WebhookBody = {
  _type?: string
  _id?: string
  date?: string
  slug?: { current?: string }
}

// ---- Handler ----
export default async function revalidate(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { body, isValidSignature } = await parseBody(req, process.env.SANITY_REVALIDATE_SECRET)

    if (!isValidSignature) {
      console.log('Invalid signature')
      return res.status(401).send('Invalid signature')
    }

    if (!body || typeof body._id !== 'string' || !body._id) {
      console.error('Invalid _id', { body })
      return res.status(400).send('Invalid _id')
    }

    const staleRoutes = await queryStaleRoutes(body)

    // `revalidate` exists at runtime, but is not on the NextApiResponse type in some versions.
    await Promise.all(staleRoutes.map((route) => (res as any).revalidate(route)))

    const msg = `Updated routes: ${staleRoutes.join(', ')}`
    console.log(msg)
    return res.status(200).send(msg)
  } catch (err: any) {
    console.error(err)
    return res.status(500).send(err?.message ?? 'Internal error')
  }
}

// ---- Helpers ----
async function parseBody(
  req: NextApiRequest,
  secret?: string,
  waitForContentLakeEventualConsistency = true,
): Promise<{ body: WebhookBody | null; isValidSignature: boolean | null }> {
  let signature = req.headers[SIGNATURE_HEADER_NAME]
  if (Array.isArray(signature)) signature = signature[0]

  if (!signature) {
    console.error('Missing signature header')
    return { body: null, isValidSignature: null }
  }

  if (req.readableEnded) {
    throw new Error(
      "Request already ended and the POST body can't be read. Ensure `export {config} from 'next-sanity/webhook'` or equivalent bodyParser:false.",
    )
  }

  const raw = await readBody(req)
  const validSignature = secret ? await verifySignature(raw, signature as string, secret.trim()) : null

  if (validSignature !== false && waitForContentLakeEventualConsistency) {
    // small delay for eventual consistency
    await new Promise((r) => setTimeout(r, 1000))
  }

  return {
    body: raw.trim() ? (JSON.parse(raw) as WebhookBody) : null,
    isValidSignature: validSignature,
  }
}

async function readBody(readable: NextApiRequest): Promise<string> {
  const chunks: Buffer[] = []
  for await (const chunk of readable as any) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks).toString('utf8')
}

async function queryStaleRoutes(body: WebhookBody): Promise<StaleRoute[]> {
  const client = createClient({ projectId, dataset, apiVersion, useCdn: false })

  // Handle possible deletions
  if (body._type === 'post') {
    const exists = await client.fetch(groq`*[_id == $id][0]`, { id: body._id })
    if (!exists) {
      const stale: StaleRoute[] = ['/']
      const maybeSlug = body.slug?.current
      if (maybeSlug) stale.push(`/posts/${maybeSlug}`)

      // If the deleted post could affect “More stories”, decide whether to revalidate everything
      const moreStories: number = await client.fetch(
        groq`count(
          *[_type == "post"] | order(date desc, _updatedAt desc) [0...3] [dateTime(date) > dateTime($date)]
        )`,
        { date: body.date ?? '' },
      )
      if (moreStories < 3) {
        return [...new Set([...(await queryAllRoutes(client)), ...stale])]
      }
      return stale
    }
  }

  switch (body._type) {
    case 'author':
      return await queryStaleAuthorRoutes(client, body._id!)
    case 'post':
      return await queryStalePostRoutes(client, body._id!)
    case 'settings':
      return await queryAllRoutes(client)
    default:
      throw new TypeError(`Unknown type: ${String(body._type)}`)
  }
}

async function _queryAllRoutes(client: SanityClient): Promise<string[]> {
  return await client.fetch(groq`*[_type == "post"].slug.current`)
}

async function queryAllRoutes(client: SanityClient): Promise<StaleRoute[]> {
  const slugs = await _queryAllRoutes(client)
  return ['/', ...slugs.map((s) => `/posts/${s}` as StaleRoute)]
}

async function mergeWithMoreStories(client: SanityClient, slugs: string[]): Promise<string[]> {
  const moreStories: string[] = await client.fetch(
    groq`*[_type == "post"] | order(date desc, _updatedAt desc) [0...3].slug.current`,
  )
  if (slugs.some((s) => moreStories.includes(s))) {
    const allSlugs = await _queryAllRoutes(client)
    return [...new Set([...slugs, ...allSlugs])]
  }
  return slugs
}

async function queryStaleAuthorRoutes(client: SanityClient, id: string): Promise<StaleRoute[]> {
  let slugs: string[] = await client.fetch(
    groq`*[_type == "author" && _id == $id] {
      "slug": *[_type == "post" && references(^._id)].slug.current
    }["slug"][]`,
    { id },
  )

  if (slugs.length > 0) {
    slugs = await mergeWithMoreStories(client, slugs)
    return ['/', ...slugs.map((s) => `/posts/${s}` as StaleRoute)]
  }
  return []
}

async function queryStalePostRoutes(client: SanityClient, id: string): Promise<StaleRoute[]> {
  let slugs: string[] = await client.fetch(groq`*[_type == "post" && _id == $id].slug.current`, { id })
  slugs = await mergeWithMoreStories(client, slugs)
  return ['/', ...slugs.map((s) => `/posts/${s}` as StaleRoute)]
}

