# Project Structure (Next.js + NestJS Monorepo)

## 1. Tech Stack

- Language: TypeScript
- Frontend: Next.js, tailwind 4, shadcn/ui, zustand, tanstack-query, clsx, axios
- Backend: NestJS, Prisma
- Validation: Zod
- Monorepo: pnpm workspaces + Turborepo

## 2. Overview

- Monorepo: **pnpm workspaces + Turborepo**
- `apps/`: runnable applications (web, api)
- `packages/`: libraries shared between modules
- `modules/` (optional): individual business modules, each may have its own web + api parts

```
.
├── apps/
│   ├── web/                    # Next.js (App Router)
│   │   └── src/
│   │       ├── app/            # routes
│   │       ├── modules/        # UI per business module
│   │       │   └── <module>/
│   │       │       ├── components/
│   │       │       ├── hooks/
│   │       │       ├── services/
│   │       │       └── index.ts
│   │       └── shared/         # web-only code (e.g. lib/api-client.ts — axios instance)
│   └── api/                    # NestJS
│       └── src/
│           ├── modules/
│           │   └── <module>/
│           │       ├── <module>.module.ts
│           │       ├── <module>.controller.ts
│           │       ├── <module>.service.ts
│           │       ├── <module>.repository.ts
│           │       ├── dto/
│           │       ├── entities/
│           │       └── <module>.constants.ts
│           ├── common/         # guard, filter, interceptor, pipe (HttpExceptionFilter, ZodValidationPipe)
│           └── main.ts
├── packages/
│   ├── constants/              # shared constants (error code, ...)
│   ├── types/                  # types/interfaces shared by FE + BE
│   ├── schemas/                # zod schemas (shared validation)
│   ├── utils/                  # pure utility functions
│   ├── ui/                     # shared UI components (shadcn/ui)
│   ├── tailwind-config/        # Tailwind 4 theme (theme.css, base.css)
│   ├── eslint-config/
│   └── tsconfig/
├── changelogs/                 # tickets: <name>.md
├── docs/
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## 3. Running the Project

```bash
pnpm install
pnpm dev        # web (http://localhost:3000) + api (http://localhost:3001/api)
pnpm build
pnpm lint
pnpm typecheck
pnpm test
```

- Scripts run through Turborepo; `packages/*` are built (tsup → `dist/`) before the apps use them.
- Database (api): `docker compose up -d` starts PostgreSQL; copy `apps/api/.env.example` → `apps/api/.env` (`DATABASE_URL`), then `pnpm migrate` (dev migration; `pnpm --filter @tomato/api migrate:deploy` in production). `pnpm generate` regenerates the Prisma client in `apps/api/src/generated` (gitignored); it also runs on install/build/dev.
- Web environment variables: copy `apps/web/.env.example` → `apps/web/.env.local` (`NEXT_PUBLIC_API_URL`).
- The api listens on `PORT` (default `3001`) with the `/api` prefix, e.g. `GET /api/health`. Swagger UI is served at `/api/docs`.

## 4. Shared Packages

- `@tomato/constants`: constants, error codes
- `@tomato/types`: types/interfaces
- `@tomato/schemas`: Zod schemas + inferred types
- `@tomato/utils`: pure functions
- `@tomato/ui`: React components
- `@tomato/grid`: 8-column drag/resize grid layout (`ContainerLayout`, `LayoutIdx`)
- `@tomato/tailwind-config`: Tailwind 4 theme
- `@tomato/eslint-config`, `@tomato/tsconfig`: lint / tsconfig presets

Using Tailwind in an app:

```css
/* apps/web/src/app/globals.css */
@import '@tomato/tailwind-config';
@source '../../../../packages/ui/src';
@source '../../../../packages/grid/src';
```

Add tokens in `packages/tailwind-config/theme.css`:

```css
@theme {
  --color-brand: oklch(0.62 0.21 25);
}
```

- Colors use Tailwind's own palette: `slate` (neutral), `teal` (brand), `green` / `amber` / `rose` / `blue` (status). To rebrand, change the `--color-primary*` lines in `theme.css`.
- `@theme static`: semantic tokens that differ per mode (`background`, `border`, `primary`, `card`...), status solids, radius, shadow, motion.
- `@theme inline`: tokens derived from the ones above (`hover`, `selected`, `success-soft`...). They must only reference `@theme static` tokens, not other inline tokens.
- Dark mode: add the `dark` class to an ancestor (e.g. `<html>`); `.dark` in `theme.css` overrides the mode-dependent tokens.
- Components compose utilities from `base.css`: `surface-*` (canvas, card, popover, overlay, muted, sunken, field), `variant-*` (solid, soft, outline, ghost) × `tone-*` (neutral, primary, success, warning, danger, info), plus `focus-ring`, `disabled-effect`, `motion-base`.

## 5. Error Handling

- The `ErrorCode` object is declared in `@tomato/constants`. The api returns only `code`; display messages are defined by each app per `code` (no hard-coded messages in the api or shared packages).
- The api returns errors as `ApiErrorResponse` (`@tomato/types`): `{ error: { code, details? } }`, produced by `HttpExceptionFilter`. Currently `code` is derived from the HTTP status (`HttpStatusErrorCode`).
- Validate input with schemas from `@tomato/schemas` via `ZodValidationPipe`; validation errors are in `error.details`.
- Web: `shared/lib/api-client.ts` exports the axios instance `apiClient` and `getApiError(error)` to read `ApiError` from an axios error.
