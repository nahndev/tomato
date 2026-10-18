import { WidgetType } from "@tomato/constants";
import type { WidgetComponent, WidgetComponentRegistry } from "../../template-editor.types";
import { ApiCallWidgetItem } from "./items/api-call-widget-item";
import { BoardWidgetItem } from "./items/board-widget-item";
import { BreakWidgetItem } from "./items/break-widget-item";
import { ButtonWidgetItem } from "./items/button-widget-item";
import { CheckboxWidgetItem } from "./items/checkbox-widget-item";
import { DateWidgetItem } from "./items/date-widget-item";
import { DatetimeWidgetItem } from "./items/datetime-widget-item";
import { FileUploaderWidgetItem } from "./items/file-uploader-widget-item";
import { ImageUploaderWidgetItem } from "./items/image-uploader-widget-item";
import { LabelWidgetItem } from "./items/label-widget-item";
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
  [WidgetType.API_CALL]: ApiCallWidgetItem as WidgetComponent,
  [WidgetType.TEXT]: TextWidgetItem as WidgetComponent,
  [WidgetType.TEXT_AREA]: TextAreaWidgetItem as WidgetComponent,
  [WidgetType.NUMBER]: NumberWidgetItem as WidgetComponent,
  [WidgetType.DATE]: DateWidgetItem as WidgetComponent,
  [WidgetType.DATETIME]: DatetimeWidgetItem as WidgetComponent,
  [WidgetType.TIME]: TimeWidgetItem as WidgetComponent,
  [WidgetType.SELECT]: SelectWidgetItem as WidgetComponent,
  [WidgetType.CHECKBOX]: CheckboxWidgetItem as WidgetComponent,
  [WidgetType.RADIO]: RadioWidgetItem as WidgetComponent,
  [WidgetType.LABEL]: LabelWidgetItem as WidgetComponent,
  [WidgetType.SIGNATURE]: SignatureWidgetItem as WidgetComponent,
  [WidgetType.BUTTON]: ButtonWidgetItem as WidgetComponent,
  [WidgetType.IMAGE_UPLOADER]: ImageUploaderWidgetItem as WidgetComponent,
  [WidgetType.FILE_UPLOADER]: FileUploaderWidgetItem as WidgetComponent,
  [WidgetType.BOARD]: BoardWidgetItem as WidgetComponent,
  [WidgetType.BREAK]: BreakWidgetItem as WidgetComponent,
  [WidgetType.SESSION]: SessionWidgetItem as WidgetComponent,
  [WidgetType.USERS]: UsersWidgetItem as WidgetComponent,
  [WidgetType.CREATED_AT]: SystemFieldWidgetItem as WidgetComponent,
  [WidgetType.TEMPLATE]: SystemFieldWidgetItem as WidgetComponent,
  [WidgetType.SUBMITTED_BY]: SystemFieldWidgetItem as WidgetComponent,
};
