import type { CollectionConfig } from 'payload'

import { rebuildWebsite } from '../hooks/rebuildWebsite'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    group: 'Content',
    description: 'Media used across the site, e.g. post cover images',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [rebuildWebsite],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Describe the media for screen readers and social previews',
      },
    },
  ],
  upload: true,
}
