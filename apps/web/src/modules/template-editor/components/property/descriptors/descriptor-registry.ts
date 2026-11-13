import type { ComponentType } from "react";
import type { WidgetPropertyDescriptorRegistry, WidgetPropertyFieldProps } from "../../../template-editor.types";
import { PropertyKey } from "../property.constants";
import { ActionsDescriptor } from "./actions-descriptor";
import { ContainerStyleDescriptor } from "./container-style-descriptor";
import { ContentDescriptor } from "./content-descriptor";
import { DepartmentDescriptor } from "./department-descriptor";
import { LabelDescriptor } from "./label-descriptor";
import { LinkTemplateDescriptor } from "./link-template-descriptor";
import { LinkWidgetDescriptor } from "./link-widget-descriptor";
import { OptionsDescriptor } from "./options-descriptor";
import { PlaceholderDescriptor } from "./placeholder-descriptor";
import { RequiredDescriptor } from "./required-descriptor";
import { TabsDescriptor } from "./tabs-descriptor";
import { TextStyleDescriptor } from "./text-style-descriptor";

type FieldComponent = ComponentType<WidgetPropertyFieldProps>;

export const PROPERTY_DESCRIPTOR_REGISTRY: WidgetPropertyDescriptorRegistry = {
  [PropertyKey.LABEL]: { label: "Label", Component: LabelDescriptor as FieldComponent },
  [PropertyKey.PLACEHOLDER]: { label: "Placeholder", Component: PlaceholderDescriptor as FieldComponent },
  [PropertyKey.REQUIRED]: { label: "Required", Component: RequiredDescriptor as FieldComponent },
  [PropertyKey.OPTIONS]: { label: "Options", Component: OptionsDescriptor as FieldComponent },
  [PropertyKey.TABS]: { label: "Tabs", Component: TabsDescriptor as FieldComponent },
  [PropertyKey.CONTENT]: { label: "Content", Component: ContentDescriptor as FieldComponent },
  [PropertyKey.ACTIONS]: { label: "Actions", Component: ActionsDescriptor as FieldComponent },
  [PropertyKey.TEXT_STYLE]: { label: "", Component: TextStyleDescriptor as FieldComponent },
  [PropertyKey.CONTAINER_STYLE]: { label: "Style", Component: ContainerStyleDescriptor as FieldComponent },
  [PropertyKey.LINK_WIDGET_UUID]: { label: "Linked widget", Component: LinkWidgetDescriptor as FieldComponent },
  [PropertyKey.LINK_TEMPLATE_UUID]: { label: "Template", Component: LinkTemplateDescriptor as FieldComponent },
  [PropertyKey.DEPARTMENT_UUID]: { label: "Department", Component: DepartmentDescriptor as FieldComponent },
};
