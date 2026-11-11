import { useState } from "react";
import type { StorageFile } from "../storage.types";

export function useFileSelection(value: StorageFile[], isMultiple: boolean) {
  const [selectedIds, setSelectedIds] = useState(() =>
    value.map(({ id }) => id),
  );
  const [syncedValue, setSyncedValue] = useState(value);
  if (value !== syncedValue) {
    setSyncedValue(value);
    setSelectedIds(value.map(({ id }) => id));
  }

  function toggleSelected(id: string) {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter((selectedId) => selectedId !== id);
      }
      return isMultiple ? [...current, id] : [id];
    });
  }

  return {
    selectedIds,
    toggleSelected,
    clearSelection: () => setSelectedIds([]),
  };
}
