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
- `constants`, `types`, `schemas`, `utils` **must not** depend on any framework.
- `ui`, `tailwind-config` are for web only.
- Modules are imported only through `index.ts` or a shared package.
- Create a new package only when it has ≥ 2 consumers.

## Shadcn/UI

- MUST using `pnpm dlx shadcn@latest add`

## Branch & Commit

- Branch: `feat/…`, `fix/…`, `chore/…`
- Commit: Conventional Commits

## Coding Rules

- MUST working on `master`, don't checkout new branch
- MUST use `as const` constants instead of `enum`
- MUST define shared validation once in `@tomato/schemas` (zod); DTOs reuse these schemas
- MUST use error codes from `@tomato/constants` for returned errors
- MUST NestJS: controllers only receive/return data, logic in services, DB access in repositories
- MUST expose modules only through `index.ts`
- MUST comment only when truly necessary
- MUST keep comments as short as possible

- MUST NOT hard-code error messages
- MUST NOT import internal files of another module
- MUST NOT call the API directly in Next.js components; go through `services/` (using the axios instance in `shared/lib`)

- SHOULD put shared constants in `@tomato/constants`
- SHOULD put module-specific constants in `<module>.constants.ts`
- SHOULD default to Server Components in Next.js; use `'use client'` only when needed
