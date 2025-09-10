// components/PostPreview.tsx
import CoverImage from './CoverImage'

type Props = {
  title?: string
  coverImage?: string
  date?: string
  excerpt?: string
  author?: string
  slug?: string
}

export default function PostPreview({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Props) {
  return (
    <div className="group">
      <div className="mb-5">
        <CoverImage
          slug={slug ?? ''}
          title={title ?? ''}
          image={coverImage ?? ''}
          priority={false}
        />
      </div>
      <h3 className="mb-3 text-2xl leading-snug">{title ?? ''}</h3>
      <div className="mb-4 text-sm text-gray-500">
        {date ?? ''}{author ? ` • ${author}` : ''}
      </div>
      {excerpt ? <p className="text-lg leading-relaxed">{excerpt}</p> : null}
    </div>
  )
}

