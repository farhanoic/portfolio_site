import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

import { schema } from './sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'Farhanoic Portfolio Services',

  projectId: '0w8c4md0',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema,
})