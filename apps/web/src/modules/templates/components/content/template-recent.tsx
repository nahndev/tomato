import type { Template } from "@tomato/types";
import { TEMPLATE_RECENT_LIMIT } from "../../templates.constants";
import { TemplateCard } from "./template-card";

interface TemplateRecentProps {
  templates: Template[];
  onDelete: (id: string) => void;
}

export function TemplateRecent({ templates, onDelete }: TemplateRecentProps) {
  const recentTemplates = [...templates]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, TEMPLATE_RECENT_LIMIT);

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-medium text-muted-foreground">Recent</h3>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {recentTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </section>
  );
}
