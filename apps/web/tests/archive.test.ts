import { describe, expect, it } from 'vitest';
import { groupByMonth } from '@utils';

describe('groupByMonth', () => {
  it('groups posts by year and month, newest first', () => {
    const posts = [
      { publishedDate: '2026-10-15T12:00:00.000Z' },
      { publishedDate: '2026-10-02T12:00:00.000Z' },
      { publishedDate: '2025-11-15T12:00:00.000Z' },
    ];

    expect(groupByMonth(posts)).toEqual([
      { year: 2026, months: [{ month: 9, count: 2 }] },
      { year: 2025, months: [{ month: 10, count: 1 }] },
    ]);
  });

  it('skips posts without a published date', () => {
    expect(groupByMonth([{ publishedDate: undefined }, {}])).toEqual([]);
  });
});
