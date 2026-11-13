"use client";

import { createContext } from "react";
import type { TemplateStoreValue } from "../template-store.types";

export const TemplateStoreContext = createContext<TemplateStoreValue>({ widgets: {}, links: {} });

export const TemplateStoreProvider = TemplateStoreContext.Provider;
