import { createServerFeature } from '@payloadcms/richtext-lexical';

const i18n = {
  en: {
    label: 'Import markdown',
  },
};

// Adds an "Import markdown" toolbar action that parses a markdown document
// into the editor. Typing markdown shortcuts works out of the box.
export const MarkdownImportFeature = createServerFeature({
  feature: {
    ClientFeature: {
      path: '@repo/payload-features/client/markdownImport',
      exportName: 'MarkdownImportFeatureClient',
    },
    i18n,
  },
  key: 'markdownImport',
});
