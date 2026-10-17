import type { ReactNode } from "react";

interface TemplateCategoryItemProps {
  label: string;
  count: number;
  isSelected: boolean;
  icon: ReactNode;
  onSelect: () => void;
}

export function TemplateCategoryItem({
  label,
  count,
  isSelected,
  icon,
  onSelect,
}: TemplateCategoryItemProps) {
  return (
    <li>
      <button
        type="button"
        aria-pressed={isSelected}
        onClick={onSelect}
        className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring ${isSelected ? "bg-muted font-medium" : ""}`}
      >
        {icon}
        <span className="min-w-0 flex-1 truncate">{label}</span>
        <span className="text-xs text-muted-foreground">{count}</span>
      </button>
    </li>
  );
}
