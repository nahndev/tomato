"use client";

import type { User } from "@tomato/types";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@tomato/ui/client";
import type { ReactNode } from "react";

interface UserDetailDrawerProps {
  user: User;
  children: ReactNode;
}

export function UserDetailDrawer({ user, children }: UserDetailDrawerProps) {
  return (
    <Drawer name="user-detail">
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="truncate">{user.name}</DrawerTitle>
          <DrawerDescription className="truncate">
            {user.email}
          </DrawerDescription>
        </DrawerHeader>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 overflow-y-auto px-6 pb-6 text-sm">
          <dt className="text-muted-foreground">Created</dt>
          <dd>{new Date(user.createdAt).toLocaleString()}</dd>
          <dt className="text-muted-foreground">Updated</dt>
          <dd>{new Date(user.updatedAt).toLocaleString()}</dd>
        </dl>
      </DrawerContent>
    </Drawer>
  );
}
