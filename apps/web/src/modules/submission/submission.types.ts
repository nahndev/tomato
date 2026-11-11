import type { Submission } from "@/modules/board";
import type { TemplateVersion } from "@/modules/template-editor";

export type SubmissionDetail = Omit<Submission, "templateVersion"> & { templateVersion: TemplateVersion };
