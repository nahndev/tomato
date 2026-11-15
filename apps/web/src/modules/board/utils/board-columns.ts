import type { Board, BoardColumn } from "../board.types";

export function getBoardColumns({ tableColumns, templates }: Board): BoardColumn[] {
  return tableColumns.map((column) => ({
    ...column,
    items: Object.fromEntries(
      templates.flatMap(({ templateId, tableSetting }) => {
        const item = tableSetting?.items[column.id];
        return item ? [[templateId, item]] : [];
      }),
    ),
  }));
}
