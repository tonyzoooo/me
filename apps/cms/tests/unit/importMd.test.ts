import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  importableFiles,
  markdownToLexical,
  parseFrontmatter,
  slugify,
} from '../../scripts/import-md-lib'

// Vitest runs with the package directory as cwd, both locally and in CI.
const fixture = readFileSync(resolve(process.cwd(), 'tests/fixtures/example-post.md'), 'utf8')

describe('parseFrontmatter', () => {
  it('reads the fixture frontmatter', () => {
    const { data, body } = parseFrontmatter('example-post.md', fixture)
    expect(data.title).toBe('Example imported post')
    expect(data.status).toBe('draft')
    expect(data.tags).toEqual(['example', 'silverbullet'])
    expect(body.trim()).toContain('# From markdown to Payload')
  })

  it('derives a title from the filename when no frontmatter exists', () => {
    const { data, body } = parseFrontmatter('a-plain-note.md', 'just a body')
    expect(data.title).toBe('a-plain-note')
    expect(body).toBe('just a body')
  })
})

describe('markdownToLexical', () => {
  it('converts the fixture body into nodes the site renders', () => {
    const { body } = parseFrontmatter('example-post.md', fixture)
    const children = markdownToLexical(body.trim()).root.children as Array<{
      type: string
      code?: string
      language?: string
    }>

    const types = children.map((child) => child.type)
    expect(types).toContain('heading')
    expect(types).toContain('paragraph')
    expect(types).toContain('codeblock')
    expect(types).toContain('mermaid')

    const codeblock = children.find((child) => child.type === 'codeblock')
    expect(codeblock?.language).toBe('ts')
    expect(codeblock?.code).toContain("const hello = 'world'")
  })
})

describe('importableFiles', () => {
  it('keeps markdown files and skips templates and other files', () => {
    expect(importableFiles(['a.md', '_template.md', 'notes.txt', 'b.MD'])).toEqual(['a.md'])
  })
})

describe('slugify', () => {
  it('makes url-friendly slugs from titles', () => {
    expect(slugify('Example imported post')).toBe('example-imported-post')
    expect(slugify('Les Déjà! (vu)')).toBe('les-dj-vu')
  })
})
