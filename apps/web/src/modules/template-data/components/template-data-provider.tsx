"use client";

import { createContext } from "react";
import type { TemplateDataValue } from "../template-data.types";

export const TemplateDataContext = createContext<TemplateDataValue>({ widgets: {}, links: {} });

export const TemplateDataProvider = TemplateDataContext.Provider;
