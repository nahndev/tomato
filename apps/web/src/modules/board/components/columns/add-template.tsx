"use client";

import type { BoardTemplate } from "@tomato/types";
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@tomato/ui";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useTemplates } from "@/modules/template-browse";
import { useTemplateVersions } from "@/modules/template-editor";

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
    onAdd({ id: template.id, name: template.name, latestVersion: versions[0] ?? null });
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
        Link
      </Button>
    </div>
  );
}
