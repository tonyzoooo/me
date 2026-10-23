'use client';

import {
  $applyNodeReplacement,
  type LexicalNode,
} from '@payloadcms/richtext-lexical/lexical';

import type { SerializedCodeBlockNode } from '../server/node';
import { CodeBlockServerNode } from '../server/node';
import { CodeBlockEditor } from './component';

export class CodeBlockNode extends CodeBlockServerNode {
  static clone(node: CodeBlockNode): CodeBlockNode {
    return new CodeBlockNode(node.__code, node.__language, node.__key);
  }

  static getType(): string {
    return super.getType();
  }

  static importJSON(serializedNode: SerializedCodeBlockNode): CodeBlockNode {
    return $createCodeBlockNode(serializedNode.code, serializedNode.language);
  }

  exportJSON(): SerializedCodeBlockNode {
    return super.exportJSON();
  }

  decorate() {
    return <CodeBlockEditor node={this} />;
  }
}

export function $createCodeBlockNode(
  code: string,
  language: string
): CodeBlockNode {
  return $applyNodeReplacement(new CodeBlockNode(code, language));
}

export function $isCodeBlockNode(
  node: LexicalNode | null | undefined
): node is CodeBlockNode {
  return node instanceof CodeBlockNode;
}
