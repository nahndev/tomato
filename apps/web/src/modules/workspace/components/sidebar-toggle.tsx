"use client";

import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import { useSidebarStore } from "../hooks/use-sidebar-store";
import { getSidebarItemClass } from "../workspace.utils";

export function SidebarToggle() {
  const isExtended = useSidebarStore((state) => state.isExtended);
  const toggle = useSidebarStore((state) => state.toggle);

  const Icon = isExtended ? PanelLeftCloseIcon : PanelLeftOpenIcon;
  const label = isExtended ? "Collapse sidebar" : "Extend sidebar";

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-expanded={isExtended}
      onClick={toggle}
      className={getSidebarItemClass(isExtended)}
    >
      <Icon className="size-5 shrink-0" strokeWidth={1.75} />
      {isExtended && <span className="truncate text-sm">Collapse</span>}
    </button>
  );
}
