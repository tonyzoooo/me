import type { MultilineElementTransformer } from '@payloadcms/richtext-lexical/lexical/markdown';

import {
  $createMermaidServerNode,
  $isMermaidServerNode,
  MermaidServerNode,
} from './node';

// Lets ```mermaid fenced blocks round-trip through markdown import and
// export. A multiline-element transformer is required: the import parser
// matches regExpStart line-by-line and scans forward to regExpEnd, so
// fences containing blank lines are handled correctly.
export const MermaidMarkdownTransformer: MultilineElementTransformer = {
  dependencies: [MermaidServerNode],
  export: (node, _traverseChildren) => {
    if (!$isMermaidServerNode(node)) {
      return null;
    }
    return `\`\`\`mermaid\n${node.getTextContent().trimEnd()}\n\`\`\``;
  },
  regExpEnd: /^[ \t]*```$/,
  regExpStart: /^```mermaid\s*$/,
  replace: (rootNode, _children, _startMatch, _endMatch, linesInBetween) => {
    // The importer passes the remainder of the start line as the first entry;
    // for a standalone ```mermaid fence it is empty whitespace.
    const lines = linesInBetween ?? [];
    const content =
      lines.length && lines[0].trim() === '' ? lines.slice(1) : lines;
    const node = $createMermaidServerNode(content.join('\n'));
    rootNode.append(node);
  },
  type: 'multiline-element',
};
