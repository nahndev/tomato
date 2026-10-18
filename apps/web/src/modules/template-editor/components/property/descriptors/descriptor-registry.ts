import type { ComponentType } from "react";
import type { WidgetPropertyDescriptorRegistry, WidgetPropertyFieldProps } from "../../../template-editor.types";
import { PropertyKey } from "../property.constants";
import { ActionsDescriptor } from "./actions-descriptor";
import { ApiCallDescriptor } from "./api-call/api-call-descriptor";
import { ContainerStyleDescriptor } from "./container-style-descriptor";
import { ContentDescriptor } from "./content-descriptor";
import { LabelDescriptor } from "./label-descriptor";
import { OptionsDescriptor } from "./options-descriptor";
import { PlaceholderDescriptor } from "./placeholder-descriptor";
import { RequiredDescriptor } from "./required-descriptor";
import { TextStyleDescriptor } from "./text-style-descriptor";

type FieldComponent = ComponentType<WidgetPropertyFieldProps>;

/** Resolves a property key to the label and field component rendered for it. */
export const PROPERTY_DESCRIPTOR_REGISTRY: WidgetPropertyDescriptorRegistry = {
  [PropertyKey.LABEL]: { label: "Label", Component: LabelDescriptor as FieldComponent },
  [PropertyKey.PLACEHOLDER]: { label: "Placeholder", Component: PlaceholderDescriptor as FieldComponent },
  [PropertyKey.REQUIRED]: { label: "Required", Component: RequiredDescriptor as FieldComponent },
  [PropertyKey.OPTIONS]: { label: "Options", Component: OptionsDescriptor as FieldComponent },
  [PropertyKey.CONTENT]: { label: "Content", Component: ContentDescriptor as FieldComponent },
  [PropertyKey.ACTIONS]: { label: "Actions", Component: ActionsDescriptor as FieldComponent },
  [PropertyKey.API_CALL]: { label: "", Component: ApiCallDescriptor as FieldComponent },
  [PropertyKey.TEXT_STYLE]: { label: "", Component: TextStyleDescriptor as FieldComponent },
  [PropertyKey.CONTAINER_STYLE]: { label: "Style", Component: ContainerStyleDescriptor as FieldComponent },
};
