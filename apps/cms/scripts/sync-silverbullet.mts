// Imports SilverBullet pages marked with `publish: true` straight into the
// CMS. Nothing goes through git: existing posts are updated by slug, new
// ones are created.
//
// Usage (with the target environment's env vars sourced):
//   pnpm --dir apps/cms exec tsx scripts/sync-silverbullet.mts <space-path>
import fs from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import configPromise from '../src/payload.config.js'
import {
  markdownToLexical,
  upsertPost,
} from './import-md-lib.js'
import { isPublishable, toPost } from './sync-silverbullet-lib'

const space = process.argv[2]
if (!space) {
  console.error('Usage: tsx scripts/sync-silverbullet.mts <silverbullet-space-path>')
  process.exit(1)
}

const files = fs
  .readdirSync(space)
  .filter((file) => file.endsWith('.md') && !file.startsWith('_'))

const pages = files
  .map((file) => ({
    file,
    raw: fs.readFileSync(path.join(space, file), 'utf8'),
  }))
  .filter((page) => isPublishable(page.raw))

if (!pages.length) {
  console.log(`No publishable pages in ${space}`)
  process.exit(0)
}

const payload = await getPayload({ config: await configPromise })

for (const { file, raw } of pages) {
  const post = toPost(file, raw)
  const result = await upsertPost(payload, {
    ...post,
    publishedDate: post.publishedDate ?? new Date().toISOString(),
    content: markdownToLexical(post.body) as Record<string, unknown>,
  })
  console.log(`${file}: ${result} "${post.slug}" (${post.status})`)
}

// The site is static; rebuild it so new posts appear.
if (process.env.WEB_DEPLOY_HOOK_URL) {
  try {
    await fetch(process.env.WEB_DEPLOY_HOOK_URL, {
      method: 'POST',
      signal: AbortSignal.timeout(5000),
    })
    console.log('Triggered website rebuild via deploy hook')
  } catch (error) {
    console.error('Failed to trigger website rebuild:', error)
  }
}

process.exit(0)
