# cms

Payload CMS on Next.js: the admin panel, REST API and Postgres schema for tonyzoooo.me.

## Development

```sh
docker-compose up -d   # Postgres, or: make docker-cms-up from the repo root
pnpm dev               # http://localhost:3000, admin panel at /admin
```

Create the first admin user at http://localhost:3000/admin.

## Environment

Copy `.env.example` to `.env`. `DATABASE_URL` points at Postgres, `PAYLOAD_SECRET` is any long random string. Without the `R2_*` variables, media is stored on local disk; with them set (see `.env.production.example`), uploads go to Cloudflare R2.

## Database

The schema is managed by migrations:

```sh
pnpm exec payload migrate         # apply pending migrations (uses DATABASE_URL)
pnpm exec payload migrate:create  # create a migration after changing collections
```

## Rich text features

Mermaid diagrams, fenced code blocks and markdown import come from `@repo/payload-features`. After changing collections or features, regenerate the admin import map and types:

```sh
pnpm generate:importmap
pnpm generate:types
```

## Importing markdown posts

```sh
set -a && . ./.env.production && set +a
pnpm exec tsx scripts/import-md.mts ../../content
```
