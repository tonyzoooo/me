# CMS - Payload Next.js Template

A content management system built with **Payload CMS 3.0** on **Next.js 16**. This project provides a flexible, headless CMS with a built-in admin panel, GraphQL API, and full TypeScript support.

## Tech Stack

| Layer           | Technology                                   |
| --------------- | -------------------------------------------- |
| Framework       | Next.js 16.2.6 (App Router)                  |
| CMS             | Payload CMS 3.84.1                           |
| Database        | PostgreSQL (via `@payloadcms/db-postgres`)   |
| Language        | TypeScript 5.7                               |
| Styling         | CSS / Tailwind (add as needed)               |
| Package Manager | pnpm 11+                                     |
| Rich Text       | Lexical (via `@payloadcms/richtext-lexical`) |

## Prerequisites

- Node.js >= 24.0.0
- pnpm >= 11
- PostgreSQL (local or remote)
- Docker & Docker Compose (optional, for containerized development)

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── (frontend)/       # Public-facing pages
│   │   │   ├── layout.tsx    # Root layout
│   │   │   └── page.tsx      # Homepage
│   │   └── (payload)/        # Payload CMS admin routes
│   │       ├── admin/        # Admin panel
│   │       └── api/          # API endpoints (GraphQL, REST)
│   ├── collections/          # CMS content collections
│   │   ├── Posts.ts          # Blog posts collection
│   │   ├── Users.ts          # User authentication
│   │   └── Media.ts          # File uploads
│   ├── payload.config.ts     # Payload CMS configuration
│   └── payload-types.ts      # Generated TypeScript types
├── docker-compose.yml        # Docker configuration
├── .env.example              # Environment variables template
└── package.json              # Dependencies and scripts
```

## Quick Start

### 1. Clone & Setup

```bash
# Clone the repository
git clone <repository-url>
cd cms

# Copy environment variables
cp .env.example .env
```

### 2. Configure Environment

Edit `.env` and add your database connection:

```env
# PostgreSQL Database URL
DATABASE_URI=postgresql://user:password@localhost:5432/cms

# Payload Secret (generate a strong random string)
PAYLOAD_SECRET=your-secret-key-here

# Next.js
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: For production
NODE_ENV=development
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Create Admin User

