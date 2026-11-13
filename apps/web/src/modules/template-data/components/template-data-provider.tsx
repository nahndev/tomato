"use client";

import { createStoreContext } from "@tomato/store-context";
import type { TemplateDataValue } from "../template-data.types";

export const TemplateDataStore = createStoreContext<TemplateDataValue>("TemplateData", {
  defaults: { widgets: {}, links: {} },
});

export const TemplateDataProvider = TemplateDataStore.Provider;
