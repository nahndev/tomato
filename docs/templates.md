# Templates

CRUD for form templates. Stored in PostgreSQL through Prisma (`TemplatesRepository` is the only place that touches the DB).

## API (`/rest/templates`)

| Method | Path             | Body                         | Response                    |
| ------ | ---------------- | ---------------------------- | --------------------------- |
| GET    | `/templates`     | query: `page`, `pageSize`    | `PaginatedResponse<Template>` |
| GET    | `/templates/:id` |                              | `Template`                  |
| POST   | `/templates`     | `CreateTemplateInput`        | `Template`                  |
| PATCH  | `/templates/:id` | `UpdateTemplateInput`        | `Template`                  |
| DELETE | `/templates/:id` |                              | `204`                       |

- `:id` is a uuid (`ParseUUIDPipe`); invalid input → `400 VALIDATION_FAILED`, unknown id → `404 NOT_FOUND`.
- `previewImageUrl` (optional url or path) is stored in `preview_image_url` and shown on the template card.
- `categoryId` (optional uuid) links a template to a `TemplateCategory`; when omitted on create, the default category (`is_default`, seeded as "Draft") is used.
- DTOs: `dto/create-template.dto.ts`, `dto/update-template.dto.ts` (class-validator). Types: Prisma `Template`, `PaginatedResponse` (`common/api.types.ts`).

## Categories API (`/rest/template-categories`)

| Method | Path                   | Response             |
| ------ | ---------------------- | -------------------- |
| GET    | `/template-categories` | `TemplateCategory[]` |

- Table `template_categories` (`id`, `name` unique, `color`, `is_default`); the default category is pinned first.

## Web

- Route: `/system/templates` (`apps/web/src/app/system/templates/page.tsx`).
- Module: `apps/web/src/modules/template` (`TemplateList`, `TemplateCategories`, `useTemplates`, `useTemplateCategories`, `services/`). It is also the template data source for other modules: exports `useTemplates`, `useTemplateVersions` (GET versions) and `usePublishTemplate` (POST versions); the `Template` / `TemplateVersion` types are in `shared/types/template.types.ts`.
- Layout: `<categories 1fr> <list 1fr> <preview 25em>`. Categories panel is a single list ("All templates" + every category); selecting one filters the list.

## Editor

- `/templates/[id]` opens the realtime editor, and `/rest/templates/:id/versions` lists versions: see [template-editor.md](./template-editor.md).
