import { Loader2Icon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn';

export type SpinnerProps = ComponentProps<typeof Loader2Icon>;

export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn('size-6 animate-spin text-primary', className)}
      {...props}
    />
  );
}
