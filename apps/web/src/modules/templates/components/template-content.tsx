import type { Template } from "@tomato/types";
import { Spinner } from "@tomato/ui";
import { TemplateView } from "../templates.constants";
import { TemplateCard } from "./template-card";
import { TemplateList } from "./template-list";

interface TemplateContentProps {
  templates: Template[];
  view: TemplateView;
  isLoading: boolean;
  hasError: boolean;
  onDelete: (id: string) => void;
}

export function TemplateContent({ templates, view, isLoading, hasError, onDelete }: TemplateContentProps) {
  if (isLoading) return <Spinner />;
  if (hasError) return <p className="text-danger">Failed to load templates</p>;

  if (view === TemplateView.LIST) return <TemplateList templates={templates} onDelete={onDelete} />;

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} onDelete={onDelete} />
      ))}
    </ul>
  );
}
