import { cn } from "@tomato/ui";
import type { SystemNavGroup } from "./system.constants";

export function getSidebarItemClass() {
  return cn(
    "variant-ghost flex h-9 w-full items-center gap-3 rounded-md px-2",
    "not-aria-[current=page]:text-black",
  );
}

export function getFirstNavHref(groups: readonly SystemNavGroup[]): string | undefined {
  return groups.flatMap((group) => group.children)[0]?.href;
}
