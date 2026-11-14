import { Badge, Button, Typography } from "@tomato/ui";
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
        <Typography as="h2" className="font-medium">Templates</Typography>
        <Typography as="p" className="text-sm text-muted-foreground">
          Submissions of this board are created from the newest published version of these templates.
        </Typography>
      </div>
      {templates.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {templates.map((template) => (
            <li key={template.templateId} className="flex items-center gap-2 rounded-md bg-card py-1 pr-1 pl-3 text-sm shadow-card">
              {template.template.name}
              {template.template.versions[0] ? (
                <Badge variant="secondary"><Typography>v{template.template.versions[0].version}</Typography></Badge>
              ) : (
                <Badge variant="secondary"><Typography>Not published</Typography></Badge>
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
