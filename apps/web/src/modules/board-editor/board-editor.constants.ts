import type { SystemNavGroup } from "@/modules/system";
import { DisplayType, TaskConditionOperation, ValueType, WidgetType } from "@tomato/constants";
import {
  BookIcon,
  CalendarDaysIcon,
  ListTodoIcon,
  TableIcon,
} from "lucide-react";

export const BOARD_SETTING_SECTIONS: readonly SystemNavGroup[] = [
  {
    label: "Settings",
    children: [{ label: "Templates", href: "/templates", icon: BookIcon }],
  },
  {
    label: "Views",
    children: [
      { label: "Table view", href: "/table", icon: TableIcon },
      { label: "Task view", href: "/task", icon: ListTodoIcon },
      { label: "Agenda view", href: "/agenda", icon: CalendarDaysIcon },
    ],
  },
];

export const COLUMN_WIDTH_STEPS = [
  100, 200, 300, 400, 500, 600, 800, 1000, 1200,
];
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

export const OPTION_WIDGET_TYPES: readonly WidgetType[] = [WidgetType.SELECT, WidgetType.RADIO, WidgetType.CHECKBOX];

export const TASK_FIELDS = [
  { key: "typeWidget", label: "Type", widgetTypes: OPTION_WIDGET_TYPES },
  { key: "titleWidget", label: "Title", widgetTypes: [WidgetType.TEXT, WidgetType.TEXT_AREA] },
  { key: "statusWidget", label: "Status", widgetTypes: OPTION_WIDGET_TYPES },
  { key: "assigneeWidget", label: "Assignee", widgetTypes: [WidgetType.USERS] },
] as const;

export const TASK_CONDITION_OPERATION_LABELS: Record<TaskConditionOperation, string> = {
  [TaskConditionOperation.IS]: "is",
  [TaskConditionOperation.IS_NOT]: "is not",
};

/** Radix Select forbids an empty item value, so a sentinel stands for "no widget". */
export const UNSELECTED = "__unselected__";
