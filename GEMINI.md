# Project Conventions — TanStack Start (React) Template

> This document is the single source of truth for AI assistants working on this codebase.
> Every convention below is derived from the **official documentation** of each dependency.

---

## Tech Stack

| Layer           | Technology                                                | Version (approx.) |
| --------------- | --------------------------------------------------------- | ----------------- |
| Framework       | TanStack Start (React)                                    | v1                |
| Router          | TanStack Router (file-based)                              | v1                |
| Server Runtime  | Nitro                                                     | latest            |
| UI Components   | shadcn/ui (`base-nova` style)                             | v3                |
| Styling         | TailwindCSS v4 + `tw-animate-css`                         | v4                |
| Auth            | Better Auth (email + password, admin plugin)              | v1                |
| Database ORM    | Drizzle ORM (PostgreSQL via `pg`)                         | v0.45             |
| Logging         | Pino (`pino-pretty` in dev)                               | v10               |
| Validation      | Zod                                                       | v4                |
| Forms           | React Hook Form                                           | v7                |
| React           | React 19 + React Compiler (`babel-plugin-react-compiler`) | v19               |
| Package Manager | pnpm                                                      | —                 |
| Linting         | ESLint (`@tanstack/eslint-config`)                        | —                 |
| Formatting      | Prettier (no semi, single quotes, trailing commas)        | —                 |

---

## Project Structure

```
├── public/                        # Static assets
├── src/
│   ├── components/
│   │   └── ui/                    # shadcn/ui components (DO NOT edit manually)
│   ├── lib/
│   │   ├── auth/
│   │   │   └── client.ts          # Better Auth React client (browser-side)
│   │   ├── validator/
│   │   │   └── zod-resolver.ts    # Custom Zod v4 resolver for React Hook Form
│   │   └── utils.ts               # cn() helper (clsx + tailwind-merge)
│   ├── middleware/
│   │   └── auth.ts                # Request middleware (createMiddleware)
│   ├── routes/
│   │   ├── __root.tsx             # Root layout (shellComponent, head, devtools)
│   │   ├── index.tsx              # Home page route
│   │   ├── sign-in.tsx            # Sign-in page
│   │   ├── sign-up.tsx            # Sign-up page
│   │   └── api/
│   │       ├── auth/
│   │       │   └── $.ts           # Better Auth catch-all API handler
│   │       └── health.tsx         # Health-check server route
│   ├── server/
│   │   └── lib/
│   │       ├── auth/
│   │       │   └── client.ts      # Better Auth server instance
│   │       ├── config/
│   │       │   └── env.ts         # Zod-validated environment variables
│   │       ├── db/
│   │           ├── client.ts      # Drizzle ORM client (pg Pool)
│   │           └── schema/
│   │               ├── index.ts   # Re-export for schemas (only barrel export in the project)
│   │               └── auth.ts    # Better Auth schema (user, session, account, verification)
│   │       └── logger.ts          # Pino logger singleton
│   ├── router.tsx                 # Router factory (createRouter)
│   ├── routeTree.gen.ts           # AUTO-GENERATED — never edit
│   └── styles.css                 # Global styles, shadcn theme tokens, Tailwind imports
├── components.json                # shadcn/ui CLI config
├── drizzle.config.ts              # Drizzle Kit config (migrations, schema path)
├── vite.config.ts                 # Vite + TanStack Start plugin config
├── tsconfig.json                  # TypeScript config (path alias: @/* → ./src/*)
└── .env                           # Environment variables (DATABASE_URL, etc.)
```

---

## Path Aliases

```
@/* → ./src/*
```

Always use `@/` imports. Never use relative paths like `../../`.

---

## Scripts

| Command            | Purpose                         |
| ------------------ | ------------------------------- |
| `pnpm dev`         | Start dev server on port 3000   |
| `pnpm build`       | Production build via Vite       |
| `pnpm preview`     | Preview production build        |
| `pnpm test`        | Run Vitest                      |
| `pnpm lint`        | Run ESLint                      |
| `pnpm typecheck`   | Run TypeScript type checking    |
| `pnpm format`      | Run Prettier                    |
| `pnpm check`       | Prettier --write + ESLint --fix |
| `pnpm db:generate` | Generate Drizzle migrations     |
| `pnpm db:migrate`  | Run Drizzle migrations          |
| `pnpm db:push`     | Push schema to database         |
| `pnpm db:studio`   | Open Drizzle Studio             |

### Verification Flow

After implementing changes, always run these commands in order:

1. `pnpm check` — typecheck, format with Prettier and fix ESLint issues

---

## Code Style

