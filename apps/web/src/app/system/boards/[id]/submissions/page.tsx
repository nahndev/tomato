import { BoardSubmissionPage } from "@/modules/board";

interface BoardSubmissionsPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ view?: string }>;
}

export default async function BoardSubmissionsPage({ params, searchParams }: BoardSubmissionsPageProps) {
  const { id } = await params;
  const { view } = await searchParams;

  return <BoardSubmissionPage boardId={id} view={view} />;
}
