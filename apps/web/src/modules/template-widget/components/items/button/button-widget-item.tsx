"use client";

import type { ButtonAction } from "@/shared/types/template.types";
import { ButtonActionType } from "@tomato/constants";
import { Typography } from "@tomato/ui";
import { CooldownButton } from "@tomato/ui/client";
import { useMemo } from "react";
import { omit } from "remeda";
import { useWidgetConditions } from "../../../hooks/use-widget-conditions";
import type { FieldComponentProps } from "../../../template-widget.types";
import { useRunButtonAction } from "../../actions/use-run-button-action";
import { ButtonConditionTooltip } from "./button-condition-tooltip";

/** Records a truthy value on click so a session's BUTTON_CLICKED condition can read it back. */
export function ButtonWidgetItem({
  widget,
  onChange,
}: FieldComponentProps<unknown>) {
  const runAction = useRunButtonAction();
  const { isMet, errors } = useWidgetConditions(widget);
  const containerStyle = useMemo(
    () =>
      isMet
        ? widget.containerStyle
        : omit(widget.containerStyle ?? {}, ["background", "backgroundColor"]),
    [isMet, widget.containerStyle],
  );
  const labelStyle = useMemo(
    () => (isMet ? widget.textStyle : omit(widget.textStyle ?? {}, ["color"])),
    [isMet, widget.textStyle],
  );

  const actions: ButtonAction[] =
    widget.actions ??
    (widget.url ? [{ type: ButtonActionType.LINK, url: widget.url }] : []);

  async function handleClick() {
    onChange?.(true);
    for (const action of actions) {
      await runAction(action);
    }
  }

  return (
    <ButtonConditionTooltip errors={errors}>
      <CooldownButton
        type="button"
        disabled={!isMet}
        onClick={handleClick}
        className="w-full p-4"
        style={containerStyle}
      >
        <Typography style={labelStyle}>{widget.label || "Click me"}</Typography>
      </CooldownButton>
    </ButtonConditionTooltip>
  );
}
