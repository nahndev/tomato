# Add Swagger doc for API

## Currently

- The NestJS API (`apps/api`) has no API documentation; `@nestjs/swagger` is not installed or configured.
- Endpoints, request/response shapes and error codes can only be discovered by reading the source.

## Acceptance Criteria

- [x] Support swagger document for api
- [ ]
- [ ]

## Solutions

- [x] Add packages (`@nestjs/swagger`)
- [x] Add new router for api swagger access (`GET /api/docs`, JSON at `/api/docs-json`)
- [ ]
