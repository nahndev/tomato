"use client";

import { Badge, Button, ConfirmDialog, Spinner, toast } from "@tomato/ui";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useUnitTypes } from "../../hooks/use-unit-types";
import { UnitTypeNameDialog } from "./unit-type-name-dialog";

export function UnitTypeManager() {
  const { types, isLoading, hasError, add, edit, remove } = useUnitTypes();

  async function handleDelete(id: string) {
    try {
      await remove(id);
    } catch {
      toast.error("Could not delete the type");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <Spinner />
      </div>
    );
  }

  if (hasError) return <p className="text-sm text-muted-foreground">Could not load the unit types.</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <UnitTypeNameDialog onSubmit={add}>
          <Button>
            <PlusIcon className="size-4" strokeWidth={2} />
            New type
          </Button>
        </UnitTypeNameDialog>
      </div>
      <ul className="flex flex-col gap-2">
        {types.map((type) => (
          <li key={type.id} className="flex items-center gap-3 rounded-lg bg-card p-3 shadow-card">
            <span className="min-w-0 flex-1 truncate font-medium">{type.name}</span>
            {type.isDefault ? (
              <Badge variant="outline">Default</Badge>
            ) : (
              <>
                <UnitTypeNameDialog initialName={type.name} onSubmit={(input) => edit(type.id, input)}>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Rename ${type.name}`}
                    className="text-muted-foreground"
                  >
                    <PencilIcon />
                  </Button>
                </UnitTypeNameDialog>
                <ConfirmDialog
                  title={`Delete “${type.name}”?`}
                  description="Only types no unit uses can be deleted."
                  destructive="Delete"
                  onDestructive={() => handleDelete(type.id)}
                >
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Delete ${type.name}`}
                    className="text-muted-foreground"
                  >
                    <Trash2Icon />
                  </Button>
                </ConfirmDialog>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
