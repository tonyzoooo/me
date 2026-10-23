import { beforeAll, describe, expect, it } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { Header, Footer, Breadcrumbs } from '@components';

let container: Awaited<ReturnType<typeof AstroContainer.create>>;

beforeAll(async () => {
  container = await AstroContainer.create();
});

describe('Header', () => {
  let html: string;

  beforeAll(async () => {
    html = await container.renderToString(Header);
  });

  it('renders as a header landmark with an inner nav', () => {
    expect(html).toContain('<header');
    expect(html).toMatch(/<nav aria-label="Main"/);
  });

  it('links the onion logo (no site name) to the home page', () => {
    expect(html).toMatch(/<a href="\/" class="nav-link" aria-label="[^"]*">/);
    expect(html).toContain('viewBox="0 0 64 64"');
    expect(html).toContain('currentColor');
    expect(html).not.toMatch(/tonyzoooo\.me<\/a>/);
  });

  it('contains all nav links in order', () => {
    const labels = [...html.matchAll(/class="nav-link[^"]*">\s*([A-Za-z]+)\s*<\/a>/g)].map(
      (m) => m[1],
    );
    expect(labels).toEqual(['Home', 'Blog', 'Resources', 'About']);
  });

  it('includes the dark mode toggle button', () => {
    expect(html).toContain('id="theme-toggle"');
    expect(html).toContain('aria-label="Toggle dark mode"');
  });
});

describe('Footer', () => {
  let html: string;

  beforeAll(async () => {
    html = await container.renderToString(Footer);
  });

  it('renders as a footer landmark', () => {
    expect(html).toContain('<footer');
  });

  it('shows the current year and site name', () => {
    expect(html).toContain(`&copy; ${new Date().getFullYear()} tonyzoooo.me`);
  });

  it('marks code as MIT and content as all rights reserved', () => {
    expect(html).toMatch(/Code\s*<a href="https:\/\/opensource\.org\/license\/mit">MIT<\/a>/);
    expect(html).toContain('Content all rights reserved');
  });

  it('uses the same container classes as the header', async () => {
    const headerHtml = await container.renderToString(Header);
    const containerClasses = 'max-w-2xl mx-auto px-6 py-4';
    expect(headerHtml).toContain(containerClasses);
    expect(html).toContain(containerClasses);
  });
});

describe('Breadcrumbs', () => {
  it('renders home followed by the given crumbs with separators', async () => {
    const html = await container.renderToString(Breadcrumbs, {
      props: {
        crumbs: [
          { href: '/blog', label: 'Blog' },
          { label: 'A post' },
        ],
      },
    });

    expect(html).toContain('<nav aria-label="Breadcrumb"');
    expect(html).toMatch(/<a href="\/"[^>]*>\s*Home\s*<\/a>/);
    expect(html).toMatch(/<a href="\/blog"[^>]*>\s*Blog\s*<\/a>/);
    expect(html.match(/aria-hidden="true">\/</g)?.length).toBe(2);
  });

  it('opts out of prose styling and list markers', async () => {
    const html = await container.renderToString(Breadcrumbs, { props: { crumbs: [] } });

    expect(html).toContain('not-prose');
    expect(html).toContain('list-none');
  });

  it('marks the current page without a link', async () => {
    const html = await container.renderToString(Breadcrumbs, {
      props: { crumbs: [{ href: '/blog', label: 'Blog' }, { label: 'A post' }] },
    });

    expect(html).toContain('<span aria-current="page">A post</span>');
    expect(html).not.toMatch(/href="A post"/);
  });
});
