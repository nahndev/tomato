"use client";

import { TemplateForm } from "@/modules/template-form";
import { useSubmissionValues } from "./submission-doc-provider";
import type { SubmissionDetail } from "../submission.types";

interface SubmissionFormProps {
  submission: SubmissionDetail;
}

export function SubmissionForm({ submission }: SubmissionFormProps) {
  const { values, setValue } = useSubmissionValues();

  return <TemplateForm snapshot={submission.templateVersion.snapshot} values={values} onChange={setValue} />;
}
