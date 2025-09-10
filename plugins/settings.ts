// plugins/settings.ts
// Fix: ensure `title` and `icon` are always safe types for TS strictNullChecks.

import S from '@sanity/desk-tool/structure-builder'

export default function settingsStructure() {
  return S.list()
    .title('Settings')
    .items([
      // Example: if you have a `settings` schema type
      S.listItem()
        .title('Site Settings')
        .icon(() => '⚙️')
        .child(
          S.editor()
            .id('site-settings')
            .schemaType('settings')
            .documentId('settings')
        ),
    ])
}

// Utility: safe builder for a singleton list item
export function singletonListItem(typeDef: { name: string; title?: string; icon?: any }) {
  return S.listItem()
    .title(typeDef.title ?? typeDef.name) // fallback so never undefined
    .icon(typeDef.icon ?? (() => '⚙️')) // fallback icon if missing
    .child(
      S.editor()
        .id(typeDef.name)
        .schemaType(typeDef.name)
        .documentId(typeDef.name)
    )
}
