.PHONY: install dev build test lint seed labs-build labs-clean clean

install:
	pnpm install

dev:
	pnpm dev

build:
	pnpm build

test:
	pnpm test

lint:
	pnpm lint

seed:
	pnpm seed

labs-build:
	pnpm labs-build

labs-clean:
	pnpm labs-clean

clean:
	rm -rf node_modules apps/*/node_modules packages/*/node_modules apps/*/dist packages/*/dist
