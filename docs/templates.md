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
- Schemas: `@tomato/schemas` (`template.schemas.ts`). Types: `@tomato/types` (`Template`, `PaginatedResponse`).

## Web

- Route: `/workspace/templates` (`apps/web/src/app/workspace/templates/page.tsx`).
- Module: `apps/web/src/modules/templates` (`TemplateList`, `useTemplates`, `services/templates.service.ts`).
