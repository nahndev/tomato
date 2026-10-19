"use client";

import { Spinner, Toaster } from "@tomato/ui";
import { notFound } from "next/navigation";
import { useSubmission } from "../hooks/use-submission";
import { SubmissionDocProvider } from "./submission-doc-provider";
import { SubmissionForm } from "./submission-form";
import { SubmissionHeader } from "./submission-header";

interface SubmissionPageProps {
  submissionId: string;
}

export function SubmissionPage({ submissionId }: SubmissionPageProps) {
  const { data: submission, isLoading, isError } = useSubmission(submissionId);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-canvas">
        <Spinner />
      </div>
    );
  }

  if (isError || !submission) notFound();

  return (
    <SubmissionDocProvider submissionId={submission.id}>
      <div className="grid h-screen grid-rows-[auto_1fr] overflow-hidden bg-canvas">
        <SubmissionHeader submission={submission} />
        <div className="min-h-0">
          <SubmissionForm submission={submission} />
        </div>
      </div>
      <Toaster />
    </SubmissionDocProvider>
  );
}
