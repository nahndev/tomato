# Tomato Form

Next.js + NestJS monorepo (pnpm workspaces + Turborepo), TypeScript, Zod, Prisma, Tailwind 4 + shadcn/ui, axios.

## Commands

- `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test` (run through Turborepo)

## Conventions (mandatory)

@CONTRIBUTING.md

## Reference (read when needed)

- Tech stack, folder structure, running the project, shared packages, Tailwind setup, error handling: `README.md`

## Skills

- Add a new business module: `/module`
- Add a new shared package (`@tomato/<name>`): `/package`
- Set up Tailwind 4 / add theme tokens: `/tailwind`
- Create a ticket (create only, do not implement): `/ticket`
- Cut a release (archive changelogs, bump versions): `/release`
