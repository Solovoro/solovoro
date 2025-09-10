// components/PreviewIndexPage.tsx
// Preview disabled: pass-through to IndexPage (removes @sanity/preview-kit)
import IndexPage, { type IndexPageProps } from 'components/IndexPage'

export default function PreviewIndexPage(props: IndexPageProps) {
  return <IndexPage {...props} />
}

