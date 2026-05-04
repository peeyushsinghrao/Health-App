# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## App: Soochna Sahayak — Smart Office Assistant

A premium government productivity tool for the Ayurveda Department (Rajasthan). Features:
- **PLP Report Generator**: AHWC monthly performance report with PDF/Excel export
- **Staff Attendance Tracker**: A4 landscape attendance sheet with PDF/Excel export
- **Warm Parchment UI**: Custom design system with Lora/DM Sans fonts, deep green accent (#1A5C38)
- **Dark Mode**: Toggle via navbar button
- **PWA**: manifest.json + service worker for installability

### Key files
- `artifacts/soochna-sahayak/src/app/page.tsx` — main UI (home + PLP panel + attendance panel)
- `artifacts/soochna-sahayak/src/app/globals.css` — full design system (1952 lines)
- `artifacts/soochna-sahayak/src/web-portal.css` — print/document styles
- `artifacts/soochna-sahayak/public/web-portal.js` — vanilla JS portal logic (DOM manipulation, PDF/Excel)
- `artifacts/soochna-sahayak/index.html` — HTML entry with Google Fonts (Lora, DM Sans, JetBrains Mono, Noto Devanagari)

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React 19 + Vite + Tailwind CSS v4
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
