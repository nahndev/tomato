"use client";

import { Button, Input, Spinner, Toaster, toast } from "@tomato/ui";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { useUsers } from "@/modules/user";
import { useDocuments } from "../hooks/use-documents";
import { DocumentFormDialog } from "./document-form-dialog";
import { DocumentRow } from "./document-row";

export function DocumentList({ departmentId }: { departmentId: string }) {
  const { documents, isLoading, hasError, add, edit, remove } =
    useDocuments(departmentId);
  const { users } = useUsers(departmentId);
  const [query, setQuery] = useState("");

  const normalizedQuery = query.toLowerCase();
  const visibleDocuments = documents.filter((document) =>
    document.title.toLowerCase().includes(normalizedQuery),
  );

  async function handleDelete(id: string) {
    try {
      await remove(id);
    } catch {
      toast.error("Could not delete the document");
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
            aria-label="Search documents"
            className="border-transparent bg-card pl-10 shadow-card"
          />
        </div>
        <DocumentFormDialog owners={users} onSubmit={add}>
          <Button>
            <PlusIcon className="size-4" strokeWidth={2} />
            New document
          </Button>
        </DocumentFormDialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Spinner />
        </div>
      ) : hasError ? (
        <p className="text-sm text-muted-foreground">
          Could not load the documents.
        </p>
      ) : visibleDocuments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {documents.length === 0
            ? "No documents yet."
            : "No document matches."}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {visibleDocuments.map((document) => (
            <DocumentRow
              key={document.id}
              document={document}
              owners={users}
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
