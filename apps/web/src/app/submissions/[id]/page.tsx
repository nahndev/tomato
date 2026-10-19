import { SubmissionPage } from "@/modules/submission";

interface SubmissionRoutePageProps {
  params: Promise<{ id: string }>;
}

export default async function SubmissionRoutePage({ params }: SubmissionRoutePageProps) {
  const { id } = await params;

  return <SubmissionPage submissionId={id} />;
}
