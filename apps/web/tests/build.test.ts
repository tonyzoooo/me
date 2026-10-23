import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const run = promisify(execFile);

const NAV_HREFS = ['/', '/blog', '/resources', '/about'];

async function collectPages(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory()
        ? collectPages(join(dir, entry.name))
        : [join(dir, entry.name)]
    )
  );
  return files.flat();
}

let pages: { path: string; html: string }[] = [];

beforeAll(async () => {
  await run('pnpm', ['exec', 'astro', 'build'], { cwd: process.cwd() });
  const files = (await collectPages('dist')).filter((f) => f.endsWith('.html'));
  pages = await Promise.all(
    files.map(async (path) => ({ path, html: await readFile(path, 'utf-8') }))
  );
}, 120_000);

describe('built site', () => {
  it('generates pages for every nav link', () => {
    for (const href of NAV_HREFS) {
      const expected =
        href === '/' ? 'dist/index.html' : `dist${href}/index.html`;
      expect(pages.map((p) => p.path)).toContain(expected);
    }
  });

  it('renders header and footer chrome on every page', () => {
    expect(pages.length).toBeGreaterThan(0);
    for (const { path, html } of pages) {
      expect(html, path).toContain('<header');
      expect(html, path).toContain('<footer');
    }
  });

  it('includes the theme init script on every page', () => {
    for (const { path, html } of pages) {
      expect(html, path).toContain("localStorage.getItem('theme')");
    }
  });

  it('uses valid html structure (no nested main elements)', () => {
    for (const { path, html } of pages) {
      const count = (html.match(/<main[\s>]/g) ?? []).length;
      expect(count, path).toBeLessThan(2);
    }
  });
});
