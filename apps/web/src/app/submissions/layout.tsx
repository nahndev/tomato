import { SubmissionLayout } from "@/modules/submission";
import type { ReactNode } from "react";

export default function SubmissionsLayout({ children }: { children: ReactNode }) {
  return <SubmissionLayout>{children}</SubmissionLayout>;
}
