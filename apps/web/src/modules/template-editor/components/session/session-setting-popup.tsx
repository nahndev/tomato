"use client";

import { SessionConditionType, WidgetType } from "@tomato/constants";
import type { SessionCondition } from "@/shared/types/template.types";
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
  Typography,
} from "@tomato/ui";
import { Settings2Icon } from "lucide-react";
import { useState } from "react";
import { WidgetItems } from "@/modules/template-widget";
import { useSessionSnapshot } from "../../hooks/use-session-snapshot";
import { useTemplateSnapshot } from "../provider/template-snapshot-provider";
import { useTopLevelSessions } from "../../hooks/use-top-level-sessions";
import { useSessionActions } from "../../sync/hooks/use-session-actions";
import { useSessionId } from "../provider/session-id-provider";
import { getTopSessionId } from "../../utils/container-widget";
import { useShallow } from "@tomato/store-context";

const CONDITION_LABELS: Record<SessionConditionType, string> = {
  [SessionConditionType.ALWAYS]: "Always",
  [SessionConditionType.BUTTON_CLICKED]: "When a button is clicked",
  [SessionConditionType.WIDGET_HAS_VALUE]: "When a widget has a value",
};

function createCondition(type: SessionConditionType, fallbackWidgetId: string | undefined): SessionCondition {
  if (type === SessionConditionType.ALWAYS) return { type };
  return { type, widgetId: fallbackWidgetId ?? "" };
}

export function SessionSettingPopup() {
  const sessionId = useSessionId();
  const { session } = useSessionSnapshot();
  const { updateSession, removeSession } = useSessionActions();
  const { widgets, sessions, widgetToSession } = useTemplateSnapshot(
    useShallow(({ widgets, sessions, widgetToSession }) => ({ widgets, sessions, widgetToSession })),
  );
  const [isOpen, setIsOpen] = useState(false);
  const isOnlySession = useTopLevelSessions().length <= 1;
  const topSessionOf = (widgetId: string) => {
    const ownSessionId = widgetToSession[widgetId];
    return ownSessionId ? getTopSessionId({ widgets, widgetToSession }, ownSessionId) : undefined;
  };

  const condition: SessionCondition = session?.condition ?? { type: SessionConditionType.ALWAYS };

  // A session can't gate its own visibility on its own, not-yet-shown contents.
  const widgetOptions = Object.values(widgets).filter((widget) => {
    if (topSessionOf(widget.id) === sessionId) return false;
    if (condition.type === SessionConditionType.BUTTON_CLICKED) return widget.type === WidgetType.BUTTON || widget.type === WidgetType.SUBMIT_BUTTON;
    if (condition.type === SessionConditionType.WIDGET_HAS_VALUE) return WidgetItems[widget.type].isDataField;
    return false;
  });

  function describeWidgetOption(widgetId: string): string {
    const label = widgets[widgetId]?.label || "(no label)";
    const topSessionId = topSessionOf(widgetId);
    const owningSession = topSessionId ? sessions[topSessionId] : undefined;
    return owningSession ? `${owningSession.name} · ${label}` : label;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="icon-xs" aria-label="Session settings">
          <Settings2Icon className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle><Typography>Session settings</Typography></DialogTitle>
          <DialogDescription className="sr-only"><Typography>Visibility and removal of this session.</Typography></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label><Typography>Show this session</Typography></Label>
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
            <Label><Typography>Danger zone</Typography></Label>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" size="sm" disabled={isOnlySession} className="justify-start">
                  <Typography>Remove session</Typography>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle><Typography>Remove this session?</Typography></AlertDialogTitle>
                  <AlertDialogDescription>
                    <Typography>This deletes the session and every field in it. This can&apos;t be undone.</Typography>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel><Typography>Cancel</Typography></AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => {
                      removeSession(sessionId);
                      setIsOpen(false);
                    }}
                  >
                    <Typography>Remove session</Typography>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {isOnlySession && (
              <Typography as="p" className="text-xs text-muted-foreground">A template must have at least one session.</Typography>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
