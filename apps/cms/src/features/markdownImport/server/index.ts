import path from 'path'
import { fileURLToPath } from 'url'

import { createServerFeature } from '@payloadcms/richtext-lexical'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const i18n = {
  en: {
    label: 'Import markdown',
  },
}

// Adds an "Import markdown" toolbar action that parses a markdown document
// into the editor. Typing markdown shortcuts works out of the box.
export const MarkdownImportFeature = createServerFeature({
  feature: {
    ClientFeature: {
      path: path.resolve(dirname, '../client/index.tsx'),
      exportName: 'MarkdownImportFeatureClient',
    },
    i18n,
  },
  key: 'markdownImport',
})
