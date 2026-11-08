---
name: commit
description: Commit pending changes on master as Conventional Commits, split into logical commits by scope. Use when asked to commit.
---

# Commit

## Rules

1. Stay on `master`; never create or switch branches (see `CONTRIBUTING.md`).
2. Messages follow Conventional Commits: `<type>(<scope>): <summary>`.
   - `type`: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `test`, `perf`.
   - `scope`: the module or package touched, `kebab-case` (e.g. `maps`, `storage-ui`, `canvas`, `api`). Omit it only for repo-wide changes.
   - `summary`: lowercase, imperative, no trailing period, ≤ 72 chars.
3. One logical change per commit. If the tree mixes unrelated changes, split them into several commits by scope/purpose.
4. Stage files explicitly (`git add <paths>`); never `git add -A` blindly. Do not commit secrets (`.env*`, credentials) or build output.
5. Do not amend, rebase, force, or push unless asked.
6. Hooks must pass; on failure fix the cause and create a new commit — never `--no-verify`.

## Steps

1. Review all changes: `git status`, `git diff`, `git diff --staged`.
2. Group the changes into logical commits; if the user named specific files or a scope, commit only those.
3. For each group: stage its paths, then commit with the message from rule 2. Add a body only when the reason is not obvious from the summary.
4. Run `git status` to confirm the tree is clean (or only holds intentionally excluded files).

## Report

List each commit as `<hash> <message>` and any files left uncommitted with the reason.
