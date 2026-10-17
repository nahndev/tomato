import type { TemplateCategory } from "@tomato/types";
import { TemplateCategoryItem } from "./template-category-item";

interface TemplateCategoriesProps {
  categories: TemplateCategory[];
  counts: Record<string, number>;
  selectedId: string;
  onSelect: (id: string) => void;
}

export function TemplateCategories({
  categories,
  counts,
  selectedId,
  onSelect,
}: TemplateCategoriesProps) {
  return (
    <nav
      aria-label="Template categories"
      className="w-80 min-w-0 flex-col gap-6"
    >
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          Categories
        </h3>
        <ul className="flex flex-col gap-1">
          {categories.map((category) => (
            <TemplateCategoryItem
              key={category.id}
              label={category.name}
              count={counts[category.id] ?? 0}
              isSelected={category.id === selectedId}
              icon={
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              }
              onSelect={() => onSelect(category.id)}
            />
          ))}
        </ul>
      </section>
    </nav>
  );
}
