import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Vitest runs with the package directory as cwd, both locally and in CI.
const turbo = JSON.parse(
  readFileSync(resolve(process.cwd(), '../../turbo.json'), 'utf-8')
) as { tasks: Record<string, { cache?: boolean }> };

describe('turbo build config', () => {
  it('disables caching for the web build', () => {
    // The web build output depends on CMS content, which lives outside the
    // repo. A cache hit after a content change replays a stale dist.
    expect(turbo.tasks['web#build']).toMatchObject({ cache: false });
  });
});
