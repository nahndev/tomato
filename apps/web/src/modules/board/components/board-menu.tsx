"use client";

import { SidebarNav } from "@/modules/system";
import { SquareKanbanIcon } from "lucide-react";
import { useBoardMenu } from "../hooks/use-board-menu";

export function BoardMenu() {
  const { boards } = useBoardMenu();

  return (
    <SidebarNav
      items={[
        {
          label: "Boards",
          children: boards.map(({ id, name }) => ({
            label: name,
            href: `/system/boards/${id}/submissions`,
            icon: SquareKanbanIcon,
          })),
        },
      ]}
    />
  );
}
