import type { OptionItem } from "@tomato/types";

export function sortOptions(options: OptionItem[] | undefined): OptionItem[] {
  return [...(options ?? [])].sort((a, b) => (a.index < b.index ? -1 : 1));
}