- **No semicolons** — enforced by Prettier
- **Single quotes** — enforced by Prettier
- **Trailing commas** (`all`) — enforced by Prettier
- **Strict TypeScript** — `strict: true`, `noUnusedLocals`, `noUnusedParameters`
- Use **named function declarations** for route components (not arrow functions)
- Export route as `export const Route = createFileRoute(...)(...)`
- Follow typescript eslint convention

### Naming Conventions

- **camelCase** for variables, functions, and methods
- **PascalCase** for types, interfaces, enums, and React components
- **UPPER_SNAKE_CASE** for constants and enum members
- **camelCase** for object/record keys
- Boolean variables should use `is`, `has`, `should` prefixes (e.g. `isLoading`, `hasError`)

### Import Order

Imports should be ordered (enforced by ESLint):

1. Side-effect imports (`import '@/styles.css'`)
2. Built-in Node modules (`node:fs`, `node:path`)
3. External packages (`react`, `zod`, `@tanstack/*`)
4. Internal aliases (`@/components/*`, `@/lib/*`, `@/server/*`)
5. Relative imports (avoid beyond one level)
6. Type-only imports (`import type { ... }`)

Separate groups with a blank line. Example:

```tsx
import '@/styles.css'

import { createFileRoute } from '@tanstack/react-router'
import * as z from 'zod'

import { Button } from '@/components/ui/button'

import type { CommonResponse } from '@/types'
```

---

## TanStack Start & Router Conventions

### File-Based Routing

Routes live in `src/routes/`. The file name determines the URL path. The generated route tree is in `src/routeTree.gen.ts` — **never edit this file**.

| Pattern                    | Meaning                                                                                     |
| -------------------------- | ------------------------------------------------------------------------------------------- |
| `__root.tsx`               | Root layout, wraps all routes                                                               |
| `index.tsx`                | Index route (exact match for parent path)                                                   |
| `$param.tsx`               | Dynamic segment (`$param` becomes a route param)                                            |
| `$.tsx`                    | Splat / catch-all route                                                                     |
| `_layout.tsx`              | Pathless layout (groups children without adding a URL segment)                              |
| `posts.tsx` + `posts/` dir | Layout route with nested children                                                           |
| `.` in filename            | Nesting separator (flat routes): `posts.$postId.tsx` → `/posts/$postId`                     |
| `_` suffix on dir          | Layout escape: `posts_/$postId/edit.tsx` → `/posts/$postId/edit` without the `posts` layout |

### Route Definition (Pages)

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/path')({
  component: MyComponent,
  // Optional:
  loader: () => fetchData(),
  head: () => ({ meta: [{ title: 'Page Title' }] }),
  server: {
    middleware: [authMiddleware],
  },
})

function MyComponent() {
  return <div>...</div>
}
```

### Server Routes (API Endpoints)

Server routes use `server.handlers` and return `Response` objects:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/example')({
  server: {
    middleware: [optionalMiddleware], // Applied to all handlers
    handlers: {
      GET: async ({ request }) => {
        return new Response(JSON.stringify({ ok: true }), {
          headers: { 'Content-Type': 'application/json' },
        })
      },
      POST: async ({ request }) => {
        const body = await request.json()
        return new Response('Created', { status: 201 })
      },
    },
  },
})
```

### Server Functions

Use `createServerFn` for server-only logic callable from anywhere (loaders, components, hooks):

```tsx
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

// GET (default)
export const getData = createServerFn().handler(async () => {
  return { message: 'Hello from server' }
})

// POST with Zod validation
export const createItem = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ name: z.string().min(1) }))
  .handler(async ({ data }) => {
    // data is typed and validated
    return { id: '1', name: data.name }
  })
```

#### File Organization for Server Functions

```
src/features/
├── users.functions.ts   # createServerFn wrappers (safe to import anywhere)
├── users.server.ts      # Server-only helpers (DB queries) — only import inside handlers
└── users.schema.ts      # Shared Zod schemas (client-safe)
```

### Middleware

Two types exist: **request middleware** (all server requests) and **server function middleware** (server functions only).

```tsx
import { createMiddleware } from '@tanstack/react-start'

// Request middleware (applies to routes, SSR, server functions)
export const loggingMiddleware = createMiddleware().server(
  async ({ next, context }) => {
    console.log('Request received')
    return await next()
  },
)

// Server function middleware (has .client() and .inputValidator())
export const workspaceMiddleware = createMiddleware({ type: 'function' })
  .inputValidator(z.object({ workspaceId: z.string() }))
  .server(async ({ next, data }) => {
    console.log('Workspace:', data.workspaceId)
    return next()
  })
```

