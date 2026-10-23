import { describe, expect, it } from 'vitest';
import { lexicalToHtml } from '@utils';

const uploadContent = {
  root: {
    type: 'root',
    children: [
      {
        type: 'upload',
        relationTo: 'media',
        fields: { caption: 'A "cute" onion' },
        value: {
          url: '/api/media/file/onion.jpg',
          alt: 'An onion',
          filename: 'onion.jpg',
        },
      },
    ],
  },
};

describe('lexicalToHtml upload nodes', () => {
  it('renders inline media as figures with absolute urls', () => {
    const html = lexicalToHtml(uploadContent);
    expect(html).toContain('<figure>');
    expect(html).toContain(
      'src="http://localhost:3000/api/media/file/onion.jpg"'
    );
    expect(html).toContain('alt="An onion"');
  });

  it('escapes captions and alt text', () => {
    const html = lexicalToHtml(uploadContent);
    expect(html).toContain('<figcaption>A &quot;cute&quot; onion</figcaption>');
  });

  it('skips unpopulated upload references', () => {
    const html = lexicalToHtml({
      root: {
        type: 'root',
        children: [{ type: 'upload', relationTo: 'media', value: 5 }],
      },
    });
    expect(html).toBe('');
  });

  it('renders without a caption when none is set', () => {
    const html = lexicalToHtml({
      root: {
        type: 'root',
        children: [
          {
            type: 'upload',
            relationTo: 'media',
            fields: {},
            value: { url: '/api/media/file/x.png', alt: 'x' },
          },
        ],
      },
    });
    expect(html).not.toContain('figcaption');
  });

  it('renders non-image media as a link', () => {
    const html = lexicalToHtml({
      root: {
        type: 'root',
        children: [
          {
            type: 'upload',
            relationTo: 'media',
            fields: {},
            value: {
              url: '/api/media/file/guide.pdf',
              filename: 'guide.pdf',
              mimeType: 'application/pdf',
            },
          },
        ],
      },
    });
    expect(html).toContain(
      '<a href="http://localhost:3000/api/media/file/guide.pdf">guide.pdf</a>'
    );
    expect(html).not.toContain('<img');
  });
});
