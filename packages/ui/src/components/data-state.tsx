import type { ComponentProps, ReactNode } from 'react';
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
  children: ReactNode;
}

export function DataState({
  isLoading,
  hasError,
  isEmpty = false,
  errorMessage,
  emptyMessage,
  children,
}: DataStateProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <Spinner />
      </div>
    );
  }
  if (hasError) return <DataStateMessage>{errorMessage}</DataStateMessage>;
  if (isEmpty) return <DataStateMessage>{emptyMessage}</DataStateMessage>;
  return <>{children}</>;
}
