import { describe, expect, it } from 'vitest';
import { lexicalToHtml } from '@utils';
import type { LexicalNode } from '@utils/cms';

const codeBlockNode: LexicalNode = {
  type: 'codeblock',
  code: 'const x = "<danger>";',
  language: 'ts',
  version: 1,
};

describe('code block rendering', () => {
  it('renders a fenced snippet as pre/code with a language class', () => {
    expect(lexicalToHtml(codeBlockNode)).toBe(
      `<pre><code class="language-ts">const x = &quot;&lt;danger&gt;&quot;;</code></pre>`
    );
  });

  it('omits the language class when none is set', () => {
    expect(lexicalToHtml({ ...codeBlockNode, language: '' })).toBe(
      `<pre><code>const x = &quot;&lt;danger&gt;&quot;;</code></pre>`
    );
  });
});
