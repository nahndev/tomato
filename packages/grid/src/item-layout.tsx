import { useDraggable, useDragOperation } from '@dnd-kit/react';
import clsx from 'clsx';
import { useRef, type PropsWithChildren } from 'react';
import { useResizeObserver } from 'usehooks-ts';
import { GridDndType, type AbsoluteLayout } from './grid.types';

export type ItemLayoutProps = PropsWithChildren<{
  setHeight: (id: string, height: number) => void;
  computedLayout: AbsoluteLayout;
  isDisabled?: boolean;
}>;

export function ItemLayout({
  setHeight,
  computedLayout,
  isDisabled,
  children,
}: ItemLayoutProps) {
  const { source } = useDragOperation();
  const { ref: draggableRef } = useDraggable({
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
  );
}
