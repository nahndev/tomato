"use client";

import { ButtonActionType } from "@tomato/constants";
import type { ButtonAction } from "@/shared/types/template.types";
import { Button, Typography } from "@tomato/ui";
import { useMemo } from "react";
import { useRunButtonAction } from "../../actions/use-run-button-action";
import type { FieldComponentProps } from "../../../template-widget.types";

/** Records a truthy value on click so a session's BUTTON_CLICKED condition can read it back. */
export function ButtonWidgetItem({ widget, onChange }: FieldComponentProps<unknown>) {
  const containerStyle = useMemo(() => widget.containerStyle ?? {}, [widget.containerStyle]);
  const labelStyle = useMemo(() => widget.textStyle ?? {}, [widget.textStyle]);
  const runAction = useRunButtonAction();

  const actions: ButtonAction[] =
    widget.actions ?? (widget.url ? [{ type: ButtonActionType.LINK, url: widget.url }] : []);

  async function handleClick() {
    onChange?.(true);
    for (const action of actions) {
      await runAction(action);
    }
  }

  return (
    <Button type="button" onClick={handleClick} className="w-full p-4" style={containerStyle}>
      <Typography style={labelStyle}>{widget.label || "Click me"}</Typography>
    </Button>
  );
}