Attach middleware to routes via `server.middleware`:

```tsx
export const Route = createFileRoute('/protected')({
  server: {
    middleware: [authMiddleware],
  },
  component: ProtectedPage,
})
```

#### Global Middleware

Create `src/start.ts` to apply middleware to **every request**:

```tsx
import { createStart } from '@tanstack/react-start'

export const startInstance = createStart(() => ({
  requestMiddleware: [globalRequestMiddleware],
  functionMiddleware: [globalServerFnMiddleware],
}))
```

### Root Route (`__root.tsx`)

Uses `shellComponent` (not `component`) for the HTML shell. Includes `<HeadContent />` and `<Scripts />`:

```tsx
export const Route = createRootRoute({
  head: () => ({
    meta: [{ charSet: 'utf-8' }, { name: 'viewport', content: '...' }],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
```

### Router Factory

Located at `src/router.tsx`. Uses `scrollRestoration: true` and `defaultPreloadStaleTime: 0`:

```tsx
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  })
  return router
}
```

---

## Better Auth

### Server Instance (`src/server/lib/auth/client.ts`)

```tsx
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin } from 'better-auth/plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg' }),
  emailAndPassword: { enabled: true },
  plugins: [admin(), tanstackStartCookies()],
})
```

Key points:

- `tanstackStartCookies()` plugin is **required** for TanStack Start integration.
- Cookie cache is enabled with 5-minute TTL.
- Rate limiting is enabled (10 req/60s, memory storage).

### React Client (`src/lib/auth/client.ts`)

```tsx
import { createAuthClient } from 'better-auth/react'
import { adminClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  plugins: [adminClient()],
})
```

Use hooks from `authClient` in components: `authClient.useSession()`, `authClient.signIn.email()`, etc.

### Auth API Route (`src/routes/api/auth/$.ts`)

The catch-all `$.ts` splat route forwards all `/api/auth/*` requests to Better Auth:

```tsx
export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }) => await auth.handler(request),
      POST: async ({ request }) => await auth.handler(request),
    },
  },
})
```

### Auth Middleware (`src/middleware/auth.ts`)

```tsx
import { createMiddleware } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const headers = getRequestHeaders()
  const session = await auth.api.getSession({ headers })
  if (!session) throw redirect({ to: '/sign-in' })
  return await next()
})
```

---

## Drizzle ORM

### Client (`src/server/lib/db/client.ts`)

Uses `node-postgres` (`pg`) with connection pooling:

```tsx
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const pool = new Pool({ connectionString: env.DATABASE_URL })
export const db = drizzle({ client: pool, schema, logger: isDevelopment })
```

### Schema Conventions

- Schemas live in `src/server/lib/db/schema/`.
- Re-export from `schema/index.ts` (this is the **only** barrel export in the project — avoid barrel exports elsewhere).
- Use `pgTable` from `drizzle-orm/pg-core`.
- Define Drizzle `relations` alongside tables.
- Use **UUID v7** for primary keys — generate with `v7()` from the `uuid` package and use the `uuid` column type:
  ```ts
  import { v7 } from "uuid";
  id: uuid("id").primaryKey().$defaultFn(() => v7()),
  ```
  > **Note:** Better Auth tables (`auth.ts`) use `text("id")` with Better Auth's own ID generation — do not change those.
- Column names use **snake_case** in the database, **camelCase** in TypeScript.
- Always add indexes on foreign key columns.

### Adding New Tables

```tsx
// src/server/lib/db/schema/posts.ts
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { user } from './auth'

export const post = pgTable('post', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  authorId: text('author_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

export const postRelations = relations(post, ({ one }) => ({
  author: one(user, {
    fields: [post.authorId],
    references: [user.id],
  }),
}))
```

Then add to `schema/index.ts`:

```tsx
export * from './auth'
export * from './posts'
```

---

## Environment Variables

Validated at startup via Zod in `src/server/lib/config/env.ts`:

```tsx
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(5000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  DATABASE_URL: z.string().min(1),
})
```

When adding new env vars:

1. Add to the Zod schema in `env.ts`
2. Add to `.env` and `.env.example`

---

## Logging (Pino)

The project uses **Pino** for structured server-side logging. The singleton logger lives at `src/server/lib/logger.ts`.

- **Log level** is controlled by the `LOG_LEVEL` env var (`debug`, `info`, `warn`, `error` — default `info`)
- **Development**: uses `pino-pretty` transport for human-readable, colorized output
- **Production**: outputs structured JSON logs (no transport)

### Usage

