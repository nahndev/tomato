# Contributing

## Naming Convention

- Files & folders:
  - Folders: `kebab-case`
  - Regular files: `kebab-case`
  - React component: `kebab-case.tsx` (the exported component stays `PascalCase`)
  - Hook: `use-xxx.ts`
  - NestJS file: `<name>.<type>.ts`
  - Test: `<name>.spec.ts` / `<name>.test.tsx`
  - Constant file: `<name>.constants.ts`
  - Type file: `<name>.types.ts`
- Code:
  - Variables, functions: `camelCase`
  - Class, Component, Type: `PascalCase`
  - Single-value constants (string, number, ...): `UPPER_SNAKE_CASE`
  - Object constants (`as const`, replacing enum): `PascalCase`, with the inferred type sharing the same name (`const Role` + `type Role`); keys stay `UPPER_SNAKE_CASE`
  - Boolean: prefix `is/has/can`
  - Environment variables: `UPPER_SNAKE_CASE`
  - Database table/column: `snake_case`
  - API route: `kebab-case`, plural

## Packages

- Name: `@tomato/<name>`
- `apps` → `packages` (one-way). `packages` **must not** import `apps`.
- `constants`, `utils` **must not** depend on any framework.
- There is no shared types package: every app declares the types it uses (envelopes, request/response, Json column shapes) in its own code, even when another app declares the same shape. Keep both sides in sync by hand when a contract changes.
- Records (entities, view models) stay in the app that owns them: backends use the Prisma-generated types (no serialization mappers), web declares its own in `<module>.types.ts`.
- `ui`, `tailwind-config` are for web only.
- Web modules are imported only through `index.ts` or a shared package. NestJS modules are exempt: import the `*.module.ts` and the providers it `exports` directly.
- Create a new package only when it has ≥ 2 consumers.

## Constants rules

- SHOULD use a constant for:
  - a value whose meaning it cannot show by itself (e.g. `MAX_PAGE_SIZE = 100`)
  - a configuration value
  - a fixed set of values, such as statuses, roles, ...
- MUST put shared constants in `@tomato/constants`
- MUST put module-specific constants in `<module>.constants.ts`

- MUST NOT use a constant for a normal descriptive string (label, description, ...), even when it is repeated
- MUST NOT use a constant for a value that already shows its content (e.g. `ZERO = 0`)
- MUST NOT use a constant for route name

## String rules

- For component should using `Typography`

## Enum rules

- MUST use `as const` constants instead of `enum`

## Error rules

- MUST use error codes from `@tomato/constants` for returned errors
- MUST use custom error instead general error

- MUST NOT hard-code error messages for backend

## Comment rules

- MUST remove comment if code is clean.
- MUST remove comment only for explain.
- MUST comment only when truly necessary.
- MUST keep comment as short as possible.
- MUST NOT use this for self-explanatory values, such as the names of keys (Enter, Space, etc.).

## UI rules

- MUST using `shadcn/ui`
- MUST using `pnpm dlx shadcn@latest add`

## Branch & Commit

- Branch: `feat/…`, `fix/…`, `chore/…`
- Commit: Conventional Commits

## Coding Rules

- MUST working on `master`, don't checkout new branch
- MUST NestJS: validate request input with DTO classes + `class-validator`; web defines its own zod schemas when needed
- MUST NestJS: controllers only receive/return data, logic in services, DB access in repositories
- MUST expose web modules only through `index.ts` (NestJS modules are exempt)

- MUST NOT import internal files of another web module (NestJS modules are exempt)
- MUST NOT call the API directly in Next.js components; go through `services/` (using the axios instance in `shared/lib`)
- SHOULD default to Server Components in Next.js; use `'use client'` only when needed
- MUST share React state through `createStoreContext` (`@tomato/store-context`), not `createContext`; read it with selectors (shadcn/ui components are exempt)

## Coding rules - backend
