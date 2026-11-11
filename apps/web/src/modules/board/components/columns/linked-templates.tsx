import { Badge, Button } from "@tomato/ui";
import { XIcon } from "lucide-react";
import { AddTemplate } from "./add-template";
import type { BoardTemplate } from "../../board.types";

interface LinkedTemplatesProps {
  templates: BoardTemplate[];
  onAdd: (template: BoardTemplate) => void;
  onRemove: (id: string) => void;
}

export function LinkedTemplates({ templates, onAdd, onRemove }: LinkedTemplatesProps) {
  return (
    <section className="flex flex-col gap-3" aria-label="Linked templates">
      <div>
        <h2 className="font-medium">Templates</h2>
        <p className="text-sm text-muted-foreground">
          Submissions of this board are created from the newest published version of these templates.
        </p>
      </div>
      {templates.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {templates.map((template) => (
            <li key={template.templateId} className="flex items-center gap-2 rounded-md bg-card py-1 pr-1 pl-3 text-sm shadow-card">
              {template.template.name}
              {template.template.versions[0] ? (
                <Badge variant="secondary">v{template.template.versions[0].version}</Badge>
              ) : (
                <Badge variant="secondary">Not published</Badge>
              )}
              <Button variant="ghost" size="icon-xs" aria-label={`Unlink ${template.template.name}`} onClick={() => onRemove(template.templateId)}>
                <XIcon />
              </Button>
            </li>
          ))}
        </ul>
      )}
      <AddTemplate linkedIds={templates.map((template) => template.templateId)} onAdd={onAdd} />
    </section>
  );
}
