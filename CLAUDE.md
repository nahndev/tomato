# Tomato Form

Next.js + NestJS monorepo (pnpm workspaces + Turborepo), TypeScript, Zod, Prisma, Tailwind 4 + shadcn/ui, axios.

## Rules - MUST APPLY IT, HIGHEST PRIORITY

- Must apply rules in `./RULE.md`

## Commands

- `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm lint`, `pnpm typecheck`, `pnpm test` (run through Turborepo)

## Reference (read when needed)

- Tech stack, folder structure, running the project, shared packages, Tailwind setup, error handling: `README.md`
- Shared formats/keys/Json column rules between apps (`@tomato/protocol`): `packages/protocol/README.md`. There is no `@tomato/utils`: helpers stay in their consumer.

## Skills

- Add a new business module: `/module`
- Add a new shared package (`@tomato/<name>`): `/package`
- Set up Tailwind 4 / add theme tokens: `/tailwind`
- Create a ticket (create only, do not implement): `/ticket`
- Cut a release (archive changelogs, bump versions): `/release`
- Commit pending changes (Conventional Commits): `/commit`
