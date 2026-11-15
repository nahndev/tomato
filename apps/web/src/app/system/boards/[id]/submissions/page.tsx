import { BoardSubmissionPage } from "@/modules/board";

interface BoardSubmissionsPageProps {
  params: Promise<{ id: string }>;
}

export default async function BoardSubmissionsPage({ params }: BoardSubmissionsPageProps) {
  const { id } = await params;

  return <BoardSubmissionPage boardId={id} />;
}
