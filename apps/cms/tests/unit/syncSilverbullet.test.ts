import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { isPublishable, toPost } from '../../scripts/sync-silverbullet-lib'

// Vitest runs with the package directory as cwd, both locally and in CI.
const note = readFileSync(resolve(process.cwd(), 'tests/fixtures/silverbullet-note.md'), 'utf8')

describe('isPublishable', () => {
  it('accepts a page with publish: true', () => {
    expect(isPublishable(note)).toBe(true)
  })

  it('rejects pages without the flag', () => {
    expect(isPublishable('# Just a heading\n\nbody')).toBe(false)
    expect(isPublishable('---\ntitle: x\n---\nbody')).toBe(false)
  })
})

describe('toPost', () => {
  it('maps a SilverBullet page to post fields, published by default', () => {
    const post = toPost('my-note.md', note)
    expect(post.slug).toBe('my-note')
    expect(post.title).toBe('A note I want on the blog')
    expect(post.status).toBe('published')
    expect(post.tags).toEqual(['blog', 'test'])
    expect(post.publishedDate).toBe('2026-10-23T12:00:00.000Z')
    expect(post.body).toContain('Written in SilverBullet')
  })

  it('derives the title from the first heading when absent', () => {
    const post = toPost('untitled.md', '---\npublish: true\n---\n\n# Hello\n\nbody')
    expect(post.title).toBe('Hello')
    expect(post.slug).toBe('untitled')
  })

  it('honors an explicit slug and status', () => {
    const post = toPost(
      'x.md',
      '---\npublish: true\nslug: custom-slug\nstatus: draft\n---\n\n# T\n',
    )
    expect(post.slug).toBe('custom-slug')
    expect(post.status).toBe('draft')
  })
})
