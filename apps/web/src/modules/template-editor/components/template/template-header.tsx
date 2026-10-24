"use client";

import { Button } from "@tomato/ui";
import { ArrowLeftIcon, EyeIcon, PencilIcon } from "lucide-react";
import Link from "next/link";
import { useTemplateState } from "../../hooks/use-template-state";
import { TemplateMode } from "../../template-editor.constants";
import { useTemplateMode } from "../provider/template-builder-provider";
import { useTemplateId, useTemplateVersion } from "../provider/template-provider";
import { TemplateConnection } from "./template-connection";

const TEMPLATES_PATH = "/system/templates";

export function TemplateHeader() {
  const id = useTemplateId();
  const { name } = useTemplateState();
  const mode = useTemplateMode();
  const version = useTemplateVersion();

  return (
    <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-2 text-foreground">
      <Button asChild variant="ghost" size="icon" aria-label="Back to templates">
        <Link href={TEMPLATES_PATH}>
          <ArrowLeftIcon />
        </Link>
      </Button>
      <h1 className="truncate font-medium">{name}</h1>
      <div className="flex-1" />
      <span className="text-sm text-muted-foreground">{version ? `v${version}` : "Not published"}</span>
      <TemplateConnection />
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
