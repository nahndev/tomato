"use client";

import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Typography } from "@tomato/ui";
import { useDepartments } from "@/modules/department";
import type { PropertyFieldProps } from "../../../../template-editor.types";
import { ALL_DEPARTMENTS_VALUE } from "../../../../template-editor.constants";

export function DepartmentField({ value, onChange }: PropertyFieldProps<"departmentUuid">) {
  const { departments, isLoading } = useDepartments();

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="prop-department"><Typography>Department</Typography></Label>
      <Select
        value={value ?? ALL_DEPARTMENTS_VALUE}
        onValueChange={(next) => onChange(next === ALL_DEPARTMENTS_VALUE ? undefined : next)}
        disabled={isLoading}
      >
        <SelectTrigger id="prop-department" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_DEPARTMENTS_VALUE}><Typography>All departments</Typography></SelectItem>
          {departments.map((department) => (
            <SelectItem key={department.id} value={department.id}>
              {department.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Typography className="text-xs text-muted-foreground">Only users of this department can be picked.</Typography>
    </div>
  );
}
