// components/MoreStories.tsx
import PostPreview from './PostPreview'

type AnyPost = {
  title?: string
  coverImage?: string
  date?: string
  excerpt?: string
  author?: { name?: string } | string
  slug?: string
}

export default function MoreStories({ posts }: { posts?: AnyPost[] }) {
  const list: AnyPost[] = Array.isArray(posts) ? posts : []

  if (list.length === 0) return null

  return (
    <section>
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3 md:gap-x-8 md:gap-y-16">
        {list.map((post, i) => (
          <PostPreview
            key={post.slug ?? String(i)}
            title={post.title ?? ''}
            coverImage={typeof post.coverImage === 'string' ? post.coverImage : ''}
            date={typeof post.date === 'string' ? post.date : ''}
            excerpt={typeof post.excerpt === 'string' ? post.excerpt : ''}
            author={
              typeof post.author === 'string'
                ? post.author
                : (post.author?.name ?? '')
            }
            slug={post.slug ?? ''}
          />
        ))}
      </div>
    </section>
  )
}
