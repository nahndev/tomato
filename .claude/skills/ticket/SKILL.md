---
name: ticket
description: Create a new ticket file using the standard layout in docs/<version>/. Use when asked to create a ticket; create only, do not implement.
---

# Create a ticket

## Rules

1. Create the file at `./docs/<version>/<ticket>.md` (`<ticket>` is `kebab-case`).
2. `<version>` comes from the root `package.json`.
3. Only create the ticket; **do not** work on/implement it.
4. Based on the title, fill in only the `Currently` section (the important one); leave the others empty.
5. After creating it, open the file with the `code` command.

## Layout

1. **Title** — short summary (one line, imperative)
2. **Currently** — context, reason, goal, mockups/references
3. **Acceptance Criteria** — definition of done (checklist or Given-When-Then)
4. **Solutions** — technical assessment, risks, implementation approach, technical/architecture design (or UI/UX if applicable)

## Template

File: `./docs/v1.0.0/improve-choice.md`

```markdown
# Title

## Currently

## Acceptance Criteria

- [ ]
- [ ]
- [ ]

## Solutions

- [ ]
- [ ]
- [ ]
```
