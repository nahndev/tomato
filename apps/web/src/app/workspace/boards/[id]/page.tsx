import { BoardDetail } from "@/modules/board";

interface BoardPageProps {
  params: Promise<{ id: string }>;
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { id } = await params;

  return <BoardDetail boardId={id} />;
}
