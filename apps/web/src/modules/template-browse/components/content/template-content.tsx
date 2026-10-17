import type { Template } from "@tomato/types";
import { Spinner } from "@tomato/ui";
import { useState } from "react";
import { TemplateList } from "./template-list";
import { TemplatePreview } from "./template-preview";

interface TemplateContentProps {
  templates: Template[];
  isLoading: boolean;
  hasError: boolean;
  onDelete: (id: string) => void;
}

export function TemplateContent({
  templates,
  isLoading,
  hasError,
  onDelete,
}: TemplateContentProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (isLoading) return <Spinner />;
  if (hasError) return <p className="text-danger">Failed to load templates</p>;

  if (templates.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No templates found
      </p>
    );
  }

  const [latest] = [...templates].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
  const selected = templates.find((t) => t.id === selectedId) ?? latest;

  return (
    <div className="flex flex-1 flex-row gap-8">
      <TemplateList
        templates={templates}
        selectedId={selected.id}
        onSelect={setSelectedId}
        onDelete={onDelete}
      />
      <TemplatePreview template={selected} />
    </div>
  );
}
