"use client";

import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Typography } from "@tomato/ui";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useTemplates, useTemplateVersions } from "@/modules/template";
import type { BoardTemplate } from "../../board.types";

interface AddTemplateProps {
  linkedIds: string[];
  onAdd: (template: BoardTemplate) => void;
}

export function AddTemplate({ linkedIds, onAdd }: AddTemplateProps) {
  const { templates } = useTemplates();
  const [templateId, setTemplateId] = useState("");
  const { versions, isLoading } = useTemplateVersions(templateId);

  const availableTemplates = templates.filter((template) => !linkedIds.includes(template.id));
  const template = availableTemplates.find((entry) => entry.id === templateId);

  function handleAdd() {
    if (!template) return;
    onAdd({ templateId: template.id, template: { ...template, versions: versions.slice(0, 1) } });
    setTemplateId("");
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={templateId} onValueChange={setTemplateId} disabled={availableTemplates.length === 0}>
        <SelectTrigger aria-label="Template" className="w-64">
          <SelectValue placeholder={availableTemplates.length === 0 ? "All templates linked" : "Template"} />
        </SelectTrigger>
        <SelectContent>
          {availableTemplates.map((entry) => (
            <SelectItem key={entry.id} value={entry.id}>
              {entry.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" onClick={handleAdd} disabled={!template || isLoading}>
        <PlusIcon />
        <Typography>Link</Typography>
      </Button>
    </div>
  );
}
