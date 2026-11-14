import { Button, Typography } from "@tomato/ui";
import { describeTimeAgo } from "@tomato/utils";
import {
  ArrowRightIcon,
  CalendarIcon,
  PencilIcon,
  RefreshCwIcon,
  TagIcon,
  TextIcon,
} from "lucide-react";
import Link from "next/link";
import { TemplateThumbnail } from "./template-thumbnail";
import type { Template } from "@/shared/types/template.types";
import type { TemplateCategory } from "../../template.types";

interface TemplateDetailsProps {
  template: Template;
  category?: TemplateCategory;
}

export function TemplateDetails({ template, category }: TemplateDetailsProps) {
  const templatePath = `/templates/${template.id}`;

  return (
    <section className="flex shrink-0 flex-col gap-4 overflow-hidden rounded-lg p-4 bg-card text-foreground shadow-card">
      <header className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-1">
          <Typography as="h2" className="truncate font-semibold">{template.name}</Typography>
          <Typography as="p" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            Last updated: {describeTimeAgo(template.updatedAt)}
            <RefreshCwIcon className="size-3" strokeWidth={1.75} />
          </Typography>
        </div>
        <Link
          href={templatePath}
          aria-label={`Edit ${template.name}`}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-ring"
        >
          <PencilIcon className="size-4" strokeWidth={1.75} />
        </Link>
      </header>

      <div className="relative overflow-hidden rounded-md bg-muted p-4 text-muted-foreground">
        <TemplateThumbnail url={template.previewImageUrl} />
        {category && (
          <Typography className="absolute bottom-6 right-6 flex items-center gap-1.5 rounded-full bg-card px-2.5 py-1 text-xs font-medium text-foreground shadow-card">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            {category.name}
          </Typography>
        )}
      </div>

      <Button asChild>
        <Link href={templatePath}>
          <Typography>Open template</Typography>
          <ArrowRightIcon className="size-4" strokeWidth={2} />
        </Link>
      </Button>

      <dl className="flex flex-col gap-4 border-t border-border pt-4">
        {category && (
          <div className="flex flex-col gap-1">
            <dt className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <TagIcon className="size-3.5" strokeWidth={1.75} />
              <Typography>Category</Typography>
            </dt>
            <dd className="text-sm font-medium">{category.name}</dd>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <dt className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarIcon className="size-3.5" strokeWidth={1.75} />
            <Typography>Created</Typography>
          </dt>
          <dd className="text-sm font-medium">
            {template.createdAt.slice(0, 10)}
          </dd>
        </div>
        {template.description && (
          <div className="flex flex-col gap-1">
            <dt className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <TextIcon className="size-3.5" strokeWidth={1.75} />
              <Typography>Description</Typography>
            </dt>
            <dd className="line-clamp-3 text-sm font-medium">
              {template.description}
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
}
