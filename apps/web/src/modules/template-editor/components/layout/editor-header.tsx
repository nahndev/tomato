"use client";

import { Button } from "@tomato/ui";
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
  const { name } = useTemplateSnapshot();
  const mode = useTemplateMode();
  const version = useTemplateVersion();

  return (
    <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-2 text-foreground">
      <Button asChild variant="ghost" size="icon" aria-label="Back to templates">
        <Link href="/system/templates">
          <ArrowLeftIcon />
        </Link>
      </Button>
      <h1 className="truncate font-medium">{name}</h1>
      <div className="flex-1" />
      <span className="text-sm text-muted-foreground">{version ? `v${version}` : "Not published"}</span>
      <ConnectionStatus />
      <PublishButton />
      {mode === TemplateMode.VIEW ? (
        <Button asChild size="sm">
          <Link href={`/templates/${id}?mode=${TemplateMode.EDIT}`}>
            <PencilIcon />
            Edit
          </Link>
        </Button>
      ) : (
        <Button asChild size="sm" variant="outline">
          <Link href={`/templates/${id}?mode=${TemplateMode.VIEW}`}>
            <EyeIcon />
            Preview
          </Link>
        </Button>
      )}
    </header>
  );
}
