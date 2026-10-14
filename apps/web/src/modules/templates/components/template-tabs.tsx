import { cn } from "@tomato/ui";
import { TEMPLATE_TAB_LABELS, TemplateTab } from "../template.constants";

interface TemplateTabsProps {
  value: TemplateTab;
  onChange: (tab: TemplateTab) => void;
}

export function TemplateTabs({ value, onChange }: TemplateTabsProps) {
  return (
    <div role="tablist" className="flex gap-4">
      {Object.values(TemplateTab).map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={value === tab}
          onClick={() => onChange(tab)}
          className={cn(
            "-mb-px border-b-2 px-1 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring",
            value === tab
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {TEMPLATE_TAB_LABELS[tab]}
        </button>
      ))}
    </div>
  );
}
