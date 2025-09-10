// components/PostPage.tsx
import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import PostHeader from 'components/PostHeader'
import PostBody from 'components/PostBody'
import PostTitle from 'components/PostTitle'
import PostPageHead from 'components/PostPageHead'
import * as demo from 'lib/demo.data'

type AnyPost = {
  title?: string
  coverImage?: string
  slug?: string
  date?: string
  author?: { name?: string; picture?: string } | string
  content?: any
}

type AnySettings = {
  title?: string
  description?: string
}

export interface PostPageProps {
  preview?: boolean
  loading?: boolean
  post?: AnyPost
  settings?: AnySettings
}

export default function PostPage(props: PostPageProps) {
  const { preview, loading, post, settings } = props
  const siteTitle = settings?.title ?? demo.title
  const siteDesc = settings?.description ?? demo.description
  const title = post?.title ?? ''

  return (
    <>
      <PostPageHead settings={settings as any} post={post as any} />

      <Layout preview={!!preview} loading={!!loading}>
        <Container>
          <BlogHeader title={siteTitle} description={siteDesc} level={2} />

          {preview && !post ? (
            <div className="py-12 text-gray-500">Loading…</div>
          ) : (
            <>
              <PostTitle>{title}</PostTitle>

              <div className="mb-8 sm:mx-0 md:mb-16">
                <PostHeader
                  title={title}
                  coverImage={typeof post?.coverImage === 'string' ? post?.coverImage : undefined}
                  slug={typeof post?.slug === 'string' ? post?.slug : undefined}
                  date={typeof post?.date === 'string' ? post?.date : undefined}
                  author={
                    typeof post?.author === 'string'
                      ? post?.author
                      : (post?.author as { name?: string })?.name
                  }
                />
              </div>

              <PostBody content={(post?.content as any) ?? ''} />
            </>
          )}
        </Container>
      </Layout>
    </>
  )
}

