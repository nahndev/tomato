import { GRID_COLUMNS } from "@tomato/grid";
import type { GridLayout } from "@tomato/types";
import { z } from "zod";
import type { WidgetPlacement } from "../handlers/layout-handler";

/** Grid fields in the vocabulary of the copilot tools; omitted fields keep the current (or default) value. */
export const widgetLayoutInput = z.object({
  column: z
    .number()
    .int()
    .min(0)
    .max(GRID_COLUMNS - 1)
    .optional()
    .describe(`First column the widget covers, 0 to ${GRID_COLUMNS - 1}.`),
  span: z
    .number()
    .int()
    .min(1)
    .max(GRID_COLUMNS)
    .optional()
    .describe(
      `How many columns the widget covers, 1 to ${GRID_COLUMNS}; column + span must not exceed ${GRID_COLUMNS}.`,
    ),
  fullWidth: z.boolean().optional().describe("Cover the whole row; column and span are then ignored."),
});

export type WidgetLayoutInput = z.infer<typeof widgetLayoutInput>;

/** An `Error: ...` sentence when the layout would not fit the grid, otherwise `null`. */
export function findLayoutError(input: WidgetLayoutInput, current: Omit<GridLayout, "idx">): string | null {
  const isFullWidth = input.fullWidth ?? current.isFullWidth ?? false;
  if (isFullWidth) return null;

  const column = input.column ?? current.column;
  const span = input.span ?? current.span;
  if (column + span <= GRID_COLUMNS) return null;
  return `Error: column ${column} + span ${span} exceeds the ${GRID_COLUMNS} columns of the grid.`;
}

/** Only the fields the model gave, so the rest of the layout is not overwritten with `undefined`. */
export function toPlacementLayout(input: WidgetLayoutInput): WidgetPlacement["layout"] {
  return {
    ...(input.column !== undefined && { column: input.column }),
    ...(input.span !== undefined && { span: input.span }),
    ...(input.fullWidth !== undefined && { isFullWidth: input.fullWidth }),
  };
}
