import { useDraggable, useDragOperation } from '@dnd-kit/react';
import clsx from 'clsx';
import { useRef, type PropsWithChildren } from 'react';
import { useResizeObserver } from 'usehooks-ts';
import { useContainerSettings } from './container-settings';
import { GridDndType, type AbsoluteLayout } from './grid.types';
import { ItemStateProvider } from './item-state';

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
  const isContainerDisabled = useContainerSettings((settings) => settings.isDisabled);
  const isDisabled = isContainerDisabled || !!isItemDisabled;
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

  return (
    <ItemStateProvider
      layout={computedLayout}
      isDisabled={isDisabled}
      isDragging={isDragging}
      isDropping={isDropping}
      isResizing={isResizing}
    >
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
