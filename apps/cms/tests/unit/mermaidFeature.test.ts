import { createHeadlessEditor } from '@payloadcms/richtext-lexical/lexical/headless'
import { describe, expect, it } from 'vitest'

import { MermaidMarkdownTransformer } from '@/features/mermaid/server/markdownTransformer'
import {
  $createMermaidServerNode,
  $isMermaidServerNode,
  MermaidServerNode,
} from '@/features/mermaid/server/node'

const mermaidFence = '```mermaid\ngraph TD\n  A --> B\n```'

// Lexical nodes need an active editor to be constructed.
const editor = createHeadlessEditor({
  namespace: 'test',
  nodes: [MermaidServerNode],
})

function createNode(code: string): MermaidServerNode {
  let node: MermaidServerNode | undefined
  editor.update(
    () => {
      node = $createMermaidServerNode(code)
    },
    { discrete: true },
  )
  return node as MermaidServerNode
}

describe('MermaidServerNode', () => {
  it('round-trips through its serialized JSON form', () => {
    const node = createNode('graph TD\n  A --> B')
    expect(MermaidServerNode.getType()).toBe('mermaid')
    let restored: MermaidServerNode | undefined
    editor.update(
      () => {
        restored = MermaidServerNode.importJSON(node.exportJSON())
      },
      { discrete: true },
    )
    expect($isMermaidServerNode(restored)).toBe(true)
    expect(restored?.exportJSON()).toEqual(node.exportJSON())
  })

  it('exposes the diagram code as text content', () => {
    const node = createNode('graph TD')
    expect(node.getTextContent()).toBe('graph TD\n')
    expect(node.isInline()).toBe(false)
  })
})

describe('MermaidMarkdownTransformer', () => {
  it('matches mermaid fenced code blocks', () => {
    expect(MermaidMarkdownTransformer.regExp?.test(mermaidFence)).toBe(true)
    expect(MermaidMarkdownTransformer.regExp?.test('```js\nlet a\n```')).toBe(false)
  })

  it('exports the node back to a mermaid fence', () => {
    const node = createNode('graph TD\n  A --> B')
    expect(MermaidMarkdownTransformer.export?.(node, () => '')).toBe(mermaidFence)
  })

  it('replaces a parsed fence with a mermaid node', () => {
    const match = mermaidFence.match(MermaidMarkdownTransformer.regExp ?? '')
    const replaced: { node?: MermaidServerNode } = {}
    const parentNode = {
      replace: (node: MermaidServerNode) => {
        replaced.node = node
      },
    }
    editor.update(
      () => {
        MermaidMarkdownTransformer.replace?.(parentNode as never, [], match ?? [], true)
      },
      { discrete: true },
    )
    expect(replaced.node?.exportJSON()).toMatchObject({
      code: 'graph TD\n  A --> B',
      type: 'mermaid',
    })
  })
})
