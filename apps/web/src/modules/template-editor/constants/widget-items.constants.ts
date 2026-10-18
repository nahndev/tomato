import { WidgetGroup, WidgetType } from "@tomato/constants";
import { EditorIconKey } from "../template-editor.icons";
import type { WidgetItemDefinition, WidgetItemRegistry } from "../template-editor.types";
import { DEFAULT_LAYOUTS } from "./widget-layouts.constants";
import { DEFAULT_SETTINGS } from "./widget-settings.constants";

type WidgetItemMeta = Pick<WidgetItemDefinition, "label" | "icon" | "description" | "isDataField" | "group">;

const WIDGET_ITEM_META: Record<WidgetType, WidgetItemMeta> = {
  [WidgetType.TEXT]: {
    label: "Text",
    icon: EditorIconKey.TYPE,
    description: "Single-line text",
    isDataField: true,
    group: WidgetGroup.COMMON,
  },
  [WidgetType.TEXT_AREA]: {
    label: "Text Area",
    icon: EditorIconKey.ALIGN_LEFT,
    description: "Multi-line text with auto-growing rows",
    isDataField: true,
    group: WidgetGroup.COMMON,
  },
  [WidgetType.NUMBER]: {
    label: "Number",
    icon: EditorIconKey.HASH,
    description: "Numeric input",
    isDataField: true,
    group: WidgetGroup.COMMON,
  },
  [WidgetType.DATE]: {
    label: "Date",
    icon: EditorIconKey.CALENDAR,
    description: "Date only",
    isDataField: true,
    group: WidgetGroup.COMMON,
  },
  [WidgetType.DATETIME]: {
    label: "Date & Time",
    icon: EditorIconKey.CALENDAR_CLOCK,
    description: "Date and time (stored as epoch ms)",
    isDataField: true,
    group: WidgetGroup.COMMON,
  },
  [WidgetType.TIME]: {
    label: "Time",
    icon: EditorIconKey.TIMER,
    description: "Time only",
    isDataField: true,
    group: WidgetGroup.COMMON,
  },
  [WidgetType.SELECT]: {
    label: "Select",
    icon: EditorIconKey.LIST,
    description: "Dropdown select",
    isDataField: true,
    group: WidgetGroup.COMMON,
  },
  [WidgetType.CHECKBOX]: {
    label: "Checkbox",
    icon: EditorIconKey.CHECK_SQUARE,
    description: "A list of checkboxes (multi-select)",
    isDataField: true,
    group: WidgetGroup.COMMON,
  },
  [WidgetType.RADIO]: {
    label: "Radio",
    icon: EditorIconKey.CIRCLE_DOT,
    description: "A list of radio buttons (single-select)",
    isDataField: true,
    group: WidgetGroup.COMMON,
  },
  [WidgetType.LABEL]: {
    label: "Label",
    icon: EditorIconKey.DOCUMENT,
    description: "Readonly display content",
    isDataField: false,
    group: WidgetGroup.COMMON,
  },
  [WidgetType.SIGNATURE]: {
    label: "Signature",
    icon: EditorIconKey.PEN_TOOL,
    description: "Lets the person sign with their pointer",
    isDataField: true,
    group: WidgetGroup.ADVANCE,
  },
  [WidgetType.BUTTON]: {
    label: "Button",
    icon: EditorIconKey.MOUSE_POINTER_CLICK,
    description: "A clickable button, optionally linking to a URL",
    isDataField: false,
    group: WidgetGroup.ADVANCE,
  },
  [WidgetType.IMAGE_UPLOADER]: {
    label: "Image Upload",
    icon: EditorIconKey.IMAGE,
    description: "Upload and preview an image",
    isDataField: true,
    group: WidgetGroup.MEDIA,
  },
  [WidgetType.FILE_UPLOADER]: {
    label: "File Upload",
    icon: EditorIconKey.PAPERCLIP,
    description: "Upload files and show them as a list",
    isDataField: true,
    group: WidgetGroup.MEDIA,
  },
  [WidgetType.BOARD]: {
    label: "Board",
    icon: EditorIconKey.PENCIL,
    description: "Upload an image and draw on top of it",
    isDataField: true,
    group: WidgetGroup.MEDIA,
  },
  [WidgetType.BREAK]: {
    label: "Break",
    icon: EditorIconKey.MINUS,
    description: "A full-width divider line",
    isDataField: false,
    group: WidgetGroup.ADVANCE,
  },
  [WidgetType.SESSION]: {
    label: "Session",
    icon: EditorIconKey.CLOCK,
    description: "Full-width, fixed block",
    isDataField: false,
    group: WidgetGroup.ADVANCE,
  },
  [WidgetType.USERS]: {
    label: "Users",
    icon: EditorIconKey.USERS,
    description: "Select a user from the workspace",
    isDataField: true,
    group: WidgetGroup.SYSTEM,
  },
  [WidgetType.CREATED_AT]: {
    label: "Created At",
    icon: EditorIconKey.HISTORY,
    description: "When the submission was created",
    isDataField: false,
    group: WidgetGroup.DEFAULT,
  },
  [WidgetType.TEMPLATE]: {
    label: "Template",
    icon: EditorIconKey.CLIPBOARD_LIST,
    description: "The template the submission was filled from",
    isDataField: false,
    group: WidgetGroup.DEFAULT,
  },
  [WidgetType.SUBMITTED_BY]: {
    label: "By",
    icon: EditorIconKey.USER_ROUND,
    description: "Who submitted the entry",
    isDataField: false,
    group: WidgetGroup.DEFAULT,
  },
  [WidgetType.API_CALL]: {
    label: "API Call",
    icon: EditorIconKey.WEBHOOK,
    description: "Calls an external API and can map the response into other fields",
    isDataField: false,
    group: WidgetGroup.ADVANCE,
  },
};

export const WidgetItems = Object.fromEntries(
  Object.values(WidgetType).map((type) => [
    type,
    {
      type,
      ...WIDGET_ITEM_META[type],
      defaultSettings: DEFAULT_SETTINGS[type],
      defaultLayout: DEFAULT_LAYOUTS[type],
    },
  ]),
) as WidgetItemRegistry;

export const WidgetItemList: WidgetItemDefinition[] = Object.values(WidgetItems);

export const WIDGET_GROUP_LABELS: Record<WidgetGroup, string> = {
  [WidgetGroup.COMMON]: "Common",
  [WidgetGroup.MEDIA]: "Media",
  [WidgetGroup.ADVANCE]: "Advance",
  [WidgetGroup.SYSTEM]: "System",
  [WidgetGroup.DEFAULT]: "Default",
};

export const WIDGET_GROUP_ORDER: WidgetGroup[] = [
  WidgetGroup.COMMON,
  WidgetGroup.MEDIA,
  WidgetGroup.ADVANCE,
  WidgetGroup.SYSTEM,
];
