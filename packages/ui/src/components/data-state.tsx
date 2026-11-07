import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Spinner } from './spinner';

function DataStateMessage(props: ComponentProps<'p'>) {
  return <p className="text-sm text-muted-foreground" {...props} />;
}

export interface DataStateProps {
  isLoading: boolean;
  hasError: boolean;
  isEmpty?: boolean;
  errorMessage: ReactNode;
  emptyMessage?: ReactNode;
  loadingClassName?: string;
  children?: ReactNode;
}

export function DataState({
  isLoading,
  hasError,
  isEmpty = false,
  errorMessage,
  emptyMessage,
  loadingClassName,
  children,
}: DataStateProps) {
  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center py-8 text-muted-foreground', loadingClassName)}>
        <Spinner />
      </div>
    );
  }
  if (hasError) return <DataStateMessage>{errorMessage}</DataStateMessage>;
  if (isEmpty) return <DataStateMessage>{emptyMessage}</DataStateMessage>;
  return <>{children}</>;
}
