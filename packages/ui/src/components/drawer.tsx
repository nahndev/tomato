"use client";

import { Resizable } from "re-resizable";
import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "../lib/cn";

const WIDTH_STORAGE_PREFIX = "drawer-width:";
const DEFAULT_WIDTH = 480;
const MIN_WIDTH = 320;
const VIEWPORT_MARGIN = 32;

type DrawerDirection = "left" | "right";

const DrawerContext = React.createContext<{
  name?: string;
  direction: DrawerDirection;
  defaultWidth: number;
}>({ direction: "right", defaultWidth: DEFAULT_WIDTH });

function readCachedWidth(name: string | undefined, defaultWidth: number) {
  if (!name) return defaultWidth;
  try {
    const cached = Number(localStorage.getItem(WIDTH_STORAGE_PREFIX + name));
    return cached > 0 ? cached : defaultWidth;
  } catch {
    return defaultWidth;
  }
}

function cacheWidth(name: string | undefined, width: number) {
  if (!name) return;
  try {
    localStorage.setItem(WIDTH_STORAGE_PREFIX + name, String(width));
  } catch {
    // Storage unavailable: the width just won't persist.
  }
}

function Drawer({
  name,
  direction = "right",
  defaultWidth = DEFAULT_WIDTH,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root> & {
  name?: string;
  direction?: DrawerDirection;
  defaultWidth?: number;
}) {
  const context = React.useMemo(
    () => ({ name, direction, defaultWidth }),
    [name, direction, defaultWidth],
  );
  return (
    <DrawerContext.Provider value={context}>
      <DrawerPrimitive.Root
        data-slot="drawer"
        direction={direction}
        autoFocus
        {...props}
        handleOnly
      />
    </DrawerContext.Provider>
  );
}

function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-overlay/25 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  );
}

// Rendered inside the portal, so it mounts on open and reads the latest cached width.
function DrawerPanel({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  const { name, direction, defaultWidth } = React.useContext(DrawerContext);
  const maxWidth = window.innerWidth - VIEWPORT_MARGIN;
  const minWidth = Math.min(MIN_WIDTH, maxWidth);
  const [initialWidth] = React.useState(() =>
    Math.max(minWidth, Math.min(readCachedWidth(name, defaultWidth), maxWidth)),
  );

  return (
    <DrawerPrimitive.Content
      data-slot="drawer-content"
      className={cn(
        // `!` because Vaul's unlayered CSS beats Tailwind's layers.
        "fixed inset-y-2 z-50 rounded-lg border border-border bg-card text-foreground shadow-modal outline-none select-text! touch-auto! after:hidden! [--initial-transform:calc(100%+0.5rem)]",
        "data-[vaul-drawer-direction=right]:right-2",
        "data-[vaul-drawer-direction=left]:left-2",
        className,
      )}
      {...props}
    >
      <Resizable
        className="flex flex-col"
        defaultSize={{ width: initialWidth, height: "100%" }}
        minWidth={minWidth}
        maxWidth={maxWidth}
        enable={{ left: direction === "right", right: direction === "left" }}
        handleClasses={{
          [direction === "right" ? "left" : "right"]: "touch-none",
        }}
        onResizeStop={(_event, _direction, element) =>
          cacheWidth(name, element.offsetWidth)
        }
      >
        {children}
      </Resizable>
    </DrawerPrimitive.Content>
  );
}

function DrawerContent({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPanel {...props} />
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("flex flex-col gap-2 p-6", className)}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex justify-end gap-2 p-6", className)}
      {...props}
    />
  );
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
};
