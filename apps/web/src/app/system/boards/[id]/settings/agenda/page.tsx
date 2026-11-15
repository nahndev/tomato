import { BoardAgendaViewSettingPage } from "@/modules/board-editor";

export default async function BoardAgendaSettingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <BoardAgendaViewSettingPage boardId={id} />;
}
