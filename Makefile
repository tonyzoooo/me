# Common operations; see `make help` for the list

.PHONY: help install dev dev-web dev-cms build lint typecheck test clean docker-cms-up docker-cms-down import-md sync-md

help:
	@echo "Tony's Monorepo - Available Commands"
	@echo "====================================="
	@echo ""
	@echo "Development:"
	@echo "  make install          # Install all dependencies"
	@echo "  make dev-web          # Run the site (http://localhost:4321)"
	@echo "  make dev-cms          # Postgres in docker + CMS (http://localhost:3000/admin)"
	@echo ""
	@echo "Quality:"
	@echo "  make lint             # Lint all packages"
	@echo "  make typecheck        # Type-check all packages"
	@echo "  make test            # Run unit tests"
	@echo "  make build           # Build all apps"
	@echo "  make clean            # Clean build artifacts"
	@echo ""
	@echo "Content:"
	@echo "  make sync-md SPACE=.  # Import publishable SilverBullet pages straight into the CMS"
	@echo ""

install:
	pnpm install

dev-web:
	pnpm exec turbo dev --filter=web

dev-cms:
	cd apps/cms && docker-compose up -d postgres
	pnpm exec turbo dev --filter=cms

build:
	pnpm exec turbo build

lint:
	pnpm exec turbo lint

typecheck:
	pnpm exec turbo check-types

test:
	pnpm exec turbo test

clean:
	pnpm exec turbo clean

docker-cms-up:
	cd apps/cms && docker-compose up -d

docker-cms-down:
	cd apps/cms && docker-compose down

import-md:
	cd apps/cms && set -a && . ./.env.production && set +a && pnpm exec tsx scripts/import-md.mts ../../content

sync-md:
	cd apps/cms && set -a && . ./.env.production && set +a && pnpm exec tsx scripts/sync-silverbullet.mts $(SPACE)
