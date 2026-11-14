"use client";

import { createStoreContext } from "@tomato/store-context";
import { useMemo, type ReactNode } from "react";
import { SessionSchemaBuilder } from "../lib/session-schema";
import type { SessionValidationValue } from "../template-data.types";
import { TemplateDataStore } from "./template-data-provider";

export const SessionValidationStore = createStoreContext<SessionValidationValue>("SessionValidation", { defaults: { results: {} } });

interface SessionValidationProviderProps {
  sessionId: string;
  children: ReactNode;
}

export function SessionValidationProvider({ sessionId, children }: SessionValidationProviderProps) {
  const widgets = TemplateDataStore.useSelector((state) => state.widgets);
  const widgetToSession = TemplateDataStore.useSelector((state) => state.widgetToSession);
  const values = TemplateDataStore.useSelector((state) => state.values);
  const schema = useMemo(
    () => new SessionSchemaBuilder({ widgets, widgetToSession }).build(sessionId),
    [widgets, widgetToSession, sessionId],
  );
  const { isValid, results } = useMemo(() => {
    if (!values) return { isValid: undefined, results: {} };
    const { success, error } = schema.safeParse(values);
    const issues = error?.issues ?? [];
    return {
      isValid: success,
      results: Object.fromEntries(
        Object.keys(schema.shape).map((key) => {
          const keyIssues = issues.filter((issue) => issue.path[0] === key);
          return [key, { isValid: keyIssues.length === 0, issues: keyIssues }];
        }),
      ),
    };
  }, [schema, values]);

  return (
    <SessionValidationStore.Provider sessionId={sessionId} schema={schema} isValid={isValid} results={results}>
      {children}
    </SessionValidationStore.Provider>
  );
}
