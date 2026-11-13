import type { ComponentType } from "react";
import type { PropertyFieldRegistry, WidgetPropertyFieldProps } from "../../../template-editor.types";
import { PropertyKey } from "../../../template-editor.constants";
import { ActionsField } from "./fields/actions-field";
import { ContainerStyleField } from "./fields/container-style-field";
import { ContentField } from "./fields/content-field";
import { DepartmentField } from "./fields/department-field";
import { LabelField } from "./fields/label-field";
import { LinkTemplateField } from "./fields/link-template-field";
import { LinkWidgetField } from "./fields/link-widget-field";
import { OptionsField } from "./fields/options-field";
import { PlaceholderField } from "./fields/placeholder-field";
import { RequiredField } from "./fields/required-field";
import { TabsField } from "./fields/tabs-field";
import { TextStyleField } from "./fields/text-style-field";

type FieldComponent = ComponentType<WidgetPropertyFieldProps>;

export const PROPERTY_FIELD_REGISTRY: PropertyFieldRegistry = {
  [PropertyKey.LABEL]: { label: "Label", Component: LabelField as FieldComponent },
  [PropertyKey.PLACEHOLDER]: { label: "Placeholder", Component: PlaceholderField as FieldComponent },
  [PropertyKey.REQUIRED]: { label: "Required", Component: RequiredField as FieldComponent },
  [PropertyKey.OPTIONS]: { label: "Options", Component: OptionsField as FieldComponent },
  [PropertyKey.TABS]: { label: "Tabs", Component: TabsField as FieldComponent },
  [PropertyKey.CONTENT]: { label: "Content", Component: ContentField as FieldComponent },
  [PropertyKey.ACTIONS]: { label: "Actions", Component: ActionsField as FieldComponent },
  [PropertyKey.TEXT_STYLE]: { label: "", Component: TextStyleField as FieldComponent },
  [PropertyKey.CONTAINER_STYLE]: { label: "Style", Component: ContainerStyleField as FieldComponent },
  [PropertyKey.LINK_WIDGET_UUID]: { label: "Linked widget", Component: LinkWidgetField as FieldComponent },
  [PropertyKey.LINK_TEMPLATE_UUID]: { label: "Template", Component: LinkTemplateField as FieldComponent },
  [PropertyKey.DEPARTMENT_UUID]: { label: "Department", Component: DepartmentField as FieldComponent },
};
