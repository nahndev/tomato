import clsx from 'clsx';
import { Resizable, type ResizeCallback } from 're-resizable';
import { useState, type ReactNode } from 'react';
import { COLUMN_WIDTH, GRID_COLUMNS } from './grid.constants';
import type { AbsoluteLayout } from './grid.types';
import { getResizeSpan } from './grid.utils';

export interface ResizableBoxProps {
  value: AbsoluteLayout;
  isDisabled?: boolean;
  onChange?: (span: number) => void;
  children: ReactNode;
}

export function ResizableBox({
  value,
  isDisabled,
  onChange,
  children,
}: ResizableBoxProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [initialWidth, setInitialWidth] = useState(0);

  const handleResizeStart = () => {
    setIsResizing(true);
    setInitialWidth(value.width);
  };

  const handleResizeStop = () => {
    setIsResizing(false);
    setInitialWidth(0);
  };

  const handleResize: ResizeCallback = (_e, _d, _el, delta) => {
    if (delta.width !== 0) {
      const width = initialWidth + delta.width;
      onChange?.(getResizeSpan({ ...value, width }));
    }
  };

  return (
    <Resizable
      className="relative"
      size={{ width: value.width, height: 'auto' }}
      enable={{ right: !isDisabled }}
      grid={[COLUMN_WIDTH, 1]}
      maxWidth={COLUMN_WIDTH * GRID_COLUMNS - value.left}
      minWidth={COLUMN_WIDTH}
      handleStyles={{ right: { width: 4, right: 4 } }}
      handleClasses={{
        right: clsx('my-auto flex flex-col transition-colors'),
      }}
      handleComponent={{
        right: (
          <>
            <div className="flex-1" />
            <button
              type="button"
              tabIndex={-1}
              aria-hidden
              className={clsx(
                'h-4 w-1 cursor-[inherit]',
                !isDisabled &&
                  'cursor-ew-resize group-hover/grid-item:bg-primary/60',
              )}
            />
            <div className="flex-1" />
          </>
        ),
      }}
      onResizeStop={handleResizeStop}
      onResizeStart={handleResizeStart}
      onResize={handleResize}
    >
      <div inert={isResizing}>{children}</div>
    </Resizable>
  );
}
