import { createNode, createServerFeature } from '@payloadcms/richtext-lexical';

import { CodeBlockMarkdownTransformer } from './markdownTransformer';
import { CodeBlockServerNode } from './node';

const i18n = {
  en: {
    label: 'Code block',
  },
};

export const CodeBlockFeature = createServerFeature({
  feature: {
    ClientFeature: {
      path: '@repo/payload-features/client/codeBlock',
      exportName: 'CodeBlockFeatureClient',
    },
    i18n,
    markdownTransformers: [CodeBlockMarkdownTransformer],
    nodes: [
      createNode({
        converters: {
          html: {
            converter: ({ node }) => {
              const block = node as unknown as CodeBlockServerNode;
              const escaped = block.__code
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
              const language = block.__language
                ? ` class="language-${block.__language}"`
                : '';
              return `<pre><code${language}>${escaped}</code></pre>`;
            },
            nodeTypes: [CodeBlockServerNode.getType()],
          },
        },
        node: CodeBlockServerNode,
      }),
    ],
  },
  key: 'codeBlock',
});
