'use client';

import {
  createClientFeature,
  toolbarAddDropdownGroupWithItems,
} from '@payloadcms/richtext-lexical/client';

import { MarkdownImportModal, OPEN_MARKDOWN_IMPORT_COMMAND } from './modal';

const MarkdownIcon = () => (
  <svg
    fill="none"
    height="24"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect height="18" rx="2" width="20" x="2" y="3" />
    <path d="M6 15V9l3 3 3-3v6M17 9v6M17 12l-2.5 3M17 12l2.5 3" />
  </svg>
);

export const MarkdownImportFeatureClient = createClientFeature({
  plugins: [
    {
      Component: MarkdownImportModal,
      position: 'normal',
    },
  ],
  toolbarFixed: {
    groups: [
      toolbarAddDropdownGroupWithItems([
        {
          ChildComponent: MarkdownIcon,
          key: 'markdown-import',
          label: ({ i18n }) => {
            return i18n.t('lexical:markdownImport:label');
          },
          onSelect: () => {
            document.dispatchEvent(
              new CustomEvent(OPEN_MARKDOWN_IMPORT_COMMAND)
            );
          },
        },
      ]),
    ],
  },
});
