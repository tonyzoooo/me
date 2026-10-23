import type { MultilineElementTransformer } from '@payloadcms/richtext-lexical/lexical/markdown';

import {
  $createCodeBlockServerNode,
  $isCodeBlockServerNode,
  CodeBlockServerNode,
} from './node';

// Converts fenced code blocks (```lang ... ```) into code block nodes. A
// multiline-element transformer is required: the import parser matches
// regExpStart line-by-line and scans forward to regExpEnd. Mermaid fences
// are handled by their own transformer, which must run first.
export const CodeBlockMarkdownTransformer: MultilineElementTransformer = {
  dependencies: [CodeBlockServerNode],
  export: (node, _traverseChildren) => {
    if (!$isCodeBlockServerNode(node)) {
      return null;
    }
    const language = node.__language;
    const fence = language ? '```' + language : '```';
    return `${fence}\n${node.getTextContent().trimEnd()}\n\`\`\``;
  },
  regExpEnd: /^[ \t]*```$/,
  regExpStart: /^```(\w+)?\s*$/,
  replace: (rootNode, _children, startMatch, _endMatch, linesInBetween) => {
    const lines = linesInBetween ?? [];
    const content =
      lines.length && lines[0].trim() === '' ? lines.slice(1) : lines;
    const node = $createCodeBlockServerNode(
      content.join('\n'),
      startMatch[1] ?? ''
    );
    rootNode.append(node);
  },
  type: 'multiline-element',
};
