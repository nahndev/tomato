"use client";

import { Button, DataState, Input, toast, Toaster, Typography } from "@tomato/ui";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { useRoles } from "../hooks/use-roles";
import { RoleDrawer } from "./role-drawer";
import { RoleFormDialog } from "./role-form-dialog";
import { RoleRow } from "./role-row";

export function RoleList({ departmentId }: { departmentId: string }) {
  const { roles, isLoading, hasError, add, edit, remove } =
    useRoles(departmentId);
  const [query, setQuery] = useState("");
  const [openRoleId, setOpenRoleId] = useQueryState("role", {
    history: "push",
  });

  const normalizedQuery = query.toLowerCase();
  const visibleRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(normalizedQuery),
  );

  async function handleDelete(id: string) {
    try {
      await remove(id);
      void setOpenRoleId(null);
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
            <Typography>New role</Typography>
          </Button>
        </RoleFormDialog>
      </div>

      <DataState
        isLoading={isLoading}
        hasError={hasError}
        isEmpty={visibleRoles.length === 0}
        errorMessage="Could not load the roles."
        emptyMessage={roles.length === 0 ? "No roles yet." : "No role matches."}
      >
        <ul className="flex flex-col gap-2">
          {visibleRoles.map((role) => (
            <RoleRow
              key={role.id}
              role={role}
              onOpen={(id) => void setOpenRoleId(id)}
            />
          ))}
        </ul>
      </DataState>
      <RoleDrawer
        departmentId={departmentId}
        roleId={openRoleId}
        onClose={() => void setOpenRoleId(null)}
        onSubmit={edit}
        onDelete={handleDelete}
      />
      <Toaster />
    </div>
  );
}
