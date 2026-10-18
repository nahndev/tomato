"use client";

import { SessionConditionType, WidgetType } from "@tomato/constants";
import type { SessionCondition } from "@tomato/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tomato/ui";
import { Settings2Icon } from "lucide-react";
import { useState } from "react";
import { WidgetItems } from "../../constants/widget-items.constants";
import { useSessionState } from "../../hooks/use-session-state";
import { useTemplateState } from "../../hooks/use-template-state";
import { useSessionActions } from "../../sync/hooks/use-session-actions";
import { useSessionId } from "./session-provider";

const CONDITION_LABELS: Record<SessionConditionType, string> = {
  [SessionConditionType.ALWAYS]: "Always",
  [SessionConditionType.BUTTON_CLICKED]: "When a button is clicked",
  [SessionConditionType.WIDGET_HAS_VALUE]: "When a widget has a value",
};

function createCondition(type: SessionConditionType, fallbackWidgetId: string | undefined): SessionCondition {
  if (type === SessionConditionType.ALWAYS) return { type };
  return { type, widgetId: fallbackWidgetId ?? "" };
}

/** Settings for a session: when it is shown, and removal. */
export function SessionSettingPopup() {
  const sessionId = useSessionId();
  const { session } = useSessionState();
  const { updateSession, removeSession } = useSessionActions();
  const { widgets, sessions, widgetToSession } = useTemplateState();
  const [isOpen, setIsOpen] = useState(false);
  const isOnlySession = Object.keys(sessions).length <= 1;

  const condition: SessionCondition = session?.condition ?? { type: SessionConditionType.ALWAYS };

  // A session can't gate its own visibility on its own, not-yet-shown contents.
  const widgetOptions = Object.values(widgets).filter((widget) => {
    if (widgetToSession[widget.id] === sessionId) return false;
    if (condition.type === SessionConditionType.BUTTON_CLICKED) return widget.type === WidgetType.BUTTON;
    if (condition.type === SessionConditionType.WIDGET_HAS_VALUE) return WidgetItems[widget.type].isDataField;
    return false;
  });

  function describeWidgetOption(widgetId: string): string {
    const label = widgets[widgetId]?.label || "(no label)";
    const owningSession = sessions[widgetToSession[widgetId]];
    return owningSession ? `${owningSession.name} · ${label}` : label;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="icon" aria-label="Session settings">
          <Settings2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Session settings</DialogTitle>
          <DialogDescription className="sr-only">Visibility and removal of this session.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Show this session</Label>
            <Select
              value={condition.type}
              onValueChange={(type) =>
                updateSession(sessionId, {
                  condition: createCondition(type as SessionConditionType, widgetOptions[0]?.id),
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(SessionConditionType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {CONDITION_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {condition.type !== SessionConditionType.ALWAYS && (
            <div className="flex flex-col gap-1.5">
              <Label>{condition.type === SessionConditionType.BUTTON_CLICKED ? "Button" : "Widget"}</Label>
              <Select
                value={condition.widgetId}
                onValueChange={(widgetId) => updateSession(sessionId, { condition: { ...condition, widgetId } })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {widgetOptions.map((widget) => (
                    <SelectItem key={widget.id} value={widget.id}>
                      {describeWidgetOption(widget.id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-1.5 border-t border-border pt-4">
            <Label>Danger zone</Label>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" size="sm" disabled={isOnlySession} className="justify-start">
                  Remove session
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove this session?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This deletes the session and every field in it. This can&apos;t be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => {
                      removeSession(sessionId);
                      setIsOpen(false);
                    }}
                  >
                    Remove session
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {isOnlySession && (
              <p className="text-xs text-muted-foreground">A template must have at least one session.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
