"use client";

import { Button, Input, Spinner, toast } from "@tomato/ui";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { useUnitTypes } from "../../hooks/use-unit-types";
import { useUnits } from "../../hooks/use-units";
import { UnitFormDialog } from "./unit-form-dialog";
import { UnitRow } from "./unit-row";

export function UnitManager() {
  const { units, isLoading, hasError, add, edit, remove } = useUnits();
  const { types } = useUnitTypes();
  const [query, setQuery] = useState("");

  const visibleUnits = units.filter((unit) => unit.name.toLowerCase().includes(query.toLowerCase()));

  async function handleDelete(id: string) {
    try {
      await remove(id);
    } catch {
      toast.error("Could not delete the unit");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-xs">
          <SearchIcon
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.75}
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search..."
            aria-label="Search units"
            className="border-transparent bg-card pl-10 shadow-card"
          />
        </div>
        <UnitFormDialog types={types} onSubmit={add}>
          <Button>
            <PlusIcon className="size-4" strokeWidth={2} />
            New unit
          </Button>
        </UnitFormDialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Spinner />
        </div>
      ) : hasError ? (
        <p className="text-sm text-muted-foreground">Could not load the units.</p>
      ) : visibleUnits.length === 0 ? (
        <p className="text-sm text-muted-foreground">{units.length === 0 ? "No units yet." : "No unit matches."}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {visibleUnits.map((unit) => (
            <UnitRow key={unit.id} unit={unit} types={types} onEdit={edit} onDelete={handleDelete} />
          ))}
        </ul>
      )}
    </div>
  );
}
