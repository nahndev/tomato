import { CollisionPriority } from '@dnd-kit/abstract';
import { pointerIntersection } from '@dnd-kit/collision';
import { useDragDropMonitor, useDroppable } from '@dnd-kit/react';
import clsx from 'clsx';
import { generateKeyBetween } from 'fractional-indexing';
import { useMemo, useState, type ReactNode } from 'react';
import { useDebounceValue, useMap } from 'usehooks-ts';
import { ContainerGrid } from './container-grid';
import {
  ContainerSettingsProvider,
  type ContainerSettings,
} from './container-settings';
import { ItemLayout } from './item-layout';
import { ResizableBox } from './resizable-box';
import {
  COLUMN_WIDTH,
  CONTAINER_MIN_HEIGHT,
  GRID_COLUMNS,
} from './grid.constants';
import {
  GridDndType,
  type ContainerOptions,
  type GridLayoutRect,
  type MovingLayout,
} from './grid.types';
import {
  AbsoluteLayoutUtils,
  getColumn,
  getMaxHeight,
  setMaxHeight,
} from './grid.utils';

export interface ContainerLayoutProps {
  id: string;
  layouts: Record<string, GridLayoutRect>;
  children: (id: string) => ReactNode;
  onMoving?: (id: string, column: number, idx: string) => void;
  onResize?: (id: string, span: number) => void;
  /** Inside another container's item: only a drop under the pointer counts, and it wins over the outer container. */
  isNested?: boolean;
  isDisabled?: boolean;
  options?: ContainerOptions;
}

export function ContainerLayout({
  id,
  children,
  layouts,
  onMoving,
  onResize,
  isNested,
  isDisabled,
  options,
}: ContainerLayoutProps) {
  const [heightMap, { set: setHeight }] = useMap<string, number>();
  const { ref, isDropTarget } = useDroppable({
    id,
    accept: GridDndType.WIDGET,
    ...(isNested && {
      collisionDetector: pointerIntersection,
      collisionPriority: CollisionPriority.Highest,
    }),
  });
  const [version, setVersion] = useState<number>(0);
  const [moving, setMoving] = useState<MovingLayout | null>(null);
  const [hidden, setHidden] = useState<string | null>(null);
  const isGridVisible = options?.isGridVisible ?? false;
  const columnWidth = options?.columnWidth ?? COLUMN_WIDTH;
  const settings = useMemo<ContainerSettings>(
    () => ({
      columnWidth,
      isGridVisible,
      isDisabled: isDisabled ?? false,
      isNested: isNested ?? false,
    }),
    [columnWidth, isGridVisible, isDisabled, isNested],
  );

  const computedLayouts = useMemo(() => {
    const absoluteLayouts = Object.entries(layouts)
      .map(([widgetId, gridLayout]) =>
        AbsoluteLayoutUtils.fromGridLayout(
          widgetId,
          gridLayout,
          heightMap.get(widgetId) ?? 0,
          columnWidth,
        ),
      )
      .sort((a, b) => (a.idx > b.idx ? 1 : -1));

    let maxHeights = new Array<number>(GRID_COLUMNS).fill(0);
    let isMovingRendered = false;
    for (const item of absoluteLayouts) {
      const top = getMaxHeight(maxHeights, item, columnWidth);
      if (
        !isMovingRendered &&
        moving &&
        AbsoluteLayoutUtils.isColliding({ ...item, top }, moving)
      ) {
        isMovingRendered = true;
        const ghost = {
          ...moving,
          top: getMaxHeight(maxHeights, moving, columnWidth),
        };
        maxHeights = setMaxHeight(maxHeights, ghost, columnWidth);
      }
      if (hidden && hidden === item.id) {
        continue;
      }
      item.top = getMaxHeight(maxHeights, item, columnWidth);
      maxHeights = setMaxHeight(maxHeights, item, columnWidth);
    }
    return absoluteLayouts;
  }, [layouts, heightMap, moving, version, columnWidth]);

  const containerHeight = useMemo(() => {
    const maxBottom = computedLayouts.reduce(
      (max, { top, height }) => Math.max(max, top + height),
      0,
    );

    const movingBottom =
      moving && moving.top + moving.height > maxBottom
        ? maxBottom + moving.height
        : 0;

    return Math.max(maxBottom, movingBottom, CONTAINER_MIN_HEIGHT);
  }, [computedLayouts, moving]);
  const [containerHeightDebounced] = useDebounceValue(containerHeight, 20);

  useDragDropMonitor({
    onDragMove({ operation: { source, target } }) {
      const droppableRect = target?.element?.getBoundingClientRect();
      const draggableRect = source?.element?.getBoundingClientRect();
      if (source) {
        setHidden(source.id as string);
      }
      if (isDropTarget && source && droppableRect && draggableRect) {
        setMoving({
          id: source.id as string,
          left: draggableRect.left - droppableRect.left,
          top: draggableRect.top - droppableRect.top,
          width: draggableRect.width,
          height: draggableRect.height,
        });
      } else {
        setMoving(null);
      }
    },
    onDragEnd({ operation: { source } }) {
      if (isDropTarget && moving && source && onMoving) {
        const nextIndex = computedLayouts.findIndex(
          (layout) => layout.top > moving.top,
        );
        const prevIdx =
          nextIndex > -1
            ? (computedLayouts[nextIndex - 1]?.idx ?? null)
            : (computedLayouts.at(-1)?.idx ?? null);
        const nextIdx =
          nextIndex > -1 ? (computedLayouts[nextIndex]?.idx ?? null) : null;
        onMoving(
          source.id as string,
          getColumn(moving, columnWidth),
          generateKeyBetween(prevIdx, nextIdx),
        );
      }
      setMoving(null);
      setHidden(null);
      setVersion(Date.now());
    },
  });

  return (
    <ContainerSettingsProvider value={settings}>
      <div
        ref={ref}
        className={clsx('relative', hidden && 'duration-300')}
        style={{
          width: GRID_COLUMNS * columnWidth,
          height: containerHeightDebounced,
        }}
      >
        <ContainerGrid />
        {computedLayouts.map((layout) => (
          <div
            className={clsx(
              'group/grid-item absolute',
              moving && moving.id !== layout.id && 'duration-300',
            )}
            key={layout.id}
            style={{
              left: layout.left,
              top: layout.top,
              width: layout.width,
              height: layout.height,
            }}
          >
            <ResizableBox
              value={layout}
              onChange={onResize && ((span) => onResize(layout.id, span))}
            >
              <ItemLayout setHeight={setHeight} computedLayout={layout}>
                {children(layout.id)}
              </ItemLayout>
            </ResizableBox>
          </div>
        ))}
      </div>
    </ContainerSettingsProvider>
  );
}
