"use client";

import { Button, DataState, Input, toast, Toaster, Typography } from "@tomato/ui";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { useMaps } from "../hooks/use-maps";
import { MapCard } from "./map-card";
import { MapFormDialog } from "./map-form-dialog";

export function MapList({ departmentId }: { departmentId: string }) {
  const { maps, isLoading, hasError, add, rename, remove } = useMaps(departmentId);
  const [query, setQuery] = useState("");

  const normalizedQuery = query.toLowerCase();
  const visibleMaps = maps.filter((map) =>
    map.name.toLowerCase().includes(normalizedQuery),
  );

  async function handleDelete(id: string) {
    try {
      await remove(id);
    } catch {
      toast.error("Could not delete the map");
    }
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-xs">
          <SearchIcon
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.75}
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search..."
            aria-label="Search maps"
            className="border-transparent bg-card pl-10 shadow-card"
          />
        </div>
        <MapFormDialog onSubmit={add}>
          <Button>
            <PlusIcon className="size-4" strokeWidth={2} />
            <Typography>New map</Typography>
          </Button>
        </MapFormDialog>
      </div>

      <DataState
        isLoading={isLoading}
        hasError={hasError}
        isEmpty={visibleMaps.length === 0}
        errorMessage="Could not load the maps."
        emptyMessage={maps.length === 0 ? "No maps yet." : "No map matches."}
      >
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-4">
          {visibleMaps.map((map) => (
            <MapCard key={map.id} map={map} onRename={rename} onDelete={handleDelete} />
          ))}
        </ul>
      </DataState>
      <Toaster />
    </div>
  );
}
