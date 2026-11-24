import { Badge, cn, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Typography } from "@tomato/ui";
import { sortOptions } from "@/modules/template-widget";
import type { Widget } from "@/shared/types/template.types";

interface TaskOptionSelectProps {
  widget: Widget | undefined;
  value: unknown;
  label: string | null;
  placeholder: string;
  className?: string;
  onChange: (key: string) => void;
}

export function TaskOptionSelect({ widget, value, label, placeholder, className, onChange }: TaskOptionSelectProps) {
  const options = sortOptions(widget?.options);
  const selectedKey = Array.isArray(value) ? value[0] : value;
  const selectedLabel = options.find((option) => option.key === selectedKey)?.value ?? label;

  if (!widget || options.length === 0) {
    return (
      <div className={cn("flex w-32 shrink-0", className)}>
        {selectedLabel && (
          <Badge className="max-w-full">
            <Typography className="truncate">{selectedLabel}</Typography>
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Select
      value={typeof selectedKey === "string" ? selectedKey : ""}
      onValueChange={onChange}
    >
      <SelectTrigger
        size="sm"
        aria-label={widget.label || placeholder}
        className={cn(
          "relative z-10 h-7 w-32 shrink-0 rounded-full border-transparent bg-soft px-2.5 text-xs font-medium text-soft-foreground hover:bg-soft-hover data-[placeholder]:border-dashed data-[placeholder]:border-border data-[placeholder]:bg-transparent",
          className,
        )}
      >
        <SelectValue placeholder={placeholder}>
          {selectedLabel && <Typography className="truncate">{selectedLabel}</Typography>}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.key} value={option.key}>
            <Typography>{option.value}</Typography>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
