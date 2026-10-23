import { describe, expect, it } from 'vitest';
import { extractHeadings, injectHeadingIds, lexicalToHtml } from '@utils';

const content = {
  root: {
    type: 'root',
    direction: 'ltr',
    children: [
      { type: 'paragraph', children: [{ type: 'text', text: 'Intro' }] },
      {
        type: 'heading',
        tag: 'h2',
        children: [{ type: 'text', text: 'The Papery Constitution' }],
      },
      { type: 'paragraph', children: [{ type: 'text', text: 'Body' }] },
      {
        type: 'heading',
        tag: 'h3',
        children: [{ type: 'text', text: 'A Republic of Layers' }],
      },
      {
        type: 'heading',
        tag: 'h2',
        children: [{ type: 'text', text: 'The Papery Constitution' }],
      },
    ],
  },
};

describe('extractHeadings', () => {
  it('collects headings with levels and slug ids', () => {
    const headings = extractHeadings(content);
    expect(headings).toEqual([
      {
        id: 'the-papery-constitution',
        text: 'The Papery Constitution',
        level: 2,
      },
      { id: 'a-republic-of-layers', text: 'A Republic of Layers', level: 3 },
      {
        id: 'the-papery-constitution-2',
        text: 'The Papery Constitution',
        level: 2,
      },
    ]);
  });

  it('returns empty for content without headings', () => {
    expect(extractHeadings({ root: { children: [] } })).toEqual([]);
  });
});

describe('injectHeadingIds', () => {
  it('adds ids matching the extracted headings', () => {
    const headings = extractHeadings(content);
    const html = injectHeadingIds(lexicalToHtml(content), headings);
    expect(html).toContain('<h2 id="the-papery-constitution">');
    expect(html).toContain('<h3 id="a-republic-of-layers">');
    expect(html).toContain('<h2 id="the-papery-constitution-2">');
  });
});
