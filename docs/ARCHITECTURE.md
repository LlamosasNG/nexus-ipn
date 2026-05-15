# Architecture

## Frontend

Location:
- /client

Stack:
- React 19
- Vite
- TypeScript
- React Router 7
- React Hook Form
- TailwindCSS 4
- TanStack Query
- Zod

Structure:
- /api -> HTTP calls
- /components -> reusable UI
- /views -> screens/pages
- /layouts -> layout wrappers
- /hooks -> reusable hooks
- /types -> shared frontend types

## Backend

Location:
- /server

Stack:
- Express 5
- Sequelize
- PostgreSQL
- JWT authentication
- Nodemailer

Structure:
- /controllers -> request handlers
- /routes -> route definitions
- /models -> Sequelize models
- /middleware -> auth/validation middleware
- /utils -> helpers
- /emails -> email templates

## Communication

Frontend communicates with backend via REST API.

Authentication:
- JWT-based authentication

Database:
- PostgreSQL using Sequelize ORM
