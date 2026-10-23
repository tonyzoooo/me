# Monorepo - Tony's Projects

A Turborepo monorepo containing multiple applications and shared packages.

## What's inside?

This monorepo includes the following packages and apps:

### Apps

| App   | Description                                                 | Tech Stack                                        |
| ----- | ----------------------------------------------------------- | ------------------------------------------------- |
| `cms` | Payload CMS content management system with Next.js frontend | Next.js 16, Payload CMS 3, PostgreSQL, TypeScript |
| `web` | Frontend web application (tonyzoooo.me)                     | Astro, Tailwind CSS, Vitest, TypeScript           |

### Packages

| Package                   | Description                                |
| ------------------------- | ------------------------------------------ |
| `@repo/eslint-config`     | ESLint configurations (Next.js + Prettier) |
| `@repo/typescript-config` | Shared TypeScript configurations           |

All packages and apps are 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has the following tools already set up:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [pnpm](https://pnpm.io/) as the package manager
- [Turborepo](https://turborepo.dev/) for fast builds and caching

### Quick Commands via Makefile

For convenience, common operations are available via `make`:

```sh
# See all available commands
make help

# Development
make dev              # Run all apps in dev mode
make dev-web          # Run web app only
make dev-cms          # Run CMS locally (auto-starts Postgres in Docker)

# Build
make build            # Build all apps
make build-web        # Build web app only
make build-cms        # Build CMS app only

# Quality
make lint             # Lint all packages
make test             # Run all tests
make clean            # Clean build artifacts

# Setup
make install          # Install all dependencies

# Docker (CMS)
make docker-cms-up    # Run CMS fully inside Docker Compose
make docker-cms-down  # Stop CMS Docker containers
```

## Getting Started

### Prerequisites

- Node.js >= 24.0.0
- pnpm >= 12 (recommended)
- PostgreSQL (for CMS app)
- Docker & Docker Compose (optional)

### Install Dependencies

```sh
# Install all dependencies at the root
pnpm install
```

### Build

To build all apps and packages:

```sh
# With global turbo installed
turbo build

# Or using pnpm (recommended)
pnpm exec turbo build

# Or filter to build only specific apps
pnpm exec turbo build --filter=cms
pnpm exec turbo build --filter=web
```

### Develop

To develop all apps and packages simultaneously:

```sh
pnpm exec turbo dev
```

To develop a specific app:

```sh
# Develop only the CMS app
pnpm exec turbo dev --filter=cms

# Develop only the web app
pnpm exec turbo dev --filter=web
```

## Running the Web App

The `web` app is a statically generated Astro site. Pages: home, blog, about, and resources. Blog content is fetched from the CMS at build time; if the CMS is unreachable the build still succeeds with an empty blog.

The site has a light/dark theme (toggled in the header, persisted in `localStorage`, defaults to the OS preference) styled with Tailwind CSS. Header and footer chrome are shared via the base layout.

```sh
# Development server (default: http://localhost:4321)
cd apps/web
pnpm dev

# Static build to dist/
pnpm build

# Run the test suite
pnpm test
```

## Running the CMS App

The `cms` app is a Payload CMS with Next.js. See [apps/cms/README.md](./apps/cms/README.md) for detailed setup instructions.

### Quick Start for CMS

```sh
# Navigate to the CMS directory
cd apps/cms

# Copy environment variables
cp .env.example .env

# Edit .env with your PostgreSQL connection:
# DATABASE_URI=postgresql://user:password@localhost:5432/cms
# PAYLOAD_SECRET=your-secret-key

# Install dependencies (if not already installed via root)
pnpm install

# Run development server
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000) and create your admin user at [http://localhost:3000/admin](http://localhost:3000/admin).

### Docker for CMS

The CMS includes Docker support:

```sh
cd apps/cms
docker-compose up -d
```

### Remote Caching (Optional)

Turborepo supports [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching) to share build caches across machines and CI/CD pipelines.

To enable with Vercel (free for all plans):

```sh
# Login to Vercel
pnpm exec turbo login

# Link this repo to your Vercel account
pnpm exec turbo link
```

## Additional Commands

### Lint all packages

```sh
pnpm exec turbo lint
```

### Clean build artifacts

```sh
pnpm exec turbo clean
```

### Run tests

```sh
pnpm exec turbo test

# Or just the web app's tests
pnpm exec turbo test --filter=web
```

Notes:

- `web` tests (vitest) render the header/footer chrome and verify the built output; they run without any services.
- `cms` integration tests require the PostgreSQL database to be running (`make docker-cms-up`).

## Project Architecture

```
me/
├── apps/
│   ├── cms/           # Payload CMS (Next.js + PostgreSQL)
│   │   ├── src/       # Source code
│   │   └── README.md  # Detailed CMS setup guide
│   └── web/           # Frontend application
├── packages/
│   ├── eslint-config/ # Shared ESLint config
│   └── typescript-config/ # Shared TypeScript config
├── turbo.json         # Turborepo configuration
└── package.json       # Root package.json
```

## Useful Links

- [Turborepo Docs](https://turborepo.dev/docs)
- [Payload CMS Docs](https://payloadcms.com/docs) (for the CMS app)
- [Next.js Docs](https://nextjs.org/docs)
- [pnpm Docs](https://pnpm.io/documentation)
- [Turborepo Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Turborepo Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
