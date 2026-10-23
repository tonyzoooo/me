// Testable pieces of the SilverBullet sync: deciding whether a page should
// become a post and mapping it to the post fields.
import { parseFrontmatter, slugify } from './import-md-lib'

export type SyncedPost = {
  title: string
  slug: string
  status: 'draft' | 'published' | 'archived'
  publishedDate?: string
  tags?: string[]
  excerpt?: string
  body: string
}

// A SilverBullet page becomes a post when its frontmatter has publish: true.
export function isPublishable(raw: string): boolean {
  const match = raw.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return false
  for (const line of match[1].split('\n')) {
    if (line.trim().toLowerCase().replace(/\s+/g, '') === 'publish:true') {
      return true
    }
  }
  return false
}

function firstHeading(body: string): string | undefined {
  const match = body.match(/^#\s+(.+)$/m)
  return match?.[1].trim()
}

// Maps a publishable page to post fields. The post defaults to published
// (the page opted in); frontmatter can override status and the rest.
export function toPost(filename: string, raw: string): SyncedPost {
  const { data, body } = parseFrontmatter(filename, raw)
  const status =
    data.status === 'draft' || data.status === 'archived' || data.status === 'published'
      ? data.status
      : 'published'
  const title = data.title || firstHeading(body) || filename.replace(/\.md$/, '')

  return {
    title,
    slug: data.slug || slugify(filename.replace(/\.md$/, '')),
    status,
    publishedDate: data.publishedDate,
    tags: data.tags,
    excerpt: data.excerpt,
    body: body.trim(),
  }
}
