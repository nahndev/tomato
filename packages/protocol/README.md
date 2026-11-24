# @tomato/protocol

The rules every app (web, api, collab, storage, ...) must follow the same way: string formats, keys, ids and the operations on shared Json columns. The TypeScript code is one implementation of these rules; the spec below is the source of truth, so an app in another framework or language can implement the same rules and stay compatible.

## What belongs here

Add code here only when **all** of these are true:

1. **It is a shared meaning, not shared code.** Two apps must produce or read the *same* value (a name sent over the wire, a key stored in the database, a Json column both sides edit). If the apps would break when one side changes the rule alone, it belongs here.
2. **It does not depend on any app**: no imports from `apps/*`, no Prisma types, no NestJS, React, Next.js, Yjs or browser/Node-only API.
3. **It works in every framework and can be written in any language**: pure functions or small classes over plain values (`string`, `number`, plain objects/arrays). The rule must be describable in the spec below without TypeScript.

## What does not belong here

| Not here | Where it goes |
| --- | --- |
| Records that only look the same (an entity in api, a view model in web) | Each app declares its own (`RULE.md` → Packages) |
| Request/response types, DTOs, zod schemas | Each app |
| Constants (prefixes, separators, enums) | `@tomato/constants`; the functions here read them |
| Display formatting (`describeTimeAgo`, `formatBytes`, labels, locale text) | The app or package that renders it (`apps/web/src/shared/lib`, `@tomato/storage-ui`) |
| Generic helpers (`isDefined`, array/string utilities) | Inline, or the consumer's own `utils/` |
| A rule only one app needs to know (count the apps that share the meaning, not the importers: a Json column web writes and api validates is shared) | That app |

## Layout and naming

```text
src/
├── index.ts            # export * from './<domain>/<name>'; every file, sorted
├── <domain>/           # id, color, realtime, collab, submission, board, ...
│   ├── <name>.ts       # one key / value per file
│   └── <name>.spec.ts  # every rule has a test
```

