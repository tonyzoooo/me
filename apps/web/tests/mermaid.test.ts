import { describe, expect, it } from 'vitest';
import { containsMermaid, lexicalToHtml } from '@utils';
import type { LexicalContent, LexicalNode } from '@utils/cms';

const mermaidNode: LexicalNode = {
  type: 'mermaid',
  code: 'graph TD\n  A --> B',
  version: 1,
};

const contentWithMermaid: LexicalContent = {
  root: {
    type: 'root',
    children: [
      { type: 'paragraph', children: [{ text: 'Intro' }] },
      mermaidNode,
    ],
  },
};

describe('mermaid rendering', () => {
  it('renders a mermaid node as a pre.mermaid block with escaped code', () => {
    expect(lexicalToHtml(mermaidNode)).toBe(
      `<pre class="mermaid">graph TD\n  A --&gt; B</pre>`
    );
  });

  it('detects mermaid nodes nested in content', () => {
    expect(containsMermaid(contentWithMermaid)).toBe(true);
  });

  it('does not flag content without mermaid nodes', () => {
    expect(
      containsMermaid({
        root: { type: 'root', children: [{ type: 'paragraph', children: [] }] },
      })
    ).toBe(false);
    expect(containsMermaid(null)).toBe(false);
  });
});
