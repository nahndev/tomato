"use client";

import { Button, Input, Typography } from "@tomato/ui";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { useState, type KeyboardEvent } from "react";

interface TaskTitleProps {
  title: string;
  href: string;
  onChange: (title: string) => void;
}

export function TaskTitle({ title, href, onChange }: TaskTitleProps) {
  const [isEditing, setIsEditing] = useState(false);

  function commit(next: string) {
    setIsEditing(false);
    const trimmed = next.trim();
    if (trimmed && trimmed !== title) onChange(trimmed);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") commit(event.currentTarget.value);
    if (event.key === "Escape") setIsEditing(false);
  }

  if (isEditing) {
    return (
      <Input
        autoFocus
        defaultValue={title}
        aria-label="Task title"
        onBlur={(event) => commit(event.currentTarget.value)}
        onKeyDown={handleKeyDown}
        className="relative z-10 h-8 min-w-0 flex-1"
      />
    );
  }

  return (
    <div className="flex min-w-0 flex-1 items-center gap-1">
      <Link
        href={href}
        title={title}
        className="min-w-0 truncate font-medium after:absolute after:inset-0 hover:underline"
      >
        <Typography>{title}</Typography>
      </Link>
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label="Edit title"
        onClick={() => setIsEditing(true)}
        className="relative z-10 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
      >
        <PencilIcon />
      </Button>
    </div>
  );
}
