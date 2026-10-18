"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  cn,
} from "@tomato/ui";
import { AppWindowIcon, PanelRightIcon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { TOOLBAR_DOCKED_WIDTH, TemplateMode } from "../../template-editor.constants";
import { ToolbarMode, useToolbarModeStore } from "../../stores/use-toolbar-mode-store";
import { useTemplateMode } from "../provider/template-builder-provider";
import { TOOLBAR_REGISTRY, ToolbarType, type ToolbarDefinition } from "./toolbar-registry";

interface ToolbarHeaderProps {
  label: string;
  mode: ToolbarMode;
  onToggleMode: () => void;
  className?: string;
  asDialogTitle?: boolean;
}

function ToolbarHeader({ label, mode, onToggleMode, className, asDialogTitle }: ToolbarHeaderProps) {
  const isPopup = mode === ToolbarMode.POPUP;
  const modeLabel = isPopup ? "Dock to sidebar" : "Open in popup";
  const titleClass = "text-xs leading-normal font-semibold tracking-wider text-muted-foreground uppercase";

  return (
    <div className={cn("flex items-center justify-between bg-muted p-2", className)}>
      {asDialogTitle ? <DialogTitle className={titleClass}>{label}</DialogTitle> : <h6 className={titleClass}>{label}</h6>}
      <Button type="button" variant="ghost" size="icon-xs" title={modeLabel} aria-label={modeLabel} onClick={onToggleMode}>
        {isPopup ? <PanelRightIcon /> : <AppWindowIcon />}
      </Button>
    </div>
  );
}

interface ToolbarPanelWrapperProps {
  label: string;
  mode: ToolbarMode;
  onToggleMode: () => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  children: ReactNode;
}

function ToolbarPanelWrapper({ label, mode, onToggleMode, isOpen, onOpenChange, children }: ToolbarPanelWrapperProps) {
  if (mode !== ToolbarMode.POPUP) {
    return (
      <div className="grid min-h-0 flex-1 grid-rows-[auto_1fr]">
        <ToolbarHeader label={label} mode={mode} onToggleMode={onToggleMode} />
        <div className="min-h-0 overflow-y-auto">{children}</div>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] max-w-md flex-col gap-0 overflow-hidden p-0">
        <ToolbarHeader label={label} mode={mode} onToggleMode={onToggleMode} className="pr-10" asDialogTitle />
        <DialogDescription className="sr-only">{label} menu in popup mode</DialogDescription>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

interface ToolbarMenuListProps {
  definitions: ToolbarDefinition[];
  type: ToolbarType;
  onSelect: (type: ToolbarType) => void;
}

function ToolbarMenuList({ definitions, type, onSelect }: ToolbarMenuListProps) {
  return (
    <div className="h-full bg-muted p-2">
      <div className="flex flex-col gap-2">
        {definitions.map(({ type: definitionType, label, icon: Icon }) => (
          <Button
            key={definitionType}
            type="button"
            variant={type === definitionType ? "default" : "ghost"}
            size="icon"
            aria-label={label}
            aria-pressed={type === definitionType}
            title={label}
            onClick={() => onSelect(definitionType)}
          >
            <Icon />
          </Button>
        ))}
      </div>
    </div>
  );
}

export function ToolbarPanel() {
  const [type, setType] = useState<ToolbarType>(ToolbarType.WIDGET);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const mode = useToolbarModeStore((state) => state.mode);
  const setMode = useToolbarModeStore((state) => state.setMode);
  const templateMode = useTemplateMode();
  const isPopup = mode === ToolbarMode.POPUP;

  useEffect(() => {
    void useToolbarModeStore.persist.rehydrate();
  }, []);

  const definitions = Object.values(TOOLBAR_REGISTRY).filter(
    (definition) => !definition.isEditOnly || templateMode === TemplateMode.EDIT,
  );
  const active = TOOLBAR_REGISTRY[definitions.some((definition) => definition.type === type) ? type : ToolbarType.WIDGET];

  function toggleMode() {
    setMode(isPopup ? ToolbarMode.DOCKED : ToolbarMode.POPUP);
    setIsPopupOpen(!isPopup);
  }

  function selectType(next: ToolbarType) {
    setType(next);
    if (isPopup) setIsPopupOpen(true);
  }

  return (
    <div className={cn("flex h-full flex-row border-l border-border bg-card text-foreground", !isPopup && TOOLBAR_DOCKED_WIDTH)}>
      <ToolbarPanelWrapper
        label={active.label}
        mode={mode}
        onToggleMode={toggleMode}
        isOpen={isPopupOpen}
        onOpenChange={setIsPopupOpen}
      >
        <active.Component />
      </ToolbarPanelWrapper>
      <ToolbarMenuList definitions={definitions} type={active.type} onSelect={selectType} />
    </div>
  );
}
