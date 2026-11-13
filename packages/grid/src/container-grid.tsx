import clsx from 'clsx';
import { useContainerSettings } from './container-settings';
import { GRID_COLUMNS } from './grid.constants';

export interface ContainerGridProps {
  className?: string;
}

export function ContainerGrid({ className }: ContainerGridProps) {
  const columnWidth = useContainerSettings((settings) => settings.columnWidth);
  const isGridVisible = useContainerSettings((settings) => settings.isGridVisible);

  return (
    <div
      className={clsx(
        'pointer-events-none absolute inset-0 flex',
        !isGridVisible && 'hidden',
        className,
      )}
    >
      {Array.from({ length: GRID_COLUMNS }).map((_, index) => (
        <div
          key={index}
          className="h-full border-r border-dashed border-border/50 last:border-r-0"
          style={{ width: columnWidth }}
        />
      ))}
    </div>
  );
}
