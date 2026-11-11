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

- MUST extract it as a constant if it is truly a fixed value.
- MUST put shared constants in `@tomato/constants`
- MUST put module-specific constants in `<module>.constants.ts`

- MUST NOT using constant for route name

## Enum rules

- MUST use `as const` constants instead of `enum`

## Error rules

- MUST use error codes from `@tomato/constants` for returned errors
- MUST use custom error instead general error

- MUST NOT hard-code error messages for backend

## Comment rules

- MUST comment only when truly necessary
- MUST keep comment as short as possible
- MUST NOT comment for explain
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

## Coding rules - backend
