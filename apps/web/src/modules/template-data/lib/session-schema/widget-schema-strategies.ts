import { WidgetType } from "@tomato/constants";
import { z } from "zod";
import { toScopedKey } from "../../utils/data-scope";
import { hasValue } from "../../utils/has-value";
import type { WidgetSchemaStrategy } from "./session-schema.types";

const ignoreStrategy: WidgetSchemaStrategy = {
  build: (schema) => schema,
};

const valueStrategy: WidgetSchemaStrategy = {
  build: (schema, { widget, scope }) =>
    schema.extend({
      [toScopedKey([...scope, widget.id])]: widget.required ? z.unknown().refine(hasValue) : z.unknown().optional(),
    }),
};

const canvasStrategy: WidgetSchemaStrategy = {
  build: (schema, { widget, scope, buildSession }) =>
    widget.session ? buildSession(schema, widget.session.id, scope) : schema,
};

const mixedViewStrategy: WidgetSchemaStrategy = {
  build: (schema, { widget, scope, buildSession }) =>
    (widget.tabs ?? []).reduce((current, tab) => buildSession(current, tab.id, [...scope, widget.id, tab.id]), schema),
};

export const WidgetSchemaStrategies: Record<WidgetType, WidgetSchemaStrategy> = {
  [WidgetType.TEXT]: valueStrategy,
  [WidgetType.TEXT_AREA]: valueStrategy,
  [WidgetType.NUMBER]: valueStrategy,
  [WidgetType.DATE]: valueStrategy,
  [WidgetType.DATETIME]: valueStrategy,
  [WidgetType.TIME]: valueStrategy,
  [WidgetType.SELECT]: valueStrategy,
  [WidgetType.CHECKBOX]: valueStrategy,
  [WidgetType.RADIO]: valueStrategy,
  [WidgetType.SIGNATURE]: valueStrategy,
  [WidgetType.IMAGE_UPLOADER]: valueStrategy,
  [WidgetType.FILE_UPLOADER]: valueStrategy,
  [WidgetType.BOARD]: valueStrategy,
  [WidgetType.USERS]: valueStrategy,
  [WidgetType.REFER_SUBMISSION]: valueStrategy,
  [WidgetType.LABEL]: ignoreStrategy,
  [WidgetType.BUTTON]: ignoreStrategy,
  [WidgetType.SUBMIT_BUTTON]: ignoreStrategy,
  [WidgetType.BREAK]: ignoreStrategy,
  [WidgetType.SESSION]: ignoreStrategy,
  [WidgetType.CREATED_AT]: ignoreStrategy,
  [WidgetType.TEMPLATE]: ignoreStrategy,
  [WidgetType.SUBMITTED_BY]: ignoreStrategy,
  [WidgetType.REPEAT_VIEW]: ignoreStrategy,
  [WidgetType.CANVAS]: canvasStrategy,
  [WidgetType.MIXED_VIEW]: mixedViewStrategy,
};
