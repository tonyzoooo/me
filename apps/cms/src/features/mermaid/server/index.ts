import path from 'path'
import { fileURLToPath } from 'url'

import { createNode, createServerFeature } from '@payloadcms/richtext-lexical'

import { MermaidMarkdownTransformer } from './markdownTransformer'
import { MermaidServerNode } from './node'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const i18n = {
  en: {
    label: 'Mermaid diagram',
  },
}

export const MermaidFeature = createServerFeature({
  feature: {
    ClientFeature: {
      path: path.resolve(dirname, '../client/index.tsx'),
      exportName: 'MermaidFeatureClient',
    },
    i18n,
    markdownTransformers: [MermaidMarkdownTransformer],
    nodes: [
      createNode({
        converters: {
          html: {
            converter: ({ node }) => {
              const code = (node as unknown as MermaidServerNode).__code
              const escaped = code
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
              return `<pre class="mermaid">${escaped}</pre>`
            },
            nodeTypes: [MermaidServerNode.getType()],
          },
        },
        node: MermaidServerNode,
      }),
    ],
  },
  key: 'mermaid',
})
