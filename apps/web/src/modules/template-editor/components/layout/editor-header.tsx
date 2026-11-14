"use client";

import { Button, Typography } from "@tomato/ui";
import { ArrowLeftIcon, EyeIcon, PencilIcon } from "lucide-react";
import Link from "next/link";
import { useTemplateSnapshot } from "../provider/template-snapshot-provider";
import { TemplateMode } from "../../template-editor.constants";
import { useTemplateMode } from "../provider/template-mode-provider";
import { useTemplateId, useTemplateVersion } from "../provider/template-meta-provider";
import { PublishButton } from "../toolbar/version/publish-button";
import { ConnectionStatus } from "./connection-status";

export function EditorHeader() {
  const id = useTemplateId();
  const name = useTemplateSnapshot((snapshot) => snapshot.name);
  const mode = useTemplateMode();
  const version = useTemplateVersion();

  return (
    <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-2 text-foreground">
      <Button asChild variant="ghost" size="icon" aria-label="Back to templates">
        <Link href="/system/templates">
          <ArrowLeftIcon />
        </Link>
      </Button>
      <Typography as="h1" className="truncate font-medium">{name}</Typography>
      <div className="flex-1" />
      <Typography className="text-sm text-muted-foreground">{version ? `v${version}` : "Not published"}</Typography>
      <ConnectionStatus />
      <PublishButton />
      {mode === TemplateMode.VIEW ? (
        <Button asChild size="sm">
          <Link href={`/templates/${id}?mode=${TemplateMode.EDIT}`}>
            <PencilIcon />
            <Typography>Edit</Typography>
          </Link>
        </Button>
      ) : (
        <Button asChild size="sm" variant="outline">
          <Link href={`/templates/${id}?mode=${TemplateMode.VIEW}`}>
            <EyeIcon />
            <Typography>Preview</Typography>
          </Link>
        </Button>
      )}
    </header>
  );
}
