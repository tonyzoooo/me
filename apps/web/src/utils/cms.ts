const CMS_URL = import.meta.env.PUBLIC_CMS_URL || 'http://localhost:3000';

// A single Lexical editor node
export interface LexicalNode {
  type?: string;
  text?: string;
  tag?: string;
  level?: number;
  format?: string;
  url?: string;
  version?: number;
  direction?: string;
  relationTo?: string;
  code?: string;
  children?: LexicalNode[];
  fields?: {
    url?: string;
    caption?: string;
  };
  value?: MediaRef | number | string | null;
}

// The shape of a richText field's stored content
export interface LexicalContent {
  root?: LexicalNode;
}

// Utility to convert Lexical JSON to simple HTML
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function lexicalToHtml(
  node: LexicalNode | LexicalContent | null
): string {
  if (!node) return '';

  const content = node as LexicalContent;
  if (content.root) {
    return (content.root.children ?? []).map(lexicalToHtml).join('');
  }

  const editorNode = node as LexicalNode;
  const renderChildren = (children?: LexicalNode[]): string =>
    (children ?? []).map(lexicalToHtml).join('');

  switch (editorNode.type) {
    case 'paragraph':
      return `<p>${renderChildren(editorNode.children)}</p>`;

    case 'heading': {
      const level =
        String(editorNode.tag ?? '').replace('h', '') || editorNode.level || 1;
      return `<h${level}>${renderChildren(editorNode.children)}</h${level}>`;
    }

    case 'text':
      return editorNode.text || '';

    case 'autolink':
    case 'link': {
      const url = editorNode.fields?.url || editorNode.url || '#';
      return `<a href="${url}">${renderChildren(editorNode.children)}</a>`;
    }

    case 'list': {
      const tag = editorNode.format === 'bullet' ? 'ul' : 'ol';
      const items = (editorNode.children ?? [])
        .filter((child) => child.type === 'listitem')
        .map((child) => `<li>${lexicalToHtml(child)}</li>`)
        .join('');
      return `<${tag}>${items}</${tag}>`;
    }
    case 'listitem':
      return `<li>${renderChildren(editorNode.children)}</li>`;

    case 'quote':
      return `<blockquote>${renderChildren(editorNode.children)}</blockquote>`;

    case 'code':
      return `<pre><code>${renderChildren(editorNode.children)}</code></pre>`;

    case 'mermaid':
      // Rendered client-side by mermaid.js (see containsMermaid)
      return `<pre class="mermaid">${escapeHtml(editorNode.code ?? '')}</pre>`;

    case 'linebreak':
      return '<br />';

    case 'upload': {
      const media = editorNode.value;
      if (media && typeof media === 'object' && media.url) {
        const src = mediaUrl(media);
        // Non-image media (PDFs, video, ...) renders as a link
        if (media.mimeType && !media.mimeType.startsWith('image/')) {
          const label = escapeHtml(media.filename || media.alt || 'View media');
          return `<a href="${src}">${label}</a>`;
        }
        const alt = escapeHtml(media.alt || media.filename || '');
        const caption = editorNode.fields?.caption
          ? `<figcaption>${escapeHtml(editorNode.fields.caption)}</figcaption>`
          : '';
        return `<figure><img src="${src}" alt="${alt}" />${caption}</figure>`;
      }
      return '';
    }

    default:
      return renderChildren(editorNode.children);
  }
}

// Extract plain text from Lexical JSON content
export function lexicalToText(
  node: LexicalContent | LexicalNode | null | undefined
): string {
  if (!node) return '';
  const walk = (n?: LexicalNode): string =>
    n?.text ? n.text : (n?.children ?? []).map(walk).join(' ');
  const root = (node as LexicalContent).root ?? (node as LexicalNode);
  return walk(root);
}

// True when the content includes at least one mermaid diagram, so pages can
// load the mermaid.js renderer only when needed.
export function containsMermaid(content: LexicalContent | null): boolean {
  const walk = (node?: LexicalNode): boolean =>
    node?.type === 'mermaid' || (node?.children ?? []).some(walk);
  return walk(content?.root);
}

// Reading stats derived from the content
export function computeStats(content: LexicalContent | null | undefined): {
  words: number;
  readingTime: number;
} {
  const words = lexicalToText(content).split(/\s+/).filter(Boolean).length;
  return {
    words,
    readingTime: Math.max(1, Math.ceil(words / 200)),
  };
}

