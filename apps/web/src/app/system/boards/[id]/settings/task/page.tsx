import { BoardTaskViewSettingPage } from "@/modules/board-editor";

export default async function BoardTaskSettingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <BoardTaskViewSettingPage boardId={id} />;
}
