import { BoardSettingsLayout } from "@/modules/board-editor";
import type { ReactNode } from "react";

interface BoardSettingsRouteLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

export default async function BoardSettingsRouteLayout({ children, params }: BoardSettingsRouteLayoutProps) {
  const { id } = await params;

  return <BoardSettingsLayout boardId={id}>{children}</BoardSettingsLayout>;
}
