const CMS_URL = import.meta.env.PUBLIC_CMS_URL || 'http://localhost:3000';

// Utility to convert Lexical JSON to simple HTML
function lexicalToHtml(node: any): string {
  if (!node) return '';
  
  // Handle text nodes directly
  if (node.text) {
    return node.text;
  }
  
  // Handle root node
  if (node.root) {
    return node.root.children.map((child: any) => lexicalToHtml(child)).join('');
  }
  
  // Recursively process children
  const renderChildren = (children: any[]) => {
    return children.map((child: any) => lexicalToHtml(child)).join('');
  };
  
  // Handle different node types
  switch (node.type) {
    case 'paragraph':
      return `<p>${renderChildren(node.children)}</p>`;
    
    case 'heading': {
      const level = node.tag || node.level || 1;
      return `<h${level}>${renderChildren(node.children)}</h${level}>`;
    }

    case 'text':
      return node.text || '';

    case 'autolink':
    case 'link': {
      const url = node.fields?.url || node.url || '#';
      return `<a href="${url}">${renderChildren(node.children || [])}</a>`;
    }

    case 'list': {
      const tag = node.format === 'bullet' ? 'ul' : 'ol';
      const items = node.children
        .filter((child: any) => child.type === 'listitem')
        .map((child: any) => `<li>${lexicalToHtml(child)}</li>`)
        .join('');
      return `<${tag}>${items}</${tag}>`;
    }
    case 'listitem':
      return `<li>${renderChildren(node.children)}</li>`;
    
    case 'quote':
      return `<blockquote>${renderChildren(node.children)}</blockquote>`;
    
    case 'code':
      return `<pre><code>${renderChildren(node.children)}</code></pre>`;
    
    case 'linebreak':
      return '<br />';
    
    default:
      return renderChildren(node.children || []);
  }
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: any;
  htmlContent?: string;
  excerpt?: string;
  publishedDate?: string;
  status?: string;
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
  let response: Response;
  try {
    response = await fetch(
      `${CMS_URL}/api/posts?where[status][equals]=published&limit=100&sort=-publishedDate`
    );
  } catch (error) {
    console.error('CMS unreachable:', error);
    return { docs: [] };
  }

  if (!response.ok) {
    console.error('CMS fetch error:', await response.text());
    return { docs: [] };
  }
  
  const data = await response.json();
  // Convert Lexical content to HTML
  const docs = data.docs.map((post: Post) => ({
    ...post,
    htmlContent: lexicalToHtml(post.content),
  }));
  
  return { ...data, docs };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  let response: Response;
  try {
    response = await fetch(
      `${CMS_URL}/api/posts?where[slug][equals]=${slug}&where[status][equals]=published`
    );
  } catch (error) {
    console.error('CMS unreachable for slug', slug, ':', error);
    return null;
  }

  if (!response.ok) {
    console.error('CMS fetch error for slug', slug, ':', await response.text());
    return null;
  }
  
  const data = await response.json();
  if (!data.docs[0]) return null;
  
  const post = data.docs[0];
  // Convert Lexical content to HTML
  return {
    ...post,
    htmlContent: lexicalToHtml(post.content),
  };
}
