import type { Template } from "@tomato/types";
import { Spinner } from "@tomato/ui";
import { TemplateCard } from "./template-card";

interface TemplateContentProps {
  templates: Template[];
  isLoading: boolean;
  hasError: boolean;
  onDelete: (id: string) => void;
}

export function TemplateContent({ templates, isLoading, hasError, onDelete }: TemplateContentProps) {
  if (isLoading) return <Spinner />;
  if (hasError) return <p className="text-danger">Failed to load templates</p>;

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} onDelete={onDelete} />
      ))}
    </ul>
  );
}
