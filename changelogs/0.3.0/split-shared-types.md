# Remove `packages/types`: every app declares its own types

## Currently

- [ ] Hiện tại các app đang phụ thuộc vào `package/types` gây ra các phụ thuộc không cần thiết, các service phải serialize dữ liệu lập đi lập lại.
- [ ] Một số record có thể cần ở front-end nhưng không cần ở backend
- [ ] Một số entity do prisma tạo ra không được tận dụng

## Acceptance Criteria

- [ ] Tổ chức lại `packages/types` thành `packages/share-types`, chỉ chia sẽ kiểu dữ liệu dùng chung giữa 2 dịch vụ
- [ ] Các kiểu dùng chung thường là kiểu của request, reponsive, các kiểu của json, ...
- [ ] Cập nhật lại các tài liệu liên quan để xác định packages này chỉ khai báo các giá trị mang tính chia sẻ giữa nhiều apps
- [ ] Tách phần kiểu dữ liệu mang ý nghĩa chỉ sử dụng trong app về trong code của chính app đó
- [ ] Việc phân biệt phải dựa trên ý nghĩa, không dựa trên việc hiện tại có nhiều app dùng chung kiểu đó
- [ ] Cập lại code backend để tận dụng các kiểu dữ liệu do prisma sinh ra.

## Solutions

- [x] Remove the shared types package: each app declares the envelopes (`ApiErrorResponse`, `PaginatedResponse`), request/query shapes (`StorageGroupLimit`, `SubmissionValueEntries`) and Json column shapes (`TemplateSnapshot`, `BoardColumn`, `MapValue`, `SubmissionDisplayDoc`) it uses, in the owning module (`common/` for envelopes, `shared/types/` in web when several modules use it)
- [x] Api / storage: return Prisma payloads (`include` / `select` / `omit`), drop the serialization mappers; Json columns are cast once in repositories; `bigint` serialized by a JSON replacer in storage
- [x] Web: records (`Department`, `User`, `Board`, …) in their module `*.types.ts`, storage records in `@tomato/storage-ui`; code follows the Prisma wire shape
- [x] Docs: `CONTRIBUTING.md`, `README.md`, skills, `docs/`
