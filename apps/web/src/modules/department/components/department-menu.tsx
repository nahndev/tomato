"use client";

import { SidebarNav } from "@/modules/system";
import { Button, Typography } from "@tomato/ui";
import { Building2Icon, PlusIcon } from "lucide-react";
import { getDepartmentHref } from "../department.utils";
import { useDepartmentMenu } from "../hooks/use-department-menu";
import { DepartmentFormDialog } from "./department-form-dialog";

export function DepartmentMenu() {
  const { departments, add } = useDepartmentMenu();

  return (
    <div className="flex flex-col gap-2">
      <SidebarNav
        items={[
          {
            label: "Departments",
            href: "/system/departments",
            children: departments.map(({ id, name }) => ({
              label: name,
              href: getDepartmentHref(id),
              icon: Building2Icon,
            })),
          },
        ]}
      />
      <DepartmentFormDialog onSubmit={add}>
        <Button
          variant="ghost"
          className="h-7 w-full justify-start gap-3 rounded-md px-2 text-xs font-normal text-muted-foreground"
        >
          <PlusIcon className="size-4" strokeWidth={1.75} />
          <Typography className="truncate">Add department</Typography>
        </Button>
      </DepartmentFormDialog>
    </div>
  );
}
