"use client";

import { SUBMISSION_REFER_SEPARATOR, WidgetBehaviorType } from "@tomato/constants";
import { getReferUserIds, TemplateForm, type FormReferences } from "@/modules/template-form";
import { useMemo, useState } from "react";
import { useSubmissionGraph } from "../hooks/use-submission-graph";
import { getSubmissionPath, REFER_SUBMISSION_POLL_MS } from "../submission.constants";
import type { SubmissionDetail } from "../submission.types";
import { useSubmissionValues } from "./submission-doc-provider";

interface SubmissionFormProps {
  submission: SubmissionDetail;
}

export function SubmissionForm({ submission }: SubmissionFormProps) {
  const { values, setValue } = useSubmissionValues();
  const { snapshot } = submission.templateVersion;
  const [isPolling, setIsPolling] = useState(false);
  const { data: graph } = useSubmissionGraph(submission.id, isPolling && REFER_SUBMISSION_POLL_MS);

  const references = useMemo(() => {
    const result: FormReferences = {};
    const referPrefix = submission.id + SUBMISSION_REFER_SEPARATOR;
    for (const { sourceId, refer, idempotencyKey, targetId } of graph?.edges ?? []) {
      if (sourceId !== submission.id || !refer?.startsWith(referPrefix) || !idempotencyKey) continue;
      const widgetId = refer.slice(referPrefix.length);
      const userId = idempotencyKey.slice(refer.length + SUBMISSION_REFER_SEPARATOR.length);
      result[widgetId] = { ...result[widgetId], [userId]: getSubmissionPath(targetId) };
    }
    return result;
  }, [graph, submission.id]);

  const isPending = Object.entries(snapshot.behaviors).some(
    ([widgetId, behaviors]) =>
      behaviors.includes(WidgetBehaviorType.REFER_SUBMISSION) &&
      Boolean(values[widgetId]) &&
      getReferUserIds(snapshot, values, widgetId).some((userId) => !references[widgetId]?.[userId]),
  );
  if (isPending !== isPolling) setIsPolling(isPending);

  return <TemplateForm snapshot={snapshot} values={values} onChange={setValue} references={references} />;
}
