import type { Unit, UnitType } from "@tomato/types";
import { Badge, Button, ConfirmDialog } from "@tomato/ui";
import { PencilIcon, Trash2Icon } from "lucide-react";
import type { UnitInput } from "../../unit.schemas";
import { UnitFormDialog } from "./unit-form-dialog";

interface UnitRowProps {
  unit: Unit;
  types: UnitType[];
  onEdit: (id: string, input: UnitInput) => Promise<void>;
  onDelete: (id: string) => void;
}

export function UnitRow({ unit, types, onEdit, onDelete }: UnitRowProps) {
  return (
    <li className="flex items-center gap-3 rounded-lg bg-card p-3 shadow-card">
      <span className="min-w-0 flex-1 truncate font-medium">{unit.name}</span>
      <Badge variant="outline">{unit.type.name}</Badge>
      {unit.isSystem && <Badge>System</Badge>}
      <UnitFormDialog unit={unit} types={types} onSubmit={(input) => onEdit(unit.id, input)}>
        <Button variant="ghost" size="icon-xs" aria-label={`Edit ${unit.name}`} className="text-muted-foreground">
          <PencilIcon />
        </Button>
      </UnitFormDialog>
      {!unit.isSystem && (
        <ConfirmDialog
          title={`Delete “${unit.name}”?`}
          description="This action cannot be undone."
          destructive="Delete"
          onDestructive={() => onDelete(unit.id)}
        >
          <Button variant="ghost" size="icon-xs" aria-label={`Delete ${unit.name}`} className="text-muted-foreground">
            <Trash2Icon />
          </Button>
        </ConfirmDialog>
      )}
    </li>
  );
}
