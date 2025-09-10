// pages/Sitemap.xml.tsx
import { GetServerSideProps } from 'next'

type Post = {
  slug?: string
  _updatedAt?: string
}

function generateSiteMap(posts: Post[]) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://solovoro.ca'

  const urls = posts
    .filter((post) => !!post.slug)
    .map((post) => ({
      url: `${baseUrl}/posts/${post.slug}`,
      priority: 0.5,
      lastmod: post._updatedAt ? new Date(post._updatedAt).toISOString() : undefined,
    }))

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${urls
       .map(
         (entry) => `<url>
        <loc>${entry.url}</loc>
        <priority>${entry.priority}</priority>
        ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
      </url>`
       )
       .join('')}
   </urlset>`
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Replace this with actual posts query later
  const posts: Post[] = []

  const sitemap = generateSiteMap(posts)

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return { props: {} }
}

export default function Sitemap() {
  return null
}
