// components/PostHeader.tsx
import CoverImage from './CoverImage'

type Props = {
  title?: string
  coverImage?: string
  slug?: string
  date?: string
  author?: string
}

export default function PostHeader({
  title,
  coverImage,
  slug,
  date,
  author,
}: Props) {
  return (
    <section>
      <div className="mb-8 sm:mx-0 md:mb-16">
        <CoverImage
          title={title ?? ''}
          image={coverImage ?? ''}
          priority
          slug={slug ?? ''}
        />
      </div>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 block md:hidden">
          <h1 className="text-4xl font-bold leading-tight">
            {title ?? ''}
          </h1>
        </div>
        <div className="text-sm text-gray-500">
          {date ?? ''}{author ? ` • ${author}` : ''}
        </div>
      </div>
    </section>
  )
}
