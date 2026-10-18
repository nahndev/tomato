import { TemplateMode } from "../template-editor.constants";

export function resolveTemplateMode(value: string | undefined): TemplateMode {
  return value === TemplateMode.VIEW ? TemplateMode.VIEW : TemplateMode.EDIT;
}
