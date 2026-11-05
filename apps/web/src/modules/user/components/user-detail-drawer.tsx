"use client";

import { Spinner, Tabs, TabsContent, TabsList, TabsTrigger } from "@tomato/ui";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@tomato/ui/client";
import { useState } from "react";
import { useUser } from "../hooks/use-users";
import { USER_DETAIL_DRAWER_WIDTH, UserErrorMessage } from "../user.constants";
import type { UserDetailInput } from "../user.schemas";
import { UserDetailForm } from "./user-detail-form";
import { UserProfilePanel } from "./user-profile-panel";

interface UserDetailActions {
  onSubmit: (id: string, input: UserDetailInput) => Promise<void>;
  onUploadAvatar: (id: string, file: File) => Promise<void>;
}

interface UserDetailContentProps extends UserDetailActions {
  departmentId: string;
  userId: string;
}

function UserDetailContent({
  departmentId,
  userId,
  onSubmit,
  onUploadAvatar,
}: UserDetailContentProps) {
  const { user, hasError } = useUser(departmentId, userId);

  if (!user) {
    return (
      <>
        <DrawerTitle className="sr-only">User</DrawerTitle>
        <DrawerDescription className="sr-only">User details</DrawerDescription>
        <div className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
          {hasError ? UserErrorMessage.LOAD_FAILED : <Spinner />}
        </div>
      </>
    );
  }

  return (
    <>
      <DrawerTitle className="sr-only">{user.name}</DrawerTitle>
      <DrawerDescription className="sr-only">{user.email}</DrawerDescription>
      <Tabs defaultValue="information" className="min-h-0 flex-1 gap-0">
        <div className="border-b border-border px-6 pt-3 pb-1">
          <TabsList variant="line">
            <TabsTrigger value="information">Information</TabsTrigger>
            <TabsTrigger value="credential">Credential</TabsTrigger>
          </TabsList>
        </div>
        {/* forceMount keeps unsaved edits when switching tabs */}
        <TabsContent
          value="information"
          forceMount
          className="@container min-h-0 data-[state=inactive]:hidden"
        >
          <div className="flex h-full flex-col gap-4 p-4 overflow-y-auto @2xl:flex-row @2xl:overflow-hidden">
            <UserProfilePanel
              user={user}
              onUploadAvatar={(file) => onUploadAvatar(userId, file)}
            />
            <UserDetailForm
              key={userId}
              user={user}
              onSubmit={(input) => onSubmit(userId, input)}
            />
          </div>
        </TabsContent>
        <TabsContent
          value="credential"
          className="flex items-center justify-center p-6"
        >
          <p className="text-sm text-muted-foreground">No credentials yet.</p>
        </TabsContent>
      </Tabs>
    </>
  );
}

interface UserDetailDrawerProps extends UserDetailActions {
  departmentId: string;
  userId: string | null;
  onClose: () => void;
}

export function UserDetailDrawer({
  departmentId,
  userId,
  onClose,
  onSubmit,
  onUploadAvatar,
}: UserDetailDrawerProps) {
  // Keeps the content rendered during the close animation, once `userId` is null.
  const [contentUserId, setContentUserId] = useState(userId);
  if (userId && userId !== contentUserId) setContentUserId(userId);

  return (
    <Drawer
      name="user-detail"
      defaultWidth={USER_DETAIL_DRAWER_WIDTH}
      open={Boolean(userId)}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DrawerContent>
        {contentUserId && (
          <UserDetailContent
            departmentId={departmentId}
            userId={contentUserId}
            onSubmit={onSubmit}
            onUploadAvatar={onUploadAvatar}
          />
        )}
      </DrawerContent>
    </Drawer>
  );
}
