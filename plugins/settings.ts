// plugins/settings.ts
// Sanity v3+ structure: no undefined titles/icons; strictNullChecks-safe.

import S from 'sanity/structure'

const settingsItem = S.listItem()
  .title('Site Settings')
  .child(
    S.editor()
      .id('settings')
      .schemaType('settings')
      .documentId('settings')
  )

export default function settingsStructure() {
  return S.list()
    .title('Content')
    .items([
      settingsItem,
      S.divider(),
      // Auto-generated lists for common types (adjust if you use different names)
      S.documentTypeListItem('post'),
      S.documentTypeListItem('author'),
    ])
}
