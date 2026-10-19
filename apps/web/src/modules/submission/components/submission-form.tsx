"use client";

import type { SubmissionDetail } from "@tomato/types";
import { TemplateForm } from "@/modules/template-editor";
import { useSubmissionValues } from "./submission-doc-provider";

interface SubmissionFormProps {
  submission: SubmissionDetail;
}

export function SubmissionForm({ submission }: SubmissionFormProps) {
  const { values, setValue } = useSubmissionValues();

  return <TemplateForm snapshot={submission.templateVersion.snapshot} values={values} onChange={setValue} />;
}
