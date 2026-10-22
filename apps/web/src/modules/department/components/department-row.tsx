import type { Department } from "@tomato/types";
import { Button, ConfirmDialog } from "@tomato/ui";
import { PencilIcon, Trash2Icon } from "lucide-react";
import type { DepartmentInput } from "../department.schemas";
import { DepartmentFormDialog } from "./department-form-dialog";

interface DepartmentRowProps {
  department: Department;
  onEdit: (id: string, input: DepartmentInput) => Promise<void>;
  onDelete: (id: string) => void;
}

export function DepartmentRow({ department, onEdit, onDelete }: DepartmentRowProps) {
  return (
    <li className="flex items-center gap-3 rounded-lg bg-card p-3 shadow-card">
      <span className="min-w-0 flex-1 truncate font-medium">{department.name}</span>
      <DepartmentFormDialog department={department} onSubmit={(input) => onEdit(department.id, input)}>
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={`Edit ${department.name}`}
          className="text-muted-foreground"
        >
          <PencilIcon />
        </Button>
      </DepartmentFormDialog>
      <ConfirmDialog
        title={`Delete “${department.name}”?`}
        description="This action cannot be undone."
        destructive="Delete"
        onDestructive={() => onDelete(department.id)}
      >
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={`Delete ${department.name}`}
          className="text-muted-foreground"
        >
          <Trash2Icon />
        </Button>
      </ConfirmDialog>
    </li>
  );
}
