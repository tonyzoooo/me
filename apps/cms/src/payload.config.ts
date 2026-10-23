import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor, UploadFeature } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { MarkdownImportFeature } from './features/markdownImport/server/index'
import { MermaidFeature } from './features/mermaid/server/index'
import { r2FileUrl } from './r2Url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    avatar: {
      Component: './components/OnionAvatar.tsx',
    },
  },
  collections: [Users, Media, Posts],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      MarkdownImportFeature(),
      MermaidFeature(),
      UploadFeature({
        collections: {
          media: {
            fields: [
              {
                name: 'caption',
                type: 'text',
              },
            ],
          },
        },
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    },
  }),
  sharp,
  plugins: process.env.R2_ACCESS_KEY_ID
    ? [
        s3Storage({
          bucket: process.env.R2_BUCKET ?? '',
          config: {
            region: 'auto',
            endpoint: process.env.R2_ENDPOINT,
            credentials: {
              accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
              secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
            },
          },
          collections: {
            media: {
              prefix: 'media/',
              generateFileURL: ({ filename, prefix }) =>
                r2FileUrl(process.env.R2_PUBLIC_URL ?? '', prefix ?? '', filename),
            },
          },
        }),
      ]
    : [],
})
