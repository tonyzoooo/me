# me

The monorepo behind tonyzoooo.me: a static Astro site and a Payload CMS.

## Layout

| Path                         | What it is                                                                                                                                         |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/web`                   | The site (Astro + Tailwind). Builds to static HTML; content is fetched from the CMS at build time.                                                 |
| `apps/cms`                   | Payload CMS on Next.js: admin panel, REST API, Postgres schema.                                                                                    |
| `packages/payload-features`  | Custom Lexical editor features: mermaid diagrams with live preview, fenced code blocks, markdown import, and the shared markdown transformer list. |
| `packages/eslint-config`     | Shared ESLint configs.                                                                                                                             |
| `packages/typescript-config` | Shared tsconfig bases.                                                                                                                             |

## Development

```sh
make install
make dev-web      # site on http://localhost:4321
make dev-cms      # Postgres in docker, CMS on http://localhost:3000/admin
```

Other targets: `make lint`, `make typecheck`, `make test`, `make build`, `make help`.

## Writing posts

Two ways:

1. **Admin panel** at tonyzoooo.me/admin. Saving a post fires the site's Vercel deploy hook, so publishing rebuilds the site within a minute.
2. **Markdown files** in `content/` with frontmatter (`title`, `status`, `tags`, `publishedDate`, `excerpt`), then `make import-md`. The importer is idempotent by slug: re-running updates existing posts. See `apps/cms/tests/fixtures/example-post.md` for the format.

## Deployment

Everything deploys from `git push` to main:

- Vercel builds both apps (git-connected, root directories `apps/web` and `apps/cms`).
- GitHub Actions runs lint, types and tests; on success it records the deployment on the commit. Ghost records from history rewrites are cleaned up automatically.
- The site is fully static; the CMS is only needed at build time. Content edits rebuild the site through the deploy hook.

Infrastructure:

| Piece    | Service                                                                                                        |
| -------- | -------------------------------------------------------------------------------------------------------------- |
| Hosting  | Vercel, projects `tonyzoooo-me-web` and `tonyzoooo-me-cms`                                                     |
| Database | Neon Postgres (EU). Schema changes: `DATABASE_URL=<url> pnpm --dir apps/cms exec payload migrate`              |
| Media    | Cloudflare R2, served from `media.tonyzoooo.me`                                                                |
| Domain   | `tonyzoooo.me` on the web project; `/admin`, `/api` and `/_next` proxy to the CMS (see `apps/web/vercel.json`) |

Environment variables live in the Vercel dashboard (`apps/cms/.env.production.example` is the full reference). To change one:

```sh
pnpm dlx vercel@63 env add NAME production --force                # secret values
pnpm dlx vercel@63 env add NAME production --force --no-sensitive  # values prefixed PUBLIC_ or NEXT_PUBLIC_
```

## Tests

- `apps/web`: vitest, runs without services.
- `packages/payload-features`: vitest, markdown round-trips through a headless Lexical editor.
- `apps/cms`: vitest integration tests against Postgres (`make docker-cms-up` first).
