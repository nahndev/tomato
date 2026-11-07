"use client";

import { Button, ConfirmDialog, DataState } from "@tomato/ui";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@tomato/ui/client";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { UserList } from "@/modules/user";
import { useRole } from "../hooks/use-roles";
import { ROLE_DRAWER_WIDTH, RoleErrorMessage } from "../roles.constants";
import type { RoleDetailInput } from "../roles.schemas";
import { RoleDetailForm } from "./role-detail-form";

interface RoleDrawerActions {
  onSubmit: (id: string, input: RoleDetailInput) => Promise<void>;
  onDelete: (id: string) => void;
}

interface RoleDrawerContentProps extends RoleDrawerActions {
  departmentId: string;
  roleId: string;
}

function RoleDrawerContent({
  departmentId,
  roleId,
  onSubmit,
  onDelete,
}: RoleDrawerContentProps) {
  const { role, hasError } = useRole(departmentId, roleId);

  if (!role) {
    return (
      <>
        <DrawerTitle className="sr-only">Role</DrawerTitle>
        <DrawerDescription className="sr-only">Role details</DrawerDescription>
        <div className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
          <DataState
            isLoading={!hasError}
            hasError={hasError}
            errorMessage={RoleErrorMessage.LOAD_FAILED}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <DrawerTitle className="sr-only">{role.name}</DrawerTitle>
      <DrawerDescription className="sr-only">Role details</DrawerDescription>
      <RoleDetailForm
        key={roleId}
        role={role}
        onSubmit={(input) => onSubmit(roleId, input)}
        footerAction={
          <ConfirmDialog
            title={`Delete “${role.name}”?`}
            description="Its users lose this role and its permissions. This action cannot be undone."
            destructive="Delete"
            onDestructive={() => onDelete(roleId)}
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
            >
              <Trash2Icon />
              Delete
            </Button>
          </ConfirmDialog>
        }
      >
        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold">Users</h3>
          <UserList departmentId={departmentId} roleId={roleId} />
        </section>
      </RoleDetailForm>
    </>
  );
}

interface RoleDrawerProps extends RoleDrawerActions {
  departmentId: string;
  roleId: string | null;
  onClose: () => void;
}

export function RoleDrawer({
  departmentId,
  roleId,
  onClose,
  onSubmit,
  onDelete,
}: RoleDrawerProps) {
  // Keeps the content rendered during the close animation, once `roleId` is null.
  const [contentRoleId, setContentRoleId] = useState(roleId);
  if (roleId && roleId !== contentRoleId) setContentRoleId(roleId);

  return (
    <Drawer
      name="role"
      defaultWidth={ROLE_DRAWER_WIDTH}
      open={Boolean(roleId)}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DrawerContent>
        {contentRoleId && (
          <RoleDrawerContent
            departmentId={departmentId}
            roleId={contentRoleId}
            onSubmit={onSubmit}
            onDelete={onDelete}
          />
        )}
      </DrawerContent>
    </Drawer>
  );
}
