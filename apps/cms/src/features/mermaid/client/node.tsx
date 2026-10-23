'use client'

import { $applyNodeReplacement, type LexicalNode } from '@payloadcms/richtext-lexical/lexical'

import type { SerializedMermaidNode } from '../server/node'
import { MermaidServerNode } from '../server/node'
import { MermaidEditor } from './component'

export class MermaidNode extends MermaidServerNode {
  static clone(node: MermaidNode): MermaidNode {
    return new MermaidNode(node.__code, node.__key)
  }

  static getType(): string {
    return super.getType()
  }

  static importJSON(serializedNode: SerializedMermaidNode): MermaidNode {
    return $createMermaidNode(serializedNode.code)
  }

  exportJSON(): SerializedMermaidNode {
    return super.exportJSON()
  }

  decorate() {
    return <MermaidEditor node={this} />
  }
}

export function $createMermaidNode(code: string): MermaidNode {
  return $applyNodeReplacement(new MermaidNode(code))
}

export function $isMermaidNode(node: LexicalNode | null | undefined): node is MermaidNode {
  return node instanceof MermaidNode
}
