import type { ElementTransformer } from '@payloadcms/richtext-lexical/lexical/markdown'

import { $createMermaidServerNode, $isMermaidServerNode, MermaidServerNode } from './node'

// Lets ```mermaid fenced blocks round-trip through markdown import and export.
export const MermaidMarkdownTransformer: ElementTransformer = {
  type: 'element',
  dependencies: [MermaidServerNode],
  export(node) {
    if (!$isMermaidServerNode(node)) {
      return null
    }
    return `\`\`\`mermaid\n${node.getTextContent().trimEnd()}\n\`\`\``
  },
  regExp: /^```mermaid\s*\n([\s\S]*?)\n?```$/,
  replace(parentNode, _children, match) {
    const code = match?.[1] ?? ''
    const node = $createMermaidServerNode(code)
    parentNode.replace(node)
  },
}
