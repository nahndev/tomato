import type { Template, TemplateCategory } from "@tomato/types";
import { Badge, Button } from "@tomato/ui";
import { describeTimeAgo } from "@tomato/utils";
import { EllipsisIcon } from "lucide-react";
import { TemplateThumbnail } from "./template-thumbnail";

interface TemplateListItemProps {
  template: Template;
  category?: TemplateCategory;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function TemplateMenuButton() {
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      aria-label="More actions"
      onClick={(event) => event.stopPropagation()}
      className="absolute top-4 right-4 bg-card/80 text-muted-foreground backdrop-blur-sm"
    >
      <EllipsisIcon />
    </Button>
  );
}

export function TemplateListItem({
  template,
  category,
  isSelected,
  onSelect,
}: TemplateListItemProps) {
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
      className="relative flex cursor-pointer flex-col gap-3 rounded-lg bg-card p-3 shadow-card motion-base focus-ring hover:ring-1 hover:ring-solid is-selected:ring-1 is-selected:ring-solid"
    >
      <TemplateMenuButton />
      <TemplateThumbnail url={template.previewImageUrl} />
      <div className="flex min-w-0 flex-col gap-1 px-1">
        <div className="flex flex-row justify-between">
          <h4 className="line-clamp-2 font-medium wrap-break-word">
            {template.name}
          </h4>
          {category && (
            <Badge variant="secondary" className="neutral">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              {category.name}
            </Badge>
          )}
        </div>
        <time
          dateTime={template.updatedAt}
          className="text-xs text-muted-foreground"
        >
          {describeTimeAgo(template.updatedAt)}
        </time>
      </div>
    </div>
  );
}
