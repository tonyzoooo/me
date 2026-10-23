# Makefile for monorepo - simplifies common operations
# Usage: make <target>
# Run `make help` to see all available targets

.PHONY: help dev build lint test clean install docker-cms-up docker-cms-down

# Default target
help:
	@echo "Tony's Monorepo - Available Commands"
	@echo "====================================="
	@echo ""
	@echo "Development:"
	@echo "  make dev              # Run all apps in dev mode"
	@echo "  make dev-web          # Run web app in dev mode"
	@echo "  make dev-cms          # Run CMS locally (auto-starts Postgres in Docker)"
	@echo ""
	@echo "Build:"
	@echo "  make build            # Build all apps and packages"
	@echo "  make build-web        # Build web app only"
	@echo "  make build-cms        # Build CMS app only"
	@echo ""
	@echo "Quality:"
	@echo "  make lint             # Lint all packages"
	@echo "  make test             # Run all tests"
	@echo "  make clean            # Clean all build artifacts"
	@echo ""
	@echo "Setup:"
	@echo "  make install          # Install all dependencies"
	@echo ""
	@echo "CMS (Docker):"
	@echo "  make docker-cms-up    # Run CMS fully inside Docker Compose"
	@echo "  make docker-cms-down  # Stop CMS Docker containers"
	@echo ""

# Install dependencies
install:
	pnpm install

# Development targets
dev:
	pnpm exec turbo dev

dev-web:
	pnpm exec turbo dev --filter=web

# Local dev: Postgres in Docker, CMS on the host
dev-cms:
	cd apps/cms && docker-compose up -d postgres
	pnpm exec turbo dev --filter=cms

# Build targets
build:
	pnpm exec turbo build

build-web:
	pnpm exec turbo build --filter=web

build-cms:
	pnpm exec turbo build --filter=cms

# Quality targets
lint:
	pnpm exec turbo lint

test:
	pnpm exec turbo test

clean:
	pnpm exec turbo clean

# CMS Docker targets (requires cd into apps/cms)
docker-cms-up:
	cd apps/cms && docker-compose up -d

docker-cms-down:
	cd apps/cms && docker-compose down

# Additional convenience targets
# Run a specific app's dev server directly (bypasses turbo)
run-web:
	cd apps/web && pnpm dev

run-cms:
	cd apps/cms && pnpm dev

# Type-check all packages
typecheck:
	pnpm exec turbo type-check

# Generate types for all packages
generate:
	pnpm exec turbo generate

# Start all services (dev + docker)
start-all: docker-cms-up dev-cms dev-web

# Stop all services
stop-all: docker-cms-down