1. Visit [http://localhost:3000/admin](http://localhost:3000/admin)
2. Click "Create admin user"
3. Fill in your details and create your first admin account
4. Log in to the admin panel

## Docker Development (Recommended)

For a standardized development environment with PostgreSQL:

### 1. Update `.env`

```env
DATABASE_URI=postgresql://postgres:postgres@127.0.0.1:5432/cms
```

### 2. Start Services

```bash
# Start PostgreSQL and the app
docker-compose up -d

# Or with logs visible
docker-compose up
```

### 3. Initialize Database

The database will be automatically created on first run. Access the admin panel at [http://localhost:3000/admin](http://localhost:3000/admin).

### 4. Stop Services

```bash
docker-compose down
```

## Available Scripts

| Script                    | Description                       |
| ------------------------- | --------------------------------- |
| `pnpm dev`                | Start development server          |
| `pnpm build`              | Build for production              |
| `pnpm start`              | Start production server           |
| `pnpm lint`               | Run ESLint                        |
| `pnpm payload`            | Start Payload in standalone mode  |
| `pnpm generate:types`     | Generate TypeScript types         |
| `pnpm generate:importmap` | Generate import map               |
| `pnpm test`               | Run all tests                     |
| `pnpm test:int`           | Run integration tests (Vitest)    |
| `pnpm test:e2e`           | Run end-to-end tests (Playwright) |
| `pnpm deploy`             | Deploy to Vercel (preview)        |
| `pnpm deploy:prod`        | Deploy to Vercel (production)     |

## Collections

This project includes the following pre-configured collections:

### Users

Authentication-enabled collection for admin panel access. Supports email/password login out of the box.

### Media

File uploads with image processing. Supports:

- Multiple file types
- Automatic image resizing
- Focal point selection
- Manual cropping

### Posts

A sample blog post collection with:

- Title (text)
- Slug (auto-generated)
- Content (rich text)
- Featured image (relationship to Media)
- Published date

**To add new collections:** Create a new file in `src/collections/` and add it to `payload.config.ts`.

## API Access

### REST API

All collections are automatically available via REST endpoints:

```
GET    /api/posts          # List all posts
GET    /api/posts/:id      # Get single post
POST   /api/posts          # Create post (auth required)
PUT    /api/posts/:id      # Update post (auth required)
DELETE /api/posts/:id      # Delete post (auth required)
```

### GraphQL API

Full GraphQL API available at `/api/graphql`. Explore with the built-in GraphQL Playground at `/api/graphql-playground`.

### Query Example (Frontend)

```tsx
// src/app/(frontend)/page.tsx
import { getPayload } from 'payload'

export default async function Home() {
  const payload = await getPayload()

  const posts = await payload.find({
    collection: 'posts',
    limit: 10,
  })

  return (
    <main>
      <h1>Latest Posts</h1>
      {posts.docs.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: post.content?.html || '' }} />
        </article>
      ))}
    </main>
  )
}
```

## Testing

### Integration Tests (Vitest)

```bash
pnpm test:int
```

Tests in `tests/` directory. Write tests for your collections and business logic.

### End-to-End Tests (Playwright)

```bash
pnpm test:e2e
```

E2E tests for user flows. Configure in `playwright.config.ts`.

## Production

### Build

```bash
pnpm build
```

### Start

```bash
pnpm start
```

### Environment Variables for Production

```env
DATABASE_URI=postgresql://user:password@host:5432/database
PAYLOAD_SECRET=strong-random-string
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NODE_ENV=production
```

## Deployment

### Option 1: Payload Cloud (Recommended)

The easiest way to deploy. The template is pre-configured for Payload Cloud hosting:

1. Push to GitHub
2. Import repository in Payload Cloud dashboard
3. Deploy

Payload Cloud automatically provisions:

- Managed PostgreSQL database
- Media storage (S3-compatible)
- CDN for assets
- SSL certificates

### Option 2: Self-Hosted (Docker)

```bash
# Build the Docker image
docker build -t cms .

# Run with environment variables
docker run -p 3000:3000 \
  -e DATABASE_URI=postgresql://... \
  -e PAYLOAD_SECRET=... \
  -e NEXT_PUBLIC_SITE_URL=... \
  cms
```

### Option 2: Vercel CLI (Recommended for Codeberg)

Since you're hosting on Codeberg without direct integration, use the Vercel CLI:

#### Setup

1. Install Vercel CLI globally:

```bash
pnpm add -g vercel
```

Or install it as a project dev dependency (already added):

```bash
pnpm install
```

2. Login to Vercel:

```bash
vercel login
```

3. Link your project:

```bash
vercel link
```

Select your Vercel project or create a new one.

4. Add your environment variables to Vercel:

```bash
vercel env add DATABASE_URI
vercel env add PAYLOAD_SECRET
vercel env add NEXT_PUBLIC_SITE_URL
```

Or add them in the Vercel dashboard under Project Settings > Environment Variables.

#### Deploy

Development preview deployment:

```bash
pnpm deploy
```

Production deployment:

```bash
pnpm deploy:prod
```

#### First Time Setup

If this is your first deployment:

```bash
# Link and deploy in one command
vercel --prod
```

Follow the prompts to create a new Vercel project.

### Option 3: Self-Hosted (Docker)

### Option 4: Vercel Git Integration / Netlify / Other

Deploy the Next.js app to your preferred hosting. Ensure:

- PostgreSQL database is accessible
- `DATABASE_URI` is set in environment variables
- `PAYLOAD_SECRET` is set
- Node.js version >= 24.0.0

## Customization

### Adding a New Collection

1. Create a new file in `src/collections/`:

```ts
// src/collections/Products.ts
import { CollectionConfig } from 'payload'

const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
  ],
}

export default Products
```

2. Add it to `payload.config.ts`:

```ts
import Products from './collections/Products'

const config: BuildConfig = {
  collections: [
    Users,
    Media,
    Posts,
    Products, // Add your new collection
  ],
  // ...
}
```

3. Generate types: `pnpm generate:types`

### Extending User Collection

Add custom fields to users for profiles, roles, etc.:

```ts
// src/collections/Users.ts
import { CollectionConfig } from 'payload'

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    // Default auth fields...
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: ['admin', 'editor', 'user'],
      defaultValue: 'user',
    },
  ],
}
```

## Resources

- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Payload GitHub](https://github.com/payloadcms/payload)
- [Next.js Documentation](https://nextjs.org/docs)
- [Payload Discord Community](https://discord.com/invite/payload)

## Support

If you have questions or run into issues:

1. Check the [Payload Docs](https://payloadcms.com/docs)
2. Join the [Discord community](https://discord.com/invite/payload)
3. Start a [GitHub Discussion](https://github.com/payloadcms/payload/discussions)

## License

MIT License - see LICENSE file for details.
