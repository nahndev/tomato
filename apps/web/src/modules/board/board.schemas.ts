import type { BoardColumn } from "@tomato/types";
import { z } from "zod";

export const createBoardSchema = z.object({
  name: z.string().trim().min(1).max(100),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;

export interface UpdateBoardInput {
  name?: string;
  columns?: BoardColumn[];
  templateIds?: string[];
}
