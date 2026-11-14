---
name: commit
description: Commit pending changes on master as Conventional Commits, split into logical commits by scope. Use when asked to commit.
---

# Commit

## Steps

1. Verify base on `/RULE.md`
2. Review all changes: `git status`, `git diff`, `git diff --staged`.
3. Group the changes into logical commits; if the user named specific files or scope, commit only those.
4. For each group: stage its paths, then commit with the message from rule 2. Add a body only when the reason is not obvious from the summary.
5. Run `git status` to confirm the tree is clean (or only holds intentionally excluded files).

## Report

List each commit as `<hash> <message>` and any files left uncommitted with the reason.
