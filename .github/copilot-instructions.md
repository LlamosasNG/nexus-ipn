# Copilot instructions for `sistema-homeopatia`

## Build, test, and lint

This repository is split into two independent pnpm projects: `client/` and `server/`.

### Client (`client/`)

```bash
cd client
pnpm dev
pnpm build
pnpm lint
```

- `pnpm lint` currently fails with ESLint flat-config/plugin compatibility (`eslint.config.js` + ESLint 10 shareable config format). Keep this in mind before treating lint failures as regressions.
- There is no test script in `client/package.json`.

### Server (`server/`)

```bash
cd server
pnpm server          # nodemon + ts-node
pnpm server:api      # allows CORS requests without origin (API mode)
pnpm build
pnpm test
pnpm test:coverage
```

Run one test file:

```bash
cd server
pnpm test -- src/__tests__/utils/jwt.test.ts
```

Run one test by name:

```bash
cd server
pnpm test -- -t "debe generar un token JWT válido"
```

Seed/reset data:

```bash
cd server
pnpm seed
pnpm db:reset
pnpm seed:fresh
```

## High-level architecture

- **Frontend (`client/`)**: React 19 + Vite + React Router + TanStack Query. Routes are grouped by layout (`AuthLayout`, `AppLayout`, `UserLayout`) and auth gating happens in `UserLayout` via `useAuth()` calling `/auth/user`.
- **Frontend API layer**: `src/api/*.ts` modules call backend endpoints through a shared Axios instance (`src/lib/axios.ts`) and parse responses with Zod schemas in `src/types/*`.
- **Backend (`server/`)**: Express + Sequelize (sequelize-typescript). `src/server.ts` wires middleware/CORS/rate limiters and mounts route modules under `/api/*`; `src/index.ts` starts the listener.
- **Domain model**: users, academies, subjects, and plannings. User-subject assignment is many-to-many through `UserSubject` and drives planning access.
- **Planning workflow**: planning is split into section resources (general data, transversal axes, didactic organization, thematic units/session activities, references, plagiarism tool). Routes live in `planningRoutes.ts` and map to dedicated controllers/models.

## Key conventions

- Use `@/` path aliases in both client and server (`tsconfig` + Vite/Jest mappings). Prefer aliased imports over long relative paths.
- Keep API and domain vocabulary in **Spanish** for user-facing values/messages (e.g., planning statuses `Borrador`, `Enviada`, etc.).
- Auth token storage key is **`NEXUS_TOKEN`** (localStorage); Axios interceptor attaches `Authorization: Bearer ...` automatically.
- Backend authorization/access checks rely on request augmentation:
  - `req.user` from `authenticate` middleware
  - `req.subject` and `req.userSubject` from `subjectExists` / `hasAccess` param middleware
  Reuse these middleware patterns instead of duplicating ownership checks.
- For planning section endpoints, follow existing **create-or-update** style (`POST`/`PUT` to the same resource path) used by controllers like `GeneralDataController`, `TransversalAxisController`, and `DidacticOrganizationController`.
- Client API modules should validate server payloads with Zod (`safeParse`) before returning typed data to components/hooks.
- Rate limiting is part of endpoint behavior (`src/config/limiter.ts`); preserve limiter usage when adding routes.
- Environment contract:
  - Client expects `VITE_API_URL` (usually includes `/api` prefix).
  - Server relies on `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, and email SMTP vars (`EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`).
