# Templates

CRUD for form templates. Stored in PostgreSQL through Prisma (`TemplatesRepository` is the only place that touches the DB).

## API (`/api/templates`)

| Method | Path             | Body                         | Response                    |
| ------ | ---------------- | ---------------------------- | --------------------------- |
| GET    | `/templates`     | query: `page`, `pageSize`    | `PaginatedResponse<Template>` |
| GET    | `/templates/:id` |                              | `Template`                  |
| POST   | `/templates`     | `CreateTemplateInput`        | `Template`                  |
| PATCH  | `/templates/:id` | `UpdateTemplateInput`        | `Template`                  |
| DELETE | `/templates/:id` |                              | `204`                       |

- `:id` is a uuid (`templateIdSchema`); invalid input → `400 VALIDATION_FAILED`, unknown id → `404 NOT_FOUND`.
- `previewImageUrl` (optional url or path) is stored in `preview_image_url` and shown on the template card.
- `categoryId` (optional uuid) links a template to a `TemplateCategory`; when omitted on create, the default category (`is_default`, seeded as "Draft") is used.
- Schemas: `@tomato/schemas` (`template.schemas.ts`). Types: `@tomato/types` (`Template`, `PaginatedResponse`).

## Categories API (`/api/template-categories`)

| Method | Path                   | Response             |
| ------ | ---------------------- | -------------------- |
| GET    | `/template-categories` | `TemplateCategory[]` |

- Table `template_categories` (`id`, `name` unique, `color`, `is_default`); the default category is pinned first.

## Web

- Route: `/workspace/templates` (`apps/web/src/app/workspace/templates/page.tsx`).
- Module: `apps/web/src/modules/template-browse` (`TemplateList`, `TemplateCategories`, `useTemplates`, `useTemplateCategories`, `services/`)
- Layout: `<categories 1fr> <list 1fr> <preview 25em>`. Categories panel is a single list ("All templates" + every category); selecting one filters the list.
