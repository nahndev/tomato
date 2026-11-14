"use client";

import { useTemplateVersions } from "@/modules/template";
import { useTemplateId } from "../../provider/template-meta-provider";
import { PublishButton } from "./publish-button";

import { Typography } from "@tomato/ui";
export function VersionToolbar() {
  const templateId = useTemplateId();
  const { versions, latestVersion, isLoading } = useTemplateVersions(templateId);

  return (
    <div className="flex h-full flex-col gap-3 p-2">
      <Typography as="p" className="text-sm text-muted-foreground">
        Current version: {isLoading ? "…" : (latestVersion ?? "Not published yet")}
      </Typography>

      <PublishButton />

      {versions.length > 0 && (
        <ul className="flex flex-col gap-1" aria-label="Published versions">
          {versions.map((entry) => (
            <li key={entry.id} className="flex items-center justify-between rounded-md border border-border px-2 py-1 text-sm">
              <Typography className="font-medium">v{entry.version}</Typography>
              <time className="text-xs text-muted-foreground" dateTime={entry.createdAt}>
                {new Date(entry.createdAt).toLocaleString()}
              </time>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
