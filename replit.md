# Tiệm Chu Du

A Vietnamese lifestyle blog and order management website with an elegant teal-paper aesthetic, admin panel for content management.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- API spec: `lib/api-spec/openapi.yaml`
- DB schema: `lib/db/src/schema/` — blogs.ts, orderRules.ts, welcomePage.ts
- API routes: `artifacts/api-server/src/routes/` — blogs.ts, orderRules.ts, welcome.ts
- Frontend pages: `artifacts/tiem-chu-du/src/pages/`
- Theme/CSS: `artifacts/tiem-chu-du/src/index.css`

## Architecture decisions

- Contract-first: OpenAPI spec drives both Zod validation (server) and React Query hooks (client)
- Admin panel at `/admin` — tab-based, no password required (simple owner tool)
- Welcome page stored as a single database row, updated via PATCH
- Blog posts support published/draft toggle
- Order rules support sort order for custom ordering

## Product

- Public: Welcome page, blog listing + detail, order rules page
- Admin: Edit welcome page, write/manage blog posts, manage order rules

## User preferences

- Website name: Tiệm Chu Du
- Design: Luxurious teal/dark blue-green paper aesthetic, gold accents, Cormorant Garamond + Lora fonts
- Language: Vietnamese UI
- Admin panel: tab-based, no authentication needed

## Gotchas

- After changing OpenAPI spec, always run codegen before using updated types
- Welcome page always has exactly one row — seeded on first setup
- `pnpm --filter @workspace/db run push` must be run after any schema changes

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
