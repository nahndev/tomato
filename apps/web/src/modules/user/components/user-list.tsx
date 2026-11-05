"use client";

import { Button, Input, Spinner, Toaster, toast } from "@tomato/ui";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { useUsers } from "../hooks/use-users";
import { DEFAULT_USER_EMAIL_DOMAIN, DEFAULT_USER_NAME, UserErrorMessage } from "../user.constants";
import { UserDetailDrawer } from "./user-detail-drawer";
import { UserRow } from "./user-row";

const createDefaultUser = () => ({
  name: DEFAULT_USER_NAME,
  // Emails are unique across all users.
  email: `user-${Math.random().toString(36).slice(2, 10)}@${DEFAULT_USER_EMAIL_DOMAIN}`,
});

export function UserList({ departmentId }: { departmentId: string }) {
  const { users, isLoading, hasError, add, edit, uploadAvatar, remove } = useUsers(departmentId);
  const [query, setQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [openUserId, setOpenUserId] = useQueryState("user", { history: "push" });

  async function handleCreate() {
    setIsCreating(true);
    try {
      const user = await add(createDefaultUser());
      void setOpenUserId(user.id);
    } catch {
      toast.error(UserErrorMessage.CREATE_FAILED);
    } finally {
      setIsCreating(false);
    }
  }

  const normalizedQuery = query.toLowerCase();
  const visibleUsers = users.filter(
    (user) => user.name.toLowerCase().includes(normalizedQuery) || user.email.includes(normalizedQuery),
  );

  async function handleDelete(id: string) {
    try {
      await remove(id);
    } catch {
      toast.error("Could not delete the user");
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
            aria-label="Search users"
            className="border-transparent bg-card pl-10 shadow-card"
          />
        </div>
        <Button onClick={handleCreate} disabled={isCreating}>
          <PlusIcon className="size-4" strokeWidth={2} />
          New user
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Spinner />
        </div>
      ) : hasError ? (
        <p className="text-sm text-muted-foreground">Could not load the users.</p>
      ) : visibleUsers.length === 0 ? (
        <p className="text-sm text-muted-foreground">{users.length === 0 ? "No users yet." : "No user matches."}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {visibleUsers.map((user) => (
            <UserRow key={user.id} user={user} onEdit={edit} onOpen={(id) => void setOpenUserId(id)} onDelete={handleDelete} />
          ))}
        </ul>
      )}
      <UserDetailDrawer
        departmentId={departmentId}
        userId={openUserId}
        onClose={() => void setOpenUserId(null)}
        onSubmit={edit}
        onUploadAvatar={uploadAvatar}
      />
      <Toaster />
    </div>
  );
}