- One folder per domain the contract belongs to; files follow `RULE.md` naming (`kebab-case`).
- `src/index.ts` is the only `index.ts`: it re-exports every file (`export * from './<domain>/<name>';`), no code, no renames. Domain folders have no `index.ts`. Consumers import only from `@tomato/protocol`.
- A key (a string other apps build or read: a name, room, refer, idempotency key) is a **stateless** class named after the key, singular (`SubmissionRefer`, like `UUID` or Google's `TopicName` with its `format` / `parse`), in `<key-name>.ts`:
  - `<Key>Parts`: the interface of its parts.
  - `static format(parts: <Key>Parts): string`.
  - `static parse(value: string): <Key>Parts | null`: `null` when the value is not of that format (never throws). `parse(format(parts))` gives back `parts`.
  - Consumers never `split` / `join` a key themselves.
- `normalize<Name>(value: unknown)`: returns the canonical form, or `null` when invalid.
- `generate<Name>()`: creates a new value.
- `<Owner><Column>s` (file `<owner>-<column>.ts`): a **stateless** class of static methods over one stored value, named after its meaning (the column), never after its storage (`Json...`). The plural keeps it apart from the record type each app declares (`BoardTaskSetting` in an app, `BoardTaskSettings` here), like `Arrays` / `Collections` in Java. No constructor, no instance, no fields: every method takes the value as its first argument (`setting` for the whole column, `entry` for one of its entries). Queries are `<thing>Of(value, key)`; transforms return a new value (`pick(setting, ...)`), never mutate the input.
- Every addition updates the **Spec** below.

## Spec

`<x>` is a placeholder, quoted strings are literal. Constants come from `@tomato/constants`.

### id: `generateId`

- An id is a lowercase UUID v7 string (`xxxxxxxx-xxxx-7xxx-[89ab]xxx-xxxxxxxxxxxx`), sortable by creation time.
- Same format as the database ids (`@default(uuid(7))`), so ids created by clients (widgets, sessions, columns, uploads) and by the database look alike.

### color: `normalizeHexColor`

- The canonical stored color is lowercase `#rrggbb` (alpha dropped).
- Input: any CSS color string (`#abc`, `#AABBCC`, `#aabbcc80`, `rgb(1, 2, 3)`, `red`). Anything else (non-string, empty, invalid) → `null`.
- Used by every reader and writer of a color (web form schemas, api validation, color pickers).

### realtime: `RealtimeRoomName`

- `<kind>:<id>` (`REALTIME_ROOM_SEPARATOR` = `:`), parts `{ kind, id }`, `<kind>` ∈ `RealtimeRoom` (`template`, `submission`).
- Parse: exactly two non-empty parts and a known kind; otherwise `null` (`board:a`, `submission:`, `submission:a:b` → `null`).
- Example: `submission:0193...`.

### collab: `TemplateDocumentName`, `SubmissionDocumentName`

- `template/<templateId>` (`TEMPLATE_DOCUMENT_PREFIX`), parts `{ templateId }`.
- `submission/<submissionId>` (`SUBMISSION_DOCUMENT_PREFIX`), parts `{ submissionId }`.
- Parse: exactly two `/`-separated parts, the right prefix and a non-empty id; otherwise `null` (`template`, `template/`, `template/a/b`, `submission/a` for a template → `null`).

### submission: `SubmissionRefer`, `SubmissionIdempotencyKey`

- `SubmissionRefer` (every dependency created by one widget of one source submission): `<sourceId>:<widgetId>` (`SUBMISSION_REFER_SEPARATOR` = `:`), parts `{ sourceId, widgetId }`. Parse: exactly two non-empty parts.
- `SubmissionIdempotencyKey` (one dependency of that refer for one target id): `<refer>:<id>`, parts `{ refer, id }`. Parse: split at the last `:`; `<id>` non-empty and `<refer>` a valid `SubmissionRefer`; otherwise `null`. A reader of one refer compares `parse(key)?.refer` with it.
- Ids inside these keys never contain `:` (they are UUIDs).

### board: `BoardTableSettings`, `BoardTaskSettings`, `BoardAgendaSettings`

Operations on the Json columns of a board (`table_setting`, `task_setting`, `agenda_setting`). Each setting is keyed by template id; keys of templates the board no longer links must be dropped.

- `BoardTableSettings` (`table_setting`): `setting` is a list of columns, each with `items: { <templateId>: ... }`.
  - `referencesOnly(setting, templateIds)`: `true` when every item key of every column is in `templateIds` (an empty setting → `true`).
  - `pick(setting, templateIds)`: keeps every column, removes the items of other templates.
- `BoardTaskSettings` (`task_setting`): `setting` is `{ <templateId>: entry }`, an `entry` is `{ conditions: [...], typeWidget, titleWidget, statusWidget, assigneeWidget }`.
  - `conditionsOf(setting, templateId)`: that template's `conditions`, or `[]`.
  - `pick(setting, templateIds)`: keeps only the entries of `templateIds`.
  - `widgetOf(entry, field)`: on one entry (or absent): the widget id stored at the fixed key of `field`, or `null` when not set. The keys are fixed, never derived from the field name:

    | `TaskField` | Key |
    | --- | --- |
    | `type` | `typeWidget` |
    | `title` | `titleWidget` |
    | `status` | `statusWidget` |
    | `assignee` | `assigneeWidget` |

  - `valuesOf(entry, changes)`: on one entry (or absent): turns task changes `{ <TaskField>?: value }` into the submission document values `{ <widgetId>: value }`, using `widgetOf` for each field; a field without a widget, or with an absent (`undefined`) value, is skipped.
- `BoardAgendaSettings` (`agenda_setting`): `setting` is `{ <templateId>: ... }`.
  - `pick(setting, templateIds)`: keeps only the entries of `templateIds`.
