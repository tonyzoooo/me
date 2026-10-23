'use client'

import {
  createClientFeature,
  slashMenuBasicGroupWithItems,
  toolbarAddDropdownGroupWithItems,
} from '@payloadcms/richtext-lexical/client'

import { INSERT_MERMAID_COMMAND } from '../server/node'
import { MermaidNode } from './node'
import { MermaidPlugin } from './plugin'

const MermaidIcon = () => (
  <svg
    fill="none"
    height="24"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="5" cy="5" r="2.5" />
    <circle cx="19" cy="12" r="2.5" />
    <circle cx="5" cy="19" r="2.5" />
    <path d="M7.5 5H14a2 2 0 0 1 2 2v2.5M16.5 14v2.5A2 2 0 0 1 14.5 18.5H7.5" />
  </svg>
)

export const MermaidFeatureClient = createClientFeature({
  nodes: [MermaidNode],
  plugins: [
    {
      Component: MermaidPlugin,
      position: 'normal',
    },
  ],
  slashMenu: {
    groups: [
      slashMenuBasicGroupWithItems([
        {
          Icon: MermaidIcon,
          key: 'mermaid',
          keywords: ['diagram', 'mermaid', 'chart', 'graph'],
          label: ({ i18n }) => {
            return i18n.t('lexical:mermaid:label')
          },
          onSelect: ({ editor }) => {
            editor.dispatchCommand(INSERT_MERMAID_COMMAND, '')
          },
        },
      ]),
    ],
  },
  toolbarFixed: {
    groups: [
      toolbarAddDropdownGroupWithItems([
        {
          ChildComponent: MermaidIcon,
          key: 'mermaid',
          label: ({ i18n }) => {
            return i18n.t('lexical:mermaid:label')
          },
          onSelect: ({ editor }) => {
            editor.dispatchCommand(INSERT_MERMAID_COMMAND, '')
          },
        },
      ]),
    ],
  },
})
