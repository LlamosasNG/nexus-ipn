# Repository Guidelines

## Project Structure & Module Organization
This repository is split into two TypeScript applications:

## Project Overview

Nexus IPN is a fullstack academic management platform.

Architecture:
- Frontend: React 19 + Vite + TypeScript
- Backend: Express 5 + Sequelize + PostgreSQL
- Package manager: pnpm

- `client/`: React 19 + Vite frontend. Main app code lives in `client/src`, with `api/` for HTTP clients, `components/` for reusable UI, `views/` for routed screens, `layouts/`, `hooks/`, and `types/`. Static assets live in `client/public/`.
- `server/`: Express + Sequelize backend. Source lives in `server/src`, organized into `controllers/`, `routes/`, `models/`, `middleware/`, `config/`, `utils/`, and `scripts/`. Tests live under `server/src/__tests__/`.

Before making changes read:
- /docs/ARCHITECTURE.md
- /docs/REPO_MAP.md
- /docs/CONVENTIONS.md
- /docs/RULES.md

## Critical Rules

- Never modify /dist
- Never modify /node_modules
- Prefer existing architectural patterns
- Reuse utilities before creating new ones
- Maintain strict TypeScript typing
- Avoid introducing new dependencies unless necessary

## Frontend

When working in /client:
- Read /docs/frontend/FRONTEND_GUIDE.md

## Backend

When working in /server:
- Read /docs/backend/BACKEND_GUIDE.md

## Build, Test, and Development Commands
Use `pnpm` inside each app directory.

- `cd client && pnpm dev`: start the Vite dev server.
- `cd client && pnpm build`: run TypeScript build checks and produce a production bundle.
- `cd client && pnpm lint`: run the frontend ESLint config.
- `cd server && pnpm server`: run the API with `nodemon` and `ts-node`.
- `cd server && pnpm build`: compile backend TypeScript to `server/dist`.
- `cd server && pnpm test`: run Jest tests.
- `cd server && pnpm test:coverage`: run tests with coverage.
- `cd server && pnpm seed` / `pnpm seed:fresh`: seed the database.

## Coding Style & Naming Conventions
Prefer TypeScript throughout. Follow existing naming patterns: PascalCase for React components, controllers, and Sequelize models (`PlanningController.ts`, `DashboardView.tsx`); camelCase for utilities, hooks, and API helpers (`useAuth.ts`, `AuthAPI.ts`). Keep files focused and colocate feature-specific UI under `client/src/components` or `client/src/views`.

On the client, ESLint is the enforced style gate (`client/eslint.config.js`). On the server, use the configured path aliases such as `@controllers/*` and `@utils/*` instead of long relative imports when appropriate.

## Testing Guidelines
Backend tests use Jest with `ts-jest`. Place tests in `server/src/__tests__/` and name them `*.test.ts`. Match the existing layout by grouping tests by layer, for example `controllers/AuthController.test.ts` or `middleware/auth.test.ts`.

There is no frontend test suite in the repo yet, so at minimum run `pnpm lint` and a production build before opening a PR.

## Commit & Pull Request Guidelines
Recent history mixes conventional commits (`feat:`) with short Spanish summaries. Keep commits imperative, specific, and scoped to one change. Examples: `feat: add planning persistence` or `fix: validate subject middleware`.

PRs should include a short description, linked issue or task, test notes, and screenshots for visible client changes. Call out database seeding or reset steps when reviewers need them.
