import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { schemaTypes } from './schemas/index'  // explicit index to satisfy resolver

export default defineConfig({
  name: 'default',
  title: 'Solovoro Studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [deskTool()],
  schema: { types: schemaTypes },
})
