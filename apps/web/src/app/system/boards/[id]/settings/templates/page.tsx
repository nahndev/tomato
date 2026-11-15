import { BoardTemplateSettingPage } from "@/modules/board-editor";

export default async function BoardTemplatesSettingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <BoardTemplateSettingPage boardId={id} />;
}
