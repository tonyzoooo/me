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

import {
  $createCodeBlockServerNode,
  $isCodeBlockServerNode,
  CodeBlockServerNode,
} from '../src/codeBlock/server/node';
import { markdownImportTransformers } from '../src/markdownTransformers';
import { MermaidServerNode } from '../src/mermaid/server/node';
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from '@payloadcms/richtext-lexical/lexical/markdown';

const editor = createHeadlessEditor({
  namespace: 'test',
  nodes: [
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    CodeBlockServerNode,
    MermaidServerNode,
  ],
});

function convert(markdown: string): SerializedLexicalNode[] {
  editor.update(
    () => {
      $convertFromMarkdownString(markdown, markdownImportTransformers);
    },
    { discrete: true }
  );
  return editor.getEditorState().toJSON().root.children;
}

describe('code block markdown round-trip', () => {
  it('imports fenced code with its language', () => {
    const children = convert(
      'Before\n\n```ts\nconst x: number = 1\nconst y = x + 2\n```\n\nAfter'
    );
    const block = children.find(
      (child) => child.type === 'codeblock'
    ) as unknown as { code: string; language: string };
    expect(block).toBeDefined();
    expect(block.language).toBe('ts');
    expect(block.code).toContain('const x: number = 1');

    const allText = JSON.stringify(children);
    expect(allText).not.toContain('```');
  });

  it('imports a fence without a language', () => {
    const children = convert('```\nplain snippet\n```');
    const block = children.find(
      (child) => child.type === 'codeblock'
    ) as unknown as { language: string };
    expect(block.language).toBe('');
    expect(block).toBeDefined();
  });

  it('does not swallow a mermaid fence', () => {
    // The generic code transformer also matches ```mermaid; the shared list
    // must let the mermaid transformer win.
    const children = convert('```mermaid\ngraph TD\n  A --> B\n```');
    expect(children.some((child) => child.type === 'mermaid')).toBe(true);
    expect(children.some((child) => child.type === 'codeblock')).toBe(false);
  });

  it('round-trips through export', () => {
    editor.update(
      () => {
        $convertFromMarkdownString(
          '```js\nlet a = 1\n```',
          markdownImportTransformers
        );
      },
      { discrete: true }
    );
    let exported = '';
    editor.read(() => {
      exported = $convertToMarkdownString(markdownImportTransformers);
    });
    expect(exported).toContain('```js\nlet a = 1\n```');
  });

  it('exposes the code as text content', () => {
    editor.update(
      () => {
        const node = $createCodeBlockServerNode('let a = 1', 'js');
        expect($isCodeBlockServerNode(node)).toBe(true);
        expect(node.getTextContent()).toBe('let a = 1\n');
        expect(node.isInline()).toBe(false);
        expect(node.exportJSON()).toMatchObject({
          code: 'let a = 1',
          language: 'js',
          type: 'codeblock',
        });
      },
      { discrete: true }
    );
  });
});
