import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "../lib/cn";

type TypographyProps<T extends ElementType = "span"> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;

function Typography<T extends ElementType = "span">({
  as,
  className,
  ...props
}: TypographyProps<T>) {
  const Component: ElementType = as ?? "span";
  return (
    <Component data-slot="typography" className={cn(className)} {...props} />
  );
}

export { Typography };
export type { TypographyProps };
