---
name: release
description: Cut a release <version> - archive changelogs into changelogs/<version> on a release-<version> branch, then bump versions on master. Use when asked to release/cut a version.
---

# Release

Input: `<version>` (semver without `v`, e.g. `0.2.0`). Ask for it if not given.

## Rules

1. Start from `master` with a clean working tree; stop and report if dirty.
2. Run the steps in order. Stop on the first failure; do not force anything.
3. This is the only flow allowed to leave `master` (the "work on master" rule in `CONTRIBUTING.md` does not apply here); always return to `master` at the end.
4. Commits are Conventional Commits.

## Steps

1. **Wrap changelogs** — create the branch and archive:
   - `git checkout -b release-<version>`
   - `mkdir -p changelogs/<version>`
   - `git mv` every file directly under `changelogs/` into `changelogs/<version>/`, except `.gitkeep` and existing version folders (move assets like `image.png` too, they are referenced relatively).
   - `git commit -m "chore(release): archive changelogs for <version>"`
   - `git push -u origin release-<version>`
2. **Return to master** — `git checkout master`.
3. **Bump version** — set `"version": "<version>"` in the root `package.json` (add the field if missing) and in every workspace `package.json` (`apps/*`, `packages/*`):
   - `git ls-files '*package.json'` lists them; edit only the `version` field, keep the rest and formatting untouched.
   - `git commit -m "chore(release): bump version to <version>"`
   - `git push`

## Report

State the branch name, the number of changelog files moved, the packages bumped and the commit hashes.
