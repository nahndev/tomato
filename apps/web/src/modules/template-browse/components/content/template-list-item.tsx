import type { Template } from "@tomato/types";
import { Button } from "@tomato/ui";
import { describeTimeAgo } from "@tomato/utils";
import { ChevronDownIcon, FileTextIcon } from "lucide-react";
import { useState } from "react";

interface TemplateListItemProps {
  template: Template;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function TemplateIcon() {
  return (
    <FileTextIcon
      className="size-12 p-4 rounded-full bg-muted in-data-[selected=true]:text-primary"
      strokeWidth={1.75}
    />
  );
}

function TemplateName({ name }: { name: string }) {
  return (
    <button
      type="button"
      className="min-w-0 flex-2 truncate rounded-md text-left font-medium focus-ring"
    >
      {name}
    </button>
  );
}

function TemplateDescription({ description }: { description: string | null }) {
  return (
    <span className="hidden min-w-0 flex-3 truncate text-sm text-muted-foreground md:block">
      {description}
    </span>
  );
}

interface TemplateChangelogsToggleProps {
  isExpanded: boolean;
  controlsId: string;
  onToggle: () => void;
}

function TemplateChangelogsToggle({
  isExpanded,
  controlsId,
  onToggle,
}: TemplateChangelogsToggleProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      aria-expanded={isExpanded}
      aria-controls={controlsId}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      className="ml-auto shrink-0 text-muted-foreground"
    >
      Changelogs
      <ChevronDownIcon
        className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
      />
    </Button>
  );
}

function TemplateChangelogs({
  id,
  template,
}: {
  id: string;
  template: Template;
}) {
  const hasUpdates = template.updatedAt !== template.createdAt;

  return (
    <ul
      id={id}
      className="flex flex-col gap-1 border-t border-border pt-3 pl-9 text-sm text-muted-foreground"
    >
      {hasUpdates && <li>Updated {describeTimeAgo(template.updatedAt)}</li>}
      <li>Created {describeTimeAgo(template.createdAt)}</li>
    </ul>
  );
}

export function TemplateListItem({
  template,
  isSelected,
  onSelect,
}: TemplateListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const changelogsId = `template-changelogs-${template.id}`;

  return (
    <div data-selected={isSelected} className="pt-2 rounded-lg bg-inset text-foreground motion-base hover:bg-inset-hover hover:ring-1 hover:ring-foreground/15 is-selected:bg-inset-hover is-selected:ring-1 is-selected:ring-foreground/15">
      <div
        role="option"
        data-selected={isSelected}
        onClick={() => onSelect(template.id)}
        className="flex cursor-pointer flex-col gap-3 rounded-lg p-4 bg-card text-foreground shadow-card motion-base hover:ring-1 hover:ring-solid is-selected:ring-1 is-selected:ring-solid"
      >
        <div className="flex items-center gap-4">
          <TemplateIcon />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <time
              dateTime={template.updatedAt}
              className="text-xs text-muted-foreground"
            >
              {describeTimeAgo(template.updatedAt)}
            </time>
            <div className="flex items-center gap-4">
              <TemplateName name={template.name} />
              <TemplateDescription description={template.description} />
              <TemplateChangelogsToggle
                isExpanded={isExpanded}
                controlsId={changelogsId}
                onToggle={() => setIsExpanded((value) => !value)}
              />
            </div>
          </div>
        </div>
        {isExpanded && (
          <TemplateChangelogs id={changelogsId} template={template} />
        )}
      </div>
    </div>
  );
}
