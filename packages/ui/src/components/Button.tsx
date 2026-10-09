import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground',
        className,
      )}
      {...props}
    />
  );
}
