import type { Document, PaginatedResponse } from "@tomato/types";
import { apiClient } from "@/shared/lib/api-client";
import { DOCUMENT_LIST_PAGE_SIZE } from "../documents.constants";
import type {
  DocumentInput,
  DocumentUpdateInput,
} from "../documents.schemas";

const documentsUrl = (departmentId: string) =>
  `/departments/${departmentId}/documents`;

export async function listDocuments(
  departmentId: string,
): Promise<PaginatedResponse<Document>> {
  const { data } = await apiClient.get<PaginatedResponse<Document>>(
    documentsUrl(departmentId),
    { params: { pageSize: DOCUMENT_LIST_PAGE_SIZE } },
  );
  return data;
}

export async function createDocument(
  departmentId: string,
  input: DocumentInput,
): Promise<Document> {
  const { data } = await apiClient.post<Document>(
    documentsUrl(departmentId),
    input,
  );
  return data;
}

export async function updateDocument(
  departmentId: string,
  id: string,
  input: Partial<DocumentUpdateInput>,
): Promise<Document> {
  const { data } = await apiClient.patch<Document>(
    `${documentsUrl(departmentId)}/${id}`,
    input,
  );
  return data;
}

export async function deleteDocument(
  departmentId: string,
  id: string,
): Promise<void> {
  await apiClient.delete(`${documentsUrl(departmentId)}/${id}`);
}
