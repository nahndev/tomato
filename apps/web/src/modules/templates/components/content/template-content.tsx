import type { Template } from "@tomato/types";
import { Spinner } from "@tomato/ui";
import { TemplateList } from "./template-list";
import { TemplateRecent } from "./template-recent";

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
  if (isLoading) return <Spinner />;
  if (hasError) return <p className="text-danger">Failed to load templates</p>;

  if (templates.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No templates found
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <TemplateRecent templates={templates} onDelete={onDelete} />
      <TemplateList templates={templates} onDelete={onDelete} />
    </div>
  );
}
