import { z } from "zod";
import {
  DOCUMENT_CONTENT_MAX_LENGTH,
  DOCUMENT_TITLE_MAX_LENGTH,
} from "./documents.constants";

export const documentSchema = z.object({
  title: z.string().trim().min(1).max(DOCUMENT_TITLE_MAX_LENGTH),
  content: z.string().max(DOCUMENT_CONTENT_MAX_LENGTH),
  ownerId: z.uuid(),
});

export type DocumentInput = z.infer<typeof documentSchema>;
export type DocumentUpdateInput = Pick<DocumentInput, "title" | "content">;
