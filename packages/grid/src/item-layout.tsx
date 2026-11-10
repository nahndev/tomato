import { useDraggable, useDragOperation } from '@dnd-kit/react';
import clsx from 'clsx';
import { useMemo, useRef, type PropsWithChildren } from 'react';
import { useResizeObserver } from 'usehooks-ts';
import { useContainerSettings } from './container-settings';
import { GridDndType, type AbsoluteLayout } from './grid.types';
import { ItemStateProvider, type ItemState } from './item-state';

export type ItemLayoutProps = PropsWithChildren<{
  setHeight: (id: string, height: number) => void;
  computedLayout: AbsoluteLayout;
  isResizing: boolean;
  isDisabled?: boolean;
}>;

export function ItemLayout({
  setHeight,
  computedLayout,
  isResizing,
  isDisabled: isItemDisabled,
  children,
}: ItemLayoutProps) {
  const settings = useContainerSettings();
  const isDisabled = settings.isDisabled || !!isItemDisabled;
  const { source } = useDragOperation();
  const {
    ref: draggableRef,
    isDragging,
    isDropping,
  } = useDraggable({
    id: computedLayout.id,
    disabled: isDisabled,
    type: GridDndType.WIDGET,
  });

  const ref = useRef<HTMLDivElement | null>(null);
  useResizeObserver({
    ref: ref as React.RefObject<HTMLDivElement>,
    onResize: ({ height }) => setHeight(computedLayout.id, height ?? 0),
  });

  const state = useMemo<ItemState>(
    () => ({
      layout: computedLayout,
      isDisabled,
      isDragging,
      isDropping,
      isResizing,
    }),
    [computedLayout, isDisabled, isDragging, isDropping, isResizing],
  );

  return (
    <ItemStateProvider value={state}>
      <div
        ref={draggableRef}
        className={clsx(
          'item-layout',
          !source || (source.id !== computedLayout.id && 'duration-300'),
        )}
      >
        <div ref={ref} className="h-min w-full">
          {children}
        </div>
      </div>
    </ItemStateProvider>
  );
}
