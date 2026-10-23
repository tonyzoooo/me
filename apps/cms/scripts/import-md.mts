// Imports markdown files from a folder into Payload as posts. Idempotent:
// posts are matched by slug, so re-running updates existing posts.
//
// Frontmatter (optional except title):
//   title: My Post
//   slug: my-post          (derived from title if missing)
//   status: draft           (draft | published | archived)
//   publishedDate: 2026-10-23T12:00:00.000Z
//   tags: [astro, typescript]
//   excerpt: Short summary
//
// Usage:
//   pnpm --dir apps/cms exec tsx scripts/import-md.mts ../../content
// Run with the target environment's env vars sourced (e.g. .env.production).
import fs from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import configPromise from '../src/payload.config.js'
import {
  importableFiles,
  markdownToLexical,
  parseFrontmatter,
  slugify,
} from './import-md-lib.js'

const folder = process.argv[2]
if (!folder) {
  console.error('Usage: tsx scripts/import-md.mts <folder>')
  process.exit(1)
}

const files = importableFiles(fs.readdirSync(folder)).sort()

if (!files.length) {
  console.log(`No .md files in ${folder}`)
  process.exit(0)
}

const payload = await getPayload({ config: await configPromise })

for (const file of files) {
  const raw = fs.readFileSync(path.join(folder, file), 'utf8')
  const { data, body } = parseFrontmatter(file, raw)

  if (!data.title) {
    console.warn(`${file}: missing title, skipping`)
    continue
  }

  const slug = data.slug || slugify(data.title)
  const status =
    data.status === 'published' || data.status === 'archived' || data.status === 'draft'
      ? data.status
      : 'draft'

  const content = markdownToLexical(body.trim())

  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  })

  const postData = {
    title: data.title,
    slug,
    status,
    publishedDate: data.publishedDate ?? undefined,
    tags: data.tags ?? [],
    excerpt: data.excerpt ?? '',
    content,
  }

  if (docs[0]) {
    await payload.update({
      collection: 'posts',
      id: docs[0].id,
      data: postData,
      overrideAccess: true,
    })
    console.log(`${file}: updated "${slug}" (${status})`)
  } else {
    await payload.create({
      collection: 'posts',
      data: postData,
      overrideAccess: true,
    })
    console.log(`${file}: created "${slug}" (${status})`)
  }
}

process.exit(0)
