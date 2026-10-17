import { Button } from "@tomato/ui";
import { LayoutGridIcon, ListIcon } from "lucide-react";
import { TemplateView } from "../template-browse.constants";

interface TemplateViewToggleProps {
  value: TemplateView;
  onChange: (view: TemplateView) => void;
}

export function TemplateViewToggle({ value, onChange }: TemplateViewToggleProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant={value === TemplateView.GRID ? "secondary" : "ghost"}
        size="icon-sm"
        aria-label="Grid view"
        aria-pressed={value === TemplateView.GRID}
        onClick={() => onChange(TemplateView.GRID)}
      >
        <LayoutGridIcon />
      </Button>
      <Button
        variant={value === TemplateView.LIST ? "secondary" : "ghost"}
        size="icon-sm"
        aria-label="List view"
        aria-pressed={value === TemplateView.LIST}
        onClick={() => onChange(TemplateView.LIST)}
      >
        <ListIcon />
      </Button>
    </div>
  );
}
