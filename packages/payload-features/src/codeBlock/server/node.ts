import {
  $applyNodeReplacement,
  createCommand,
  DecoratorNode,
  type LexicalNode,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
} from '@payloadcms/richtext-lexical/lexical';
import type { ReactNode } from 'react';

export type SerializedCodeBlockNode = Spread<
  {
    code: string;
    language: string;
  },
  SerializedLexicalNode
>;

export const INSERT_CODE_BLOCK_COMMAND = createCommand<
  { code: string; language: string } | undefined
>('INSERT_CODE_BLOCK_COMMAND');

// A fenced code snippet stored with its language, rendered as a plain
// pre/code pair on the site.
export class CodeBlockServerNode extends DecoratorNode<ReactNode> {
  __code: string;
  __language: string;

  static getType(): string {
    return 'codeblock';
  }

  static clone(node: CodeBlockServerNode): CodeBlockServerNode {
    return new CodeBlockServerNode(node.__code, node.__language, node.__key);
  }

  static importJSON(
    serializedNode: SerializedCodeBlockNode
  ): CodeBlockServerNode {
    return $createCodeBlockServerNode(
      serializedNode.code,
      serializedNode.language
    );
  }

  constructor(code: string, language: string, key?: NodeKey) {
    super(key);
    this.__code = code;
    this.__language = language;
  }

  exportJSON(): SerializedCodeBlockNode {
    return {
      code: this.__code,
      language: this.__language,
      type: 'codeblock',
      version: 1,
    };
  }

  setCode(code: string): void {
    this.getWritable().__code = code;
  }

  setLanguage(language: string): void {
    this.getWritable().__language = language;
  }

  createDOM(): HTMLElement {
    return document.createElement('div');
  }

  decorate(): ReactNode {
    return null;
  }

  getTextContent(): string {
    return this.__code + '\n';
  }

  isInline(): boolean {
    return false;
  }

  updateDOM(): false {
    return false;
  }
}

export function $createCodeBlockServerNode(
  code: string,
  language: string
): CodeBlockServerNode {
  return $applyNodeReplacement(new CodeBlockServerNode(code, language));
}

export function $isCodeBlockServerNode(
  node: LexicalNode | null | undefined
): node is CodeBlockServerNode {
  return node instanceof CodeBlockServerNode;
}
