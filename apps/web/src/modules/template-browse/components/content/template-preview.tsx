import type { Template } from "@tomato/types";
import { Button } from "@tomato/ui";
import { describeTimeAgo } from "@tomato/utils";
import { CalendarIcon, ClockIcon, FileTextIcon } from "lucide-react";
import Link from "next/link";
import { getTemplatePath } from "../../template-browse.constants";

interface TemplatePreviewProps {
  template: Template;
}

export function TemplatePreview({ template }: TemplatePreviewProps) {
  return (
    <section className="w-[25em] overflow-hidden rounded-lg bg-card text-card-foreground shadow-card transition-shadow duration-200 hover:shadow-lg motion-reduce:transition-none">
      <div className="flex flex-col gap-4 size-full p-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="min-w-0 flex-1">
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md text-left font-medium transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
              >
                <FileTextIcon className="size-4 shrink-0" strokeWidth={1.75} />
                <span className="truncate">{template.name}</span>
              </button>
            </h2>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ClockIcon className="size-3.5" strokeWidth={1.75} />
            Last update {describeTimeAgo(template.updatedAt)}
          </p>
        </div>
        <div className="p-4 overflow-hidden rounded-md bg-muted text-muted-foreground">
          <div className="relative w-full aspect-square">
            <img
              src={template.previewImageUrl}
              alt=""
              loading="lazy"
              className="absolute inset-0 size-full object-cover object-top"
            />
          </div>
        </div>

        <Button asChild>
          <Link href={getTemplatePath(template.id)}>Open template</Link>
        </Button>
        <div className="flex flex-col gap-3 p-4">
          {template.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {template.description}
            </p>
          )}
          <dl>
            <div className="flex flex-col gap-1">
              <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarIcon className="size-3.5" strokeWidth={1.75} />
                Created
              </dt>
              <dd className="text-sm">{template.createdAt.slice(0, 10)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
