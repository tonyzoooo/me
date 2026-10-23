import {
  $applyNodeReplacement,
  createCommand,
  DecoratorNode,
  type LexicalNode,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
} from '@payloadcms/richtext-lexical/lexical'
import type { ReactNode } from 'react'

export type SerializedMermaidNode = Spread<
  {
    code: string
  },
  SerializedLexicalNode
>

export const INSERT_MERMAID_COMMAND = createCommand<string | undefined>('INSERT_MERMAID_COMMAND')

// A mermaid diagram stored as a code block with a live preview in the admin.
export class MermaidServerNode extends DecoratorNode<ReactNode> {
  __code: string

  static getType(): string {
    return 'mermaid'
  }

  static clone(node: MermaidServerNode): MermaidServerNode {
    return new MermaidServerNode(node.__code, node.__key)
  }

  static importJSON(serializedNode: SerializedMermaidNode): MermaidServerNode {
    return $createMermaidServerNode(serializedNode.code)
  }

  constructor(code: string, key?: NodeKey) {
    super(key)
    this.__code = code
  }

  exportJSON(): SerializedMermaidNode {
    return {
      code: this.__code,
      type: 'mermaid',
      version: 1,
    }
  }

  setCode(code: string): void {
    this.getWritable().__code = code
  }

  createDOM(): HTMLElement {
    return document.createElement('div')
  }

  decorate(): ReactNode {
    return null
  }

  getTextContent(): string {
    return this.__code + '\n'
  }

  isInline(): boolean {
    return false
  }

  updateDOM(): false {
    return false
  }
}

export function $createMermaidServerNode(code: string): MermaidServerNode {
  return $applyNodeReplacement(new MermaidServerNode(code))
}

export function $isMermaidServerNode(
  node: LexicalNode | null | undefined,
): node is MermaidServerNode {
  return node instanceof MermaidServerNode
}
