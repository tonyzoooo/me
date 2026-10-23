import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'User',
    plural: 'Users',
  },
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
  },
  auth: true,
  access: {
    // Public read so post authors can be populated on the public API;
    // identifying fields are stripped from anonymous GETs by the afterRead hook.
    read: () => true,
  },
  hooks: {
    afterRead: [
      ({
        doc,
        req,
      }: {
        doc: {
          email?: string
          firstName?: string
          lastName?: string
          username?: string
          displayName?: string
          [key: string]: unknown
        }
        req: { user?: unknown; method?: string }
      }) => {
        // Derived display name: username, then first + last, then email
        doc.displayName =
          doc.username ||
          (doc.firstName && doc.lastName
            ? `${doc.firstName} ${doc.lastName}`
            : doc.firstName || doc.lastName || doc.email)

        // Anonymous GETs only ever see the derived name and the username
        if (!req.user && req.method === 'GET') {
          delete doc.email
          delete doc.firstName
          delete doc.lastName
        }
        return doc
      },
    ],
  },
  fields: [
    // Email added by default
    {
      name: 'username',
      type: 'text',
      admin: {
        description: 'Public handle, e.g. tonyzoooo. Takes precedence over your real name.',
      },
    },
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
  ],
}
