// plugins/settings.ts
// Sanity v3 structure: S is passed in, do NOT import S.

import type {StructureBuilder} from 'sanity/structure'

export default function settingsStructure(S: StructureBuilder) {
  const settingsItem = S.listItem()
    .title('Site Settings')
    .child(
      S.editor()
        .id('settings')
        .schemaType('settings')
        .documentId('settings')
    )

  return S.list()
    .title('Content')
    .items([
      settingsItem,
      S.divider(),
      S.documentTypeListItem('post'),
      S.documentTypeListItem('author'),
    ])
}
