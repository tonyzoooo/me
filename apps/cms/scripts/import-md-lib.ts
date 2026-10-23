// Testable pieces of the markdown importer: frontmatter parsing and
// markdown-to-Lexical conversion. The CLI (import-md.mts) uses these.
import { $convertFromMarkdownString } from '@payloadcms/richtext-lexical/lexical/markdown'
import { createHeadlessEditor } from '@payloadcms/richtext-lexical/lexical/headless'
import { ListNode, ListItemNode } from '@payloadcms/richtext-lexical/lexical/list'
import { HeadingNode, QuoteNode } from '@payloadcms/richtext-lexical/lexical/rich-text'

import {
  CodeBlockServerNode,
  markdownImportTransformers,
  MermaidServerNode,
} from '@repo/payload-features'

export type Frontmatter = {
  title: string
  slug?: string
  status?: string
  publishedDate?: string
  tags?: string[]
  excerpt?: string
}

export function parseFrontmatter(
  filename: string,
  raw: string,
): { data: Frontmatter; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) {
    const title = filename.replace(/\.md$/, '')
    return { data: { title }, body: raw }
  }
  const data: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim()
    if (key) data[key] = value
  }

  let tags: string[] | undefined
  if (data.tags !== undefined) {
    tags = data.tags
      .replace(/^\[|\]$/g, '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  }

  return {
    data: {
      title: data.title ?? '',
      slug: data.slug,
      status: data.status,
      publishedDate: data.publishedDate,
      tags,
      excerpt: data.excerpt,
    },
    body: match[2],
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
}

const editor = createHeadlessEditor({
  namespace: 'import-md',
  nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, MermaidServerNode, CodeBlockServerNode],
})

export function markdownToLexical(markdown: string) {
  editor.update(
    () => {
      $convertFromMarkdownString(markdown, markdownImportTransformers)
    },
    { discrete: true },
  )
  return editor.getEditorState().toJSON()
}

export const importableFiles = (files: string[]): string[] =>
  files.filter((file) => file.endsWith('.md') && !file.startsWith('_'))
