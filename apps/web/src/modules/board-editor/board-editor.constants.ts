import type { SystemNavGroup } from "@/modules/system";
import { DisplayType, ValueType } from "@tomato/constants";
import { BookIcon, CalendarDaysIcon, ListTodoIcon, TableIcon } from "lucide-react";

export const BOARD_SETTING_SECTIONS: readonly SystemNavGroup[] = [
  {
    label: "Settings",
    children: [
      { label: "Templates", href: "/templates", icon: BookIcon },
      { label: "Table view", href: "/table", icon: TableIcon },
      { label: "Task view", href: "/task", icon: ListTodoIcon },
      { label: "Agenda view", href: "/agenda", icon: CalendarDaysIcon },
    ],
  },
];

export const COLUMN_WIDTH_STEPS = [100, 200, 300, 400, 500, 600, 800, 1000, 1200];
export const COLUMN_FLEX_STEPS = [1, 2, 3, 4, 5];

export const DISPLAY_TYPE_LABELS: Record<DisplayType, string> = {
  [DisplayType.TEXT]: "Text",
  [DisplayType.DATE]: "Date",
  [DisplayType.TIME]: "Time",
  [DisplayType.DATETIME]: "Date & time",
  [DisplayType.NUMBER]: "Number",
};

export const VALUE_TYPE_LABELS: Record<ValueType, string> = {
  [ValueType.DEFAULT]: "Default",
  [ValueType.DATE]: "Date",
  [ValueType.TIME]: "Time",
};
