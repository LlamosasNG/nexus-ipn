# Nexus IPN - Developer Guide

## Project Overview

Educational planning system for IPN with React frontend and Express backend.

**Tech Stack:**
- Client: React 19 + Vite + TypeScript + TailwindCSS 4 + React Router 7 + TanStack Query + Zod
- Server: Express + TypeScript + Sequelize + PostgreSQL + JWT + Nodemailer

**Entry Points:**
- Client: `client/` (run with `pnpm dev`)
- Server: `server/src/index.ts` (run with `pnpm server`)

## Server Scripts

```bash
pnpm server          # Start dev server with ts-node
pnpm server:api      # Start dev server (explicit --api flag)
pnpm start           # Start production build from dist/
pnpm seed            # Run database seeder
pnpm db:reset        # Reset database
pnpm seed:fresh      # Reset + seed in one command
pnpm build           # Compile TypeScript to dist/
pnpm test            # Run Jest tests
pnpm test:coverage   # Run tests with coverage
```

## Path Aliases (server)

TypeScript paths configured in `tsconfig.json`:
- `@/*` → `src/*`
- `@models/*` → `src/models/*`
- `@controllers/*` → `src/controllers/*`
- etc.

Jest mirrors these in `moduleNameMapper`.

## Key Conventions

- Server uses `tsconfig-paths/register` for path aliases to work in dev
- Tests live in `src/__tests__/` matching source structure
- Test command ignores diagnostics code 151002 (ts-jest)
- Database auto-syncs on server start (`db.sync()`)
- Seed order: academies → users → subjects → studyPlans → planning-related

## Architecture Notes

- All controllers, models, routes, middleware under `server/src/`
- Auth uses JWT + bcrypt; email via nodemailer
- Rate limiter available but currently commented out in server.ts
- CORS configured via `src/config/cors.ts`