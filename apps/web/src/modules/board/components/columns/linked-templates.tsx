import type { BoardTemplate } from "@tomato/types";
import { Badge, Button } from "@tomato/ui";
import { XIcon } from "lucide-react";
import { AddTemplate } from "./add-template";

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
            <li key={template.id} className="flex items-center gap-2 rounded-md bg-card py-1 pr-1 pl-3 text-sm shadow-card">
              {template.name}
              {template.latestVersion ? (
                <Badge variant="secondary">v{template.latestVersion.version}</Badge>
              ) : (
                <Badge variant="secondary">Not published</Badge>
              )}
              <Button variant="ghost" size="icon-xs" aria-label={`Unlink ${template.name}`} onClick={() => onRemove(template.id)}>
                <XIcon />
              </Button>
            </li>
          ))}
        </ul>
      )}
      <AddTemplate linkedIds={templates.map((template) => template.id)} onAdd={onAdd} />
    </section>
  );
}
