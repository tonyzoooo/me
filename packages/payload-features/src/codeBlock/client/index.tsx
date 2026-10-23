'use client';

import {
  createClientFeature,
  slashMenuBasicGroupWithItems,
  toolbarAddDropdownGroupWithItems,
} from '@payloadcms/richtext-lexical/client';

import { INSERT_CODE_BLOCK_COMMAND } from '../server/node';
import { CodeBlockNode } from './node';
import { CodeBlockPlugin } from './plugin';

const CodeBlockIcon = () => (
  <svg
    fill="none"
    height="24"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 6 3 12l5 6M16 6l5 6-5 6" />
  </svg>
);

export const CodeBlockFeatureClient = createClientFeature({
  nodes: [CodeBlockNode],
  plugins: [
    {
      Component: CodeBlockPlugin,
      position: 'normal',
    },
  ],
  slashMenu: {
    groups: [
      slashMenuBasicGroupWithItems([
        {
          Icon: CodeBlockIcon,
          key: 'codeblock',
          keywords: ['code', 'snippet', 'codeblock'],
          label: ({ i18n }) => {
            return i18n.t('lexical:codeBlock:label');
          },
          onSelect: ({ editor }) => {
            editor.dispatchCommand(INSERT_CODE_BLOCK_COMMAND, undefined);
          },
        },
      ]),
    ],
  },
  toolbarFixed: {
    groups: [
      toolbarAddDropdownGroupWithItems([
        {
          ChildComponent: CodeBlockIcon,
          key: 'codeblock',
          label: ({ i18n }) => {
            return i18n.t('lexical:codeBlock:label');
          },
          onSelect: ({ editor }) => {
            editor.dispatchCommand(INSERT_CODE_BLOCK_COMMAND, undefined);
          },
        },
      ]),
    ],
  },
});
