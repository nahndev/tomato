import { BOARD_SETTING_SECTIONS } from "@/modules/board-editor";
import { getFirstNavHref } from "@/modules/system";
import { redirect } from "next/navigation";

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/system/boards/${id}/settings${getFirstNavHref(BOARD_SETTING_SECTIONS) ?? ""}`);
}
