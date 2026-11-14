"use client";

import type { MouseEvent } from "react";
import { useState } from "react";
import { useTimeout } from "usehooks-ts";
import { cn } from "../lib/cn";
import type { ButtonProps } from "./button";
import { Button } from "./button";

const COOLDOWN_MS = 500;

function CooldownButton({
  className,
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  const [isCoolingDown, setIsCoolingDown] = useState(false);

  useTimeout(() => setIsCoolingDown(false), isCoolingDown ? COOLDOWN_MS : null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setIsCoolingDown(true);
    onClick?.(event);
  };

  return (
    <Button
      data-cooldown={isCoolingDown}
      className={cn(
        "data-[cooldown=true]:is-disabled:cursor-wait data-[cooldown=true]:spin-border",
        className,
      )}
      disabled={disabled || isCoolingDown}
      onClick={handleClick}
      {...props}
    />
  );
}

export { CooldownButton };
