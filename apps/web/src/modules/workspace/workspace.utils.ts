import { cn } from "@tomato/ui";

export function getSidebarItemClass(isExtended: boolean) {
  return cn(
    "variant-ghost flex h-9 items-center rounded-md",
    isExtended ? "w-full gap-3 px-2" : "size-9 justify-center",
  );
}
