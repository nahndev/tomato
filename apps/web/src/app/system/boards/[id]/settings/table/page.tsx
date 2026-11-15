import { BoardTableViewSettingPage } from "@/modules/board-editor";

export default async function BoardTableSettingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <BoardTableViewSettingPage boardId={id} />;
}
