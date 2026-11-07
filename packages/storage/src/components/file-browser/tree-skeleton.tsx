import { Skeleton } from "@tomato/ui";

const ROW_WIDTHS = ["w-1/3", "w-1/2", "w-2/5", "w-3/5", "w-1/4", "w-2/5"];

export function TreeSkeleton({ label }: { label: string }) {
  return (
    <div role="status" aria-label={label} className="flex flex-col gap-0.5 p-1.5">
      {ROW_WIDTHS.map((width, index) => (
        <div key={index} className="flex min-h-10 items-center gap-2 px-2">
          <Skeleton className="size-8 shrink-0" />
          <Skeleton className={`h-3.5 ${width}`} />
        </div>
      ))}
    </div>
  );
}
