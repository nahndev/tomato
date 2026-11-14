"use client";

import { ButtonActionType } from "@tomato/constants";
import type { ButtonAction } from "@/shared/types/template.types";
import { Button, Typography } from "@tomato/ui";
import { useMemo } from "react";
import { omit } from "remeda";
import { useWidgetConditions } from "../../../hooks/use-widget-conditions";
import { useRunButtonAction } from "../../actions/use-run-button-action";
import type { FieldComponentProps } from "../../../template-widget.types";
import { ButtonConditionTooltip } from "./button-condition-tooltip";

/** Records a truthy value on click so a session's BUTTON_CLICKED condition can read it back. */
export function ButtonWidgetItem({ widget, onChange }: FieldComponentProps<unknown>) {
  const runAction = useRunButtonAction();
  const { isMet, errors } = useWidgetConditions(widget);
  const containerStyle = useMemo(
    () => (isMet ? widget.containerStyle : omit(widget.containerStyle ?? {}, ["background", "backgroundColor"])),
    [isMet, widget.containerStyle],
  );
  const labelStyle = useMemo(
    () => (isMet ? widget.textStyle : omit(widget.textStyle ?? {}, ["color"])),
    [isMet, widget.textStyle],
  );

  const actions: ButtonAction[] =
    widget.actions ?? (widget.url ? [{ type: ButtonActionType.LINK, url: widget.url }] : []);

  async function handleClick() {
    onChange?.(true);
    for (const action of actions) {
      await runAction(action);
    }
  }

  return (
    <ButtonConditionTooltip errors={errors}>
      <Button type="button" disabled={!isMet} onClick={handleClick} className="w-full p-4" style={containerStyle}>
        <Typography style={labelStyle}>{widget.label || "Click me"}</Typography>
      </Button>
    </ButtonConditionTooltip>
  );
}
