// collections/Posts.ts
import type { CollectionConfig } from 'payload'

import { rebuildWebsite } from '../hooks/rebuildWebsite'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Post',
    plural: 'Posts',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'status', 'publishedDate', 'tags'],
    description: 'Blog posts published on tonyzoooo.me',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The headline shown everywhere on the site',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL segment. Left empty, it is generated from the title.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w-]+/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: 'The article body. Add headings (H2/H3) to get a table of contents.',
      },
    },
    {
      name: 'excerpt',
      type: 'text',
      maxLength: 200,
      admin: {
        description: 'Short summary shown on blog cards and social previews',
      },
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Post tags, e.g. astro, typescript, side-project',
        placeholder: 'Add a tag and press Enter',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Cover image shown on the blog card and post page',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Shown as the byline. Display name comes from the user profile.',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        description: 'Shown on the site. Posts without a date sort last.',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: ['draft', 'published', 'archived'],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
        description:
          'Published posts appear on the blog. Archived posts move to /blog/archived. Drafts stay hidden.',
      },
    },
  ],
  access: {
    read: ({ req }) => {
      if (!req.user) {
        return {
          status: { in: ['published', 'archived'] },
        }
      }
      return true
    },
  },
  hooks: {
    afterChange: [rebuildWebsite],
  },
}