```ts
import { logger } from '@/server/lib/logger'

logger.info('Server started')
logger.info({ userId: '123' }, 'User signed in')
logger.error(error, 'Failed to process request')
```

### Child Loggers

Use child loggers to add persistent context (e.g., per-request or per-module):

```ts
const log = logger.child({ module: 'billing' })
log.info('Invoice created') // includes { module: 'billing' } in every log
```

> **Do NOT use `console.log` / `console.error`** in server code — always use the pino logger.

---

## Styling & Theming

### TailwindCSS v4

- Global styles in `src/styles.css`
- Imports: `@import 'tailwindcss'`, `@import 'tw-animate-css'`, `@import 'shadcn/tailwind.css'`
- Uses `@theme inline` for design tokens (no `tailwind.config.js`)
- Dark mode via `@custom-variant dark (&:is(.dark *))`
- Color system uses **oklch** color space
- Font: `Inter Variable` (via `@fontsource-variable/inter`)

### shadcn/ui

- Style: `base-nova`
- Icon library: `lucide-react`
- Components installed to `src/components/ui/`
- Uses `class-variance-authority` (CVA) for variants
- `cn()` utility at `src/lib/utils.ts`

#### Adding Components

```bash
npx shadcn@latest add button
npx shadcn@latest add card dialog
```

> Do NOT manually write shadcn components. Always install via CLI or use the shadcn MCP.

---

## Zod

This project uses **Zod v4**. Key differences from v3:

- Use `z.object()` (same API, improved performance)
- `z.coerce.number()` for string-to-number coercion
- Better error messages by default
- Use `.inputValidator(zodSchema)` directly (TanStack Start natively supports Zod)

---

## Forms (React Hook Form)

Use **React Hook Form** for all form state management. Pair with Zod for validation and shadcn/ui `Field` components for UI.

### Basic Pattern

```tsx
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@/lib/validator/zod-resolver'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
})

type FormValues = z.infer<typeof formSchema>

function CreateUserForm() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(data: FormValues) {
    await createUser({ data })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldGroup>
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error || undefined}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input id="name" {...field} />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error || undefined}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" {...field} />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </Button>
    </form>
  )
}
```

### Conventions

- Define form schemas as **Zod objects** — co-locate with the form or in a shared `.schema.ts` file
- Use `zodResolver` from `@/lib/validator/zod-resolver` for validation
- **Prioritize `Controller`** for all inputs — it provides consistent control via `field` props and works with both native and custom components
- Type form values with `z.infer<typeof schema>` — never manually define form types
- Submit via `createServerFn` for server-side actions

---

## React Conventions

### React 19 + React Compiler

- React Compiler is enabled via `babel-plugin-react-compiler` in `vite.config.ts`
- **Do NOT use `useMemo`, `useCallback`, or `React.memo`** — the compiler handles memoization automatically
- Use React 19 features: `use()`, `useActionState()`, `useOptimistic()`, server components patterns

### Component Patterns

- Use **named function declarations** for components (not arrow functions):

```tsx
// ✅ Preferred
function UserCard({ user }: { user: User }) {
  return <div>{user.name}</div>
}

// ❌ Avoid
const UserCard = ({ user }: { user: User }) => {
  return <div>{user.name}</div>
}
```

---

## Vite Plugins (Order Matters)

```tsx
plugins: [
  devtools(), // TanStack Devtools
  nitro(), // Nitro server runtime
  viteTsConfigPaths(), // Path alias resolution
  tailwindcss(), // TailwindCSS v4
  tanstackStart(), // TanStack Start file-based routing + SSR
  viteReact({
    // React + React Compiler
    babel: { plugins: ['babel-plugin-react-compiler'] },
  }),
]
```

---

## Best Practices Summary

1. **Server code stays in `src/server/`** — never import server modules in client code directly
2. **Use `createServerFn`** for any server-side logic called from client code
3. **Validate everything** — use Zod for inputs, env vars, and form data
4. **Use middleware for auth** — attach `authMiddleware` to protected routes via `server.middleware`
5. **Never edit auto-generated files** — `routeTree.gen.ts`, `shadcn/ui` components
6. **Use `@/` path alias** — never relative imports beyond one level
7. **No barrel exports** — import directly from source files. The only exception is `schema/index.ts` which re-exports all Drizzle schemas
8. **Snake_case DB columns, camelCase TS** — Drizzle handles the mapping via column name strings
9. **No manual memoization** — React Compiler handles it
10. **Prefer shadcn/ui first** — use existing components and theme colors (`primary`, `secondary`, `muted`, `destructive`, etc.) before creating custom ones
11. **Use `pnpm`** — the project is configured for pnpm only
