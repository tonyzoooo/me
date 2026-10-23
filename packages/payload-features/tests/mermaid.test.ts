import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from '@payloadcms/richtext-lexical/lexical/markdown';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { createHeadlessEditor } from '@payloadcms/richtext-lexical/lexical/headless';
import {
  ListNode,
  ListItemNode,
} from '@payloadcms/richtext-lexical/lexical/list';
import {
  HeadingNode,
  QuoteNode,
} from '@payloadcms/richtext-lexical/lexical/rich-text';
import type { SerializedLexicalNode } from '@payloadcms/richtext-lexical/lexical';
import { describe, expect, it } from 'vitest';

import { CodeBlockServerNode } from '../src/codeBlock/server/node';
import { markdownImportTransformers } from '../src/markdownTransformers';
import {
  $createMermaidServerNode,
  $isMermaidServerNode,
  MermaidServerNode,
} from '../src/mermaid/server/node';

const transformers = markdownImportTransformers;

// The document from the production test post: blank lines inside the fence
// are what broke the original element-based transformer.
const testMarkdown = readFileSync(
  resolve(process.cwd(), 'tests/fixtures/production-post.md'),
  'utf8'
);

const editor = createHeadlessEditor({
  namespace: 'test',
  nodes: [
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    MermaidServerNode,
    CodeBlockServerNode,
  ],
});

function convert(markdown: string): SerializedLexicalNode[] {
  editor.update(
    () => {
      $convertFromMarkdownString(markdown, transformers);
    },
    { discrete: true }
  );
  return editor.getEditorState().toJSON().root.children;
}

function createNode(code: string): MermaidServerNode {
  let node: MermaidServerNode | undefined;
  editor.update(
    () => {
      node = $createMermaidServerNode(code);
    },
    { discrete: true }
  );
  return node as MermaidServerNode;
}

describe('MermaidServerNode', () => {
  it('round-trips through its serialized JSON form', () => {
    const node = createNode('graph TD\n  A --> B');
    expect(MermaidServerNode.getType()).toBe('mermaid');
    let restored: MermaidServerNode | undefined;
    editor.update(
      () => {
        restored = MermaidServerNode.importJSON(node.exportJSON());
      },
      { discrete: true }
    );
    expect($isMermaidServerNode(restored)).toBe(true);
    expect(restored?.exportJSON()).toEqual(node.exportJSON());
  });

  it('exposes the diagram code as text content', () => {
    const node = createNode('graph TD');
    expect(node.getTextContent()).toBe('graph TD\n');
    expect(node.isInline()).toBe(false);
  });
});

describe('mermaid markdown round-trip', () => {
  it('imports headings, paragraphs and the mermaid fence, including blank lines inside it', () => {
    const children = convert(testMarkdown);

    const types = children.map((child) => child.type);
    expect(types).toContain('heading');
    expect(types).toContain('mermaid');

    const mermaid = children.find(
      (child) => child.type === 'mermaid'
    ) as unknown as {
      code: string;
    };
    expect(mermaid.code).toContain('sequenceDiagram');
    expect(mermaid.code).toContain('Alice->>Bob: Hi');
    expect(mermaid.code).toContain('Bob-->>Alice: Hello');

    // Nothing may leak through as literal fence markers or headings
    const allText = JSON.stringify(children);
    expect(allText).not.toContain('```');
    expect(allText).not.toContain('# Heading');
  });

  it('applies inline text formatting during import', () => {
    const children = convert('Some **bold** text.');
    const bold = children.flatMap(
      (p) => (p as { children?: SerializedLexicalNode[] }).children ?? []
    );
    expect(JSON.stringify(bold)).toContain('"format":1');
  });

  it('exports a mermaid node back to a mermaid fence', () => {
    editor.update(
      () => {
        $convertFromMarkdownString(
          '```mermaid\ngraph TD\n  A --> B\n```',
          transformers
        );
      },
      { discrete: true }
    );
    let exported = '';
    editor.read(() => {
      exported = $convertToMarkdownString(transformers);
    });
    expect(exported).toContain('```mermaid\ngraph TD\n  A --> B\n```');
  });
});
