"use client";

import { Button, DataState, Input, toast, Toaster, Typography } from "@tomato/ui";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { useDepartments } from "../hooks/use-departments";
import { DepartmentFormDialog } from "./department-form-dialog";
import { DepartmentRow } from "./department-row";

export function DepartmentList() {
  const { departments, isLoading, hasError, add, edit, remove } = useDepartments();
  const [query, setQuery] = useState("");

  const visibleDepartments = departments.filter((department) =>
    department.name.toLowerCase().includes(query.toLowerCase()),
  );

  async function handleDelete(id: string) {
    try {
      await remove(id);
    } catch {
      toast.error("Could not delete the department");
    }
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-6">
      <Typography as="h1" className="text-xl font-medium">Departments</Typography>
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
            aria-label="Search departments"
            className="border-transparent bg-card pl-10 shadow-card"
          />
        </div>
        <DepartmentFormDialog onSubmit={add}>
          <Button>
            <PlusIcon className="size-4" strokeWidth={2} />
            <Typography>New department</Typography>
          </Button>
        </DepartmentFormDialog>
      </div>

      <DataState
        isLoading={isLoading}
        hasError={hasError}
        isEmpty={visibleDepartments.length === 0}
        errorMessage="Could not load the departments."
        emptyMessage={departments.length === 0 ? "No departments yet." : "No department matches."}
      >
        <ul className="flex flex-col gap-2">
          {visibleDepartments.map((department) => (
            <DepartmentRow key={department.id} department={department} onEdit={edit} onDelete={handleDelete} />
          ))}
        </ul>
      </DataState>
      <Toaster />
    </div>
  );
}
