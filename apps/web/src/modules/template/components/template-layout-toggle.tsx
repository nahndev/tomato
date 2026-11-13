import { Button } from "@tomato/ui";
import { LayoutGridIcon, ListIcon } from "lucide-react";
import { TemplateLayout } from "../template.constants";

interface TemplateLayoutToggleProps {
  value: TemplateLayout;
  onChange: (layout: TemplateLayout) => void;
}

export function TemplateLayoutToggle({ value, onChange }: TemplateLayoutToggleProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant={value === TemplateLayout.GRID ? "secondary" : "ghost"}
        size="icon-sm"
        aria-label="Grid view"
        aria-pressed={value === TemplateLayout.GRID}
        onClick={() => onChange(TemplateLayout.GRID)}
      >
        <LayoutGridIcon />
      </Button>
      <Button
        variant={value === TemplateLayout.LIST ? "secondary" : "ghost"}
        size="icon-sm"
        aria-label="List view"
        aria-pressed={value === TemplateLayout.LIST}
        onClick={() => onChange(TemplateLayout.LIST)}
      >
        <ListIcon />
      </Button>
    </div>
  );
}
