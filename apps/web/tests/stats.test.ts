import { describe, expect, it } from 'vitest';
import { computeStats, lexicalToText, authorName } from '@utils';

const lexical = {
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'Hello onion world' }],
      },
      {
        type: 'heading',
        children: [{ type: 'text', text: 'Second line here' }],
      },
    ],
  },
};

describe('lexicalToText', () => {
  it('collects text from nested nodes', () => {
    const text = lexicalToText(lexical);
    expect(text).toContain('Hello onion world');
    expect(text).toContain('Second line here');
  });

  it('returns empty string for missing content', () => {
    expect(lexicalToText(null)).toBe('');
    expect(lexicalToText(undefined)).toBe('');
  });
});

describe('authorName', () => {
  it('returns the derived display name for a populated author object', () => {
    expect(authorName({ author: { displayName: 'Tony Zhou' } })).toBe(
      'Tony Zhou'
    );
  });

  it('returns undefined for a bare id or missing author', () => {
    expect(authorName({ author: 2 })).toBeUndefined();
    expect(authorName({ author: null })).toBeUndefined();
    expect(authorName({})).toBeUndefined();
  });
});

describe('computeStats', () => {
  it('counts words across nodes', () => {
    expect(computeStats(lexical).words).toBe(6);
  });

  it('clamps reading time to at least one minute', () => {
    expect(computeStats(lexical).readingTime).toBe(1);
  });

  it('scales reading time with length (200 words per minute)', () => {
    const long = {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: `${'word '.repeat(450)}` }],
          },
        ],
      },
    };
    const stats = computeStats(long);
    expect(stats.words).toBe(450);
    expect(stats.readingTime).toBe(3);
  });
});
