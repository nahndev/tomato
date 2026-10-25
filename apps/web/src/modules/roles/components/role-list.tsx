"use client";

import { Button, Input, Spinner, Toaster, toast } from "@tomato/ui";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { useRoles } from "../hooks/use-roles";
import { RoleFormDialog } from "./role-form-dialog";
import { RoleRow } from "./role-row";

export function RoleList({ departmentId }: { departmentId: string }) {
  const { roles, isLoading, hasError, add, edit, remove } =
    useRoles(departmentId);
  const [query, setQuery] = useState("");

  const normalizedQuery = query.toLowerCase();
  const visibleRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(normalizedQuery),
  );

  async function handleDelete(id: string) {
    try {
      await remove(id);
    } catch {
      toast.error("Could not delete the role");
    }
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-6">
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
            aria-label="Search roles"
            className="border-transparent bg-card pl-10 shadow-card"
          />
        </div>
        <RoleFormDialog onSubmit={add}>
          <Button>
            <PlusIcon className="size-4" strokeWidth={2} />
            New role
          </Button>
        </RoleFormDialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Spinner />
        </div>
      ) : hasError ? (
        <p className="text-sm text-muted-foreground">
          Could not load the roles.
        </p>
      ) : visibleRoles.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {roles.length === 0 ? "No roles yet." : "No role matches."}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {visibleRoles.map((role) => (
            <RoleRow
              key={role.id}
              role={role}
              onEdit={edit}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
      <Toaster />
    </div>
  );
}
