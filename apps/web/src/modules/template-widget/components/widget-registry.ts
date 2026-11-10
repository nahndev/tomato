import { WidgetType } from "@tomato/constants";
import type { FieldComponent, WidgetComponentRegistry } from "../template-widget.types";
import { BoardWidgetItem } from "./items/board-widget-item";
import { BreakWidgetItem } from "./items/break-widget-item";
import { ButtonWidgetItem } from "./items/button-widget-item";
import { CanvasWidgetItem } from "./items/canvas-widget-item";
import { CheckboxWidgetItem } from "./items/checkbox-widget-item";
import { DateWidgetItem } from "./items/date-widget-item";
import { DatetimeWidgetItem } from "./items/datetime-widget-item";
import { FileUploaderWidgetItem } from "./items/file-uploader-widget-item";
import { ImageUploaderWidgetItem } from "./items/image-uploader-widget-item";
import { LabelWidgetItem } from "./items/label-widget-item";
import { MixedViewWidgetItem } from "./items/mixed-view-widget-item";
import { NumberWidgetItem } from "./items/number-widget-item";
import { RadioWidgetItem } from "./items/radio-widget-item";
import { SelectWidgetItem } from "./items/select-widget-item";
import { SessionWidgetItem } from "./items/session-widget-item";
import { SignatureWidgetItem } from "./items/signature-widget-item";
import { SystemFieldWidgetItem } from "./items/system-field-widget-item";
import { TextAreaWidgetItem } from "./items/text-area-widget-item";
import { TextWidgetItem } from "./items/text-widget-item";
import { TimeWidgetItem } from "./items/time-widget-item";
import { UsersWidgetItem } from "./items/users-widget-item";

export const WidgetComponents: WidgetComponentRegistry = {
  [WidgetType.TEXT]: TextWidgetItem as FieldComponent,
  [WidgetType.TEXT_AREA]: TextAreaWidgetItem as FieldComponent,
  [WidgetType.NUMBER]: NumberWidgetItem as FieldComponent,
  [WidgetType.DATE]: DateWidgetItem as FieldComponent,
  [WidgetType.DATETIME]: DatetimeWidgetItem as FieldComponent,
  [WidgetType.TIME]: TimeWidgetItem as FieldComponent,
  [WidgetType.SELECT]: SelectWidgetItem as FieldComponent,
  [WidgetType.CHECKBOX]: CheckboxWidgetItem as FieldComponent,
  [WidgetType.RADIO]: RadioWidgetItem as FieldComponent,
  [WidgetType.LABEL]: LabelWidgetItem as FieldComponent,
  [WidgetType.SIGNATURE]: SignatureWidgetItem as FieldComponent,
  [WidgetType.BUTTON]: ButtonWidgetItem as FieldComponent,
  [WidgetType.IMAGE_UPLOADER]: ImageUploaderWidgetItem as FieldComponent,
  [WidgetType.FILE_UPLOADER]: FileUploaderWidgetItem as FieldComponent,
  [WidgetType.BOARD]: BoardWidgetItem as FieldComponent,
  [WidgetType.BREAK]: BreakWidgetItem as FieldComponent,
  [WidgetType.SESSION]: SessionWidgetItem as FieldComponent,
  [WidgetType.USERS]: UsersWidgetItem as FieldComponent,
  [WidgetType.CREATED_AT]: SystemFieldWidgetItem as FieldComponent,
  [WidgetType.TEMPLATE]: SystemFieldWidgetItem as FieldComponent,
  [WidgetType.SUBMITTED_BY]: SystemFieldWidgetItem as FieldComponent,
  [WidgetType.CANVAS]: CanvasWidgetItem as FieldComponent,
  [WidgetType.MIXED_VIEW]: MixedViewWidgetItem as FieldComponent,
};
