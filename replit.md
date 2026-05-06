# Soochna Sahayak — Smart Office Assistant

A Hindi-language smart office assistant web app for managing attendance, documents, and office workflows.

## Run & Operate

- `PORT=19119 BASE_PATH=/ pnpm --filter @workspace/soochna-sahayak run dev` — run frontend (dev)
- `pnpm --filter @workspace/api-server run dev` — run API server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js**: 24, **Package manager**: pnpm, **TypeScript**: 5.9
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (v4), drizzle-zod
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Where things live

- `artifacts/soochna-sahayak/` — main frontend (React/Vite), served at `/`
- `artifacts/api-server/` — Express API server, served at `/api`
- `artifacts/soochna-sahayak-promo/` — promo/landing page artifact
- `lib/` — shared workspace libraries (db, api-spec, api-client-react, api-zod)
- `artifacts/soochna-sahayak/src/pages/` — app pages
- `artifacts/soochna-sahayak/src/components/` — UI components
- `artifacts/soochna-sahayak/public/web-portal.js` — legacy JS portal script

## Architecture decisions

- App title/lang set to Hindi (`hi`) via `useEffect` in App.tsx
- External scripts (html2pdf, xlsx, web-portal.js) loaded dynamically at runtime
- Attendance coloring logic driven by MutationObserver on DOM
- Frontend served at root `/`, API at `/api`

## Product

- Attendance tracking with Hindi day labels
- Document generation (PDF/Excel export)
- Smart office workflow management
- Hindi-first UI

## User preferences

_Populate as interactions reveal preferences._

## Gotchas

- PORT and BASE_PATH env vars are required for the Vite dev server to start
- Workflow uses port 19119 for the frontend
- `web-portal.js` in `public/` is a legacy plain-JS script loaded at runtime

## Pointers

- See `pnpm-workspace` skill for monorepo structure details
- API artifact TOML: `artifacts/api-server/.replit-artifact/artifact.toml`
- Frontend artifact TOML: `artifacts/soochna-sahayak/.replit-artifact/artifact.toml`
