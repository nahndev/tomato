import { BoardEditorPage } from "@/modules/board-editor";

interface BoardPageProps {
  params: Promise<{ id: string }>;
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { id } = await params;

  return <BoardEditorPage boardId={id} />;
}
