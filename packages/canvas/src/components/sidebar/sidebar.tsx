"use client";

import { cn } from "@tomato/ui";
import {
  LayersIcon,
  SlidersHorizontalIcon,
  type LucideIcon,
} from "lucide-react";
import type { ComponentType } from "react";
import { SidePanel } from "../../canvas.constants";
import { useCanvas } from "../state-provider";
import { ToolbarButton } from "../toolbar/toolbar-button";
import { LayersPanel } from "./layers-panel";
import { PropertyPanel } from "./property-panel";

interface SidePanelDefinition {
  panel: SidePanel;
  label: string;
  icon: LucideIcon;
  Component: ComponentType;
}

const SIDE_PANELS: readonly SidePanelDefinition[] = [
  {
    panel: SidePanel.LAYERS,
    label: "Layers",
    icon: LayersIcon,
    Component: LayersPanel,
  },
  {
    panel: SidePanel.PROPERTY,
    label: "Property",
    icon: SlidersHorizontalIcon,
    Component: PropertyPanel,
  },
];

export function Sidebar({ className }: { className?: string }) {
  const activePanel = useCanvas((state) => state.activePanel);
  const togglePanel = useCanvas((state) => state.togglePanel);
  const active = SIDE_PANELS.find(({ panel }) => panel === activePanel);

  return (
    <aside
      className={cn(
        "flex shrink-0 flex-row border-l border-border bg-card text-foreground",
        className,
      )}
    >
      {active && (
        <section
          aria-label={active.label}
          className="flex w-80 flex-col gap-3 overflow-y-auto p-4"
        >
          <h2 className="text-sm font-medium">{active.label}</h2>
          <active.Component />
        </section>
      )}
      <nav
        aria-label="Panels"
        className="flex flex-col gap-1 border-l border-border p-1.5"
      >
        {SIDE_PANELS.map(({ panel, label, icon: Icon }) => (
          <ToolbarButton
            key={panel}
            label={label}
            aria-pressed={panel === activePanel}
            className="aria-pressed:bg-muted"
            onClick={() => togglePanel(panel)}
          >
            <Icon />
          </ToolbarButton>
        ))}
      </nav>
    </aside>
  );
}
