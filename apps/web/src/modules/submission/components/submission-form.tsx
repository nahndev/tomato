"use client";

import { DependencyGraphProvider } from "@/modules/submission-dependency";
import { TemplateForm } from "@/modules/template-form";
import type { SubmissionDetail } from "../submission.types";
import { useSubmissionValues } from "./submission-doc-provider";

interface SubmissionFormProps {
  submission: SubmissionDetail;
}

export function SubmissionForm({ submission }: SubmissionFormProps) {
  const { values, setValue } = useSubmissionValues();

  return (
    <DependencyGraphProvider sourceId={submission.id}>
      <TemplateForm snapshot={submission.templateVersion.snapshot} values={values} onChange={setValue} />
    </DependencyGraphProvider>
  );
}