export interface Heading {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Collect the article's headings, with stable ids (duplicates get a suffix)
export function extractHeadings(content: LexicalContent | null): Heading[] {
  const headings: Heading[] = [];
  const used = new Map<string, number>();
  for (const node of content?.root?.children ?? []) {
    if (node.type !== 'heading') continue;
    const text = lexicalToText({ root: { children: node.children ?? [] } });
    const level = Number(String(node.tag ?? '').replace('h', '')) || 2;
    const base = slugify(text) || 'section';
    const n = (used.get(base) ?? 0) + 1;
    used.set(base, n);
    headings.push({ id: n === 1 ? base : `${base}-${n}`, text, level });
  }
  return headings;
}

// Add ids to the <hN> tags produced by lexicalToHtml, matching extractHeadings
export function injectHeadingIds(html: string, headings: Heading[]): string {
  let i = 0;
  return html.replace(/<h([1-6])>/g, (_match, level: string) => {
    const heading = headings[i++];
    return `<h${level} id="${heading?.id ?? ''}">`;
  });
}

export interface MediaRef {
  url?: string;
  alt?: string;
  filename?: string;
  mimeType?: string;
}

// Payload returns media URLs relative to the CMS server; make them absolute
export function mediaUrl(media?: MediaRef | null): string | undefined {
  if (!media?.url) return undefined;
  return media.url.startsWith('http') ? media.url : `${CMS_URL}${media.url}`;
}

export interface AuthorRef {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

// Group posts by publication year and month (newest first) for the archive
export interface ArchiveMonth {
  month: number; // 0-based, matching Date
  count: number;
}
export interface ArchiveYear {
  year: number;
  months: ArchiveMonth[];
}

export function groupByMonth(
  posts: Pick<Post, 'publishedDate'>[]
): ArchiveYear[] {
  const years = new Map<number, Map<number, number>>();
  for (const post of posts) {
    if (!post.publishedDate) continue;
    const date = new Date(post.publishedDate);
    const months = years.get(date.getFullYear()) ?? new Map<number, number>();
    months.set(date.getMonth(), (months.get(date.getMonth()) ?? 0) + 1);
    years.set(date.getFullYear(), months);
  }
  return [...years.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, months]) => ({
      year,
      months: [...months.entries()]
        .sort(([a], [b]) => b - a)
        .map(([month, count]) => ({ month, count })),
    }));
}

// Display name for a post's author, if the CMS provided one
export function authorName(post: Pick<Post, 'author'>): string | undefined {
  const author = post.author;
  return typeof author === 'object' && author ? author.displayName : undefined;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: LexicalContent;
  htmlContent?: string;
  excerpt?: string;
  publishedDate?: string;
  status?: string;
  tags?: string[];
  author?: AuthorRef | number | null;
  featuredImage?: MediaRef | null;
  updatedAt?: string;
  createdAt?: string;
  headings?: Heading[];
  stats?: { words: number; readingTime: number };
}

export interface PostsResponse {
  docs: Post[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: null | number;
  page: number;
  pagingCounter: number;
  prevPage: null | number;
  totalDocs: number;
  totalPages: number;
}

export async function getPublishedPosts(): Promise<{ docs: Post[] }> {
  return fetchPostsByStatus('published');
}

export async function getArchivedPosts(): Promise<{ docs: Post[] }> {
  return fetchPostsByStatus('archived');
}

// Convert Lexical content to HTML and derive reading stats + headings
function withDerivedFields(post: Post): Post {
  const headings = extractHeadings(post.content);
  return {
    ...post,
    htmlContent: injectHeadingIds(lexicalToHtml(post.content), headings),
    headings,
    stats: computeStats(post.content),
  };
}

async function fetchPostsByStatus(
  status: 'published' | 'archived'
): Promise<{ docs: Post[] }> {
  let response: Response;
  try {
    response = await fetch(
      `${CMS_URL}/api/posts?where[status][equals]=${status}&limit=100&sort=-publishedDate`,
      { signal: AbortSignal.timeout(10_000) }
    );
  } catch (error) {
    console.error('CMS unreachable:', error);
    return { docs: [] };
  }

  if (!response.ok) {
    console.error('CMS fetch error:', await response.text());
    return { docs: [] };
  }

  const data: PostsResponse = await response.json();
  return { docs: data.docs.map(withDerivedFields) };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  let response: Response;
  try {
    response = await fetch(
      `${CMS_URL}/api/posts?where[slug][equals]=${slug}&where[status][equals]=published`,
      { signal: AbortSignal.timeout(10_000) }
    );
  } catch (error) {
    console.error('CMS unreachable for slug', slug, ':', error);
    return null;
  }

  if (!response.ok) {
    console.error('CMS fetch error for slug', slug, ':', await response.text());
    return null;
  }

  const data: PostsResponse = await response.json();
  const post = data.docs[0];
  if (!post) return null;
  return withDerivedFields(post);
}
