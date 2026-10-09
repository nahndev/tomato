import clsx from 'clsx';
import { COLUMN_WIDTH, GRID_COLUMNS } from './grid.constants';

export interface ContainerGridProps {
  className?: string;
}

export function ContainerGrid({ className }: ContainerGridProps) {
  return (
    <div
      className={clsx('pointer-events-none absolute inset-0 flex', className)}
    >
      {Array.from({ length: GRID_COLUMNS }).map((_, index) => (
        <div
          key={index}
          className="h-full border-r border-dashed border-border/50 last:border-r-0"
          style={{ width: COLUMN_WIDTH }}
        />
      ))}
    </div>
  );
}
