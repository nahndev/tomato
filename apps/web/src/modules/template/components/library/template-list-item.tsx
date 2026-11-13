import { Badge, Button, cn } from "@tomato/ui";
import { describeTimeAgo } from "@tomato/utils";
import { EllipsisIcon } from "lucide-react";
import { TemplateLayout } from "../../template.constants";
import { TemplateThumbnail } from "./template-thumbnail";
import type { Template } from "@/shared/types/template.types";
import type { TemplateCategory } from "../../template.types";

interface TemplateListItemProps {
  template: Template;
  category?: TemplateCategory;
  layout: TemplateLayout;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function TemplateMenuButton({ className }: { className?: string }) {
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      aria-label="More actions"
      onClick={(event) => event.stopPropagation()}
      className={cn("bg-card/80 text-muted-foreground backdrop-blur-sm", className)}
    >
      <EllipsisIcon />
    </Button>
  );
}

export function TemplateListItem({
  template,
  category,
  layout,
  isSelected,
  onSelect,
}: TemplateListItemProps) {
  const isGrid = layout === TemplateLayout.GRID;
  const categoryBadge = category && (
    <Badge variant="secondary" className="neutral">
      <span
        className="size-2 rounded-full"
        style={{ backgroundColor: category.color }}
      />
      {category.name}
    </Badge>
  );

  return (
    <div
      role="option"
      aria-selected={isSelected}
      data-selected={isSelected}
      tabIndex={0}
      onClick={() => onSelect(template.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(template.id);
        }
      }}
      className={cn(
        "relative flex cursor-pointer rounded-lg bg-card shadow-card motion-base focus-ring hover:ring-1 hover:ring-solid is-selected:ring-1 is-selected:ring-solid",
        isGrid ? "flex-col gap-3 p-3" : "flex-row items-center gap-4 px-3 py-2",
      )}
    >
      {isGrid && <TemplateMenuButton className="absolute top-4 right-4" />}
      <div className={isGrid ? undefined : "w-16 shrink-0"}>
        <TemplateThumbnail url={template.previewImageUrl} />
      </div>
      <div className={cn("flex min-w-0 flex-col gap-1", isGrid ? "px-1" : "flex-1")}>
        <div className="flex flex-row justify-between">
          <h4 className={cn("font-medium wrap-break-word", isGrid ? "line-clamp-2" : "line-clamp-1")}>
            {template.name}
          </h4>
          {isGrid && categoryBadge}
        </div>
        <time
          dateTime={template.updatedAt}
          className="text-xs text-muted-foreground"
        >
          {describeTimeAgo(template.updatedAt)}
        </time>
      </div>
      {!isGrid && categoryBadge}
      {!isGrid && <TemplateMenuButton />}
    </div>
  );
}
