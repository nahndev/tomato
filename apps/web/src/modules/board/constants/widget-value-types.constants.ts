import { DisplayType, ValueType, WidgetType } from "@tomato/constants";

export type WidgetValueTypes = Partial<Record<ValueType, DisplayType[]>>;

const NONE: WidgetValueTypes = {};
const text: WidgetValueTypes = { [ValueType.DEFAULT]: [DisplayType.TEXT] };

/**
 * The value properties a widget exposes and the display types each one can render as in a board column.
 * Only `datetime` has more than one property. Widgets whose value is not a plain string/number/timestamp
 * (files, signatures, users) are not displayable yet.
 */
export const WIDGET_VALUE_TYPES: Record<WidgetType, WidgetValueTypes> = {
  [WidgetType.TEXT]: text,
  [WidgetType.TEXT_AREA]: text,
  [WidgetType.NUMBER]: { [ValueType.DEFAULT]: [DisplayType.NUMBER, DisplayType.TEXT] },
  [WidgetType.DATE]: { [ValueType.DEFAULT]: [DisplayType.DATE, DisplayType.TEXT] },
  [WidgetType.DATETIME]: {
    [ValueType.DEFAULT]: [DisplayType.DATETIME, DisplayType.TEXT, DisplayType.DATE, DisplayType.TIME],
    [ValueType.DATE]: [DisplayType.DATE, DisplayType.TEXT],
    [ValueType.TIME]: [DisplayType.TIME, DisplayType.TEXT],
  },
  [WidgetType.TIME]: { [ValueType.DEFAULT]: [DisplayType.TIME, DisplayType.TEXT] },
  [WidgetType.SELECT]: text,
  [WidgetType.CHECKBOX]: text,
  [WidgetType.RADIO]: text,
  [WidgetType.CREATED_AT]: { [ValueType.DEFAULT]: [DisplayType.DATE, DisplayType.TEXT] },
  [WidgetType.LABEL]: NONE,
  [WidgetType.SIGNATURE]: NONE,
  [WidgetType.BUTTON]: NONE,
  [WidgetType.IMAGE_UPLOADER]: NONE,
  [WidgetType.FILE_UPLOADER]: NONE,
  [WidgetType.BOARD]: NONE,
  [WidgetType.BREAK]: NONE,
  [WidgetType.SESSION]: NONE,
  [WidgetType.USERS]: NONE,
  [WidgetType.TEMPLATE]: NONE,
  [WidgetType.SUBMITTED_BY]: NONE,
  [WidgetType.API_CALL]: NONE,
};
