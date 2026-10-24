"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const ITEM_HEIGHT = 36;
const MAX_LIST_HEIGHT = 240;
const OVERSCAN = 6;

interface VirtualSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface VirtualSelectProps {
  options: VirtualSelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  isDisabled?: boolean;
  renderOption?: (option: VirtualSelectOption) => ReactNode;
  className?: string;
  "aria-label"?: string;
}

interface VirtualListProps {
  options: VirtualSelectOption[];
  value?: string;
  searchPlaceholder: string;
  emptyMessage: string;
  renderOption?: (option: VirtualSelectOption) => ReactNode;
  onSelect: (value: string) => void;
}

function VirtualList({ options, value, searchPlaceholder, emptyMessage, renderOption, onSelect }: VirtualListProps) {
  const listId = useId();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, options.findIndex((o) => o.value === value)));

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return keyword ? options.filter((option) => option.label.toLowerCase().includes(keyword)) : options;
  }, [options, query]);

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: OVERSCAN,
  });

  useEffect(() => {
    virtualizer.scrollToIndex(activeIndex);
    // Only on mount: jump to the selected option.
  }, []);

  function moveActive(next: number) {
    if (filtered.length === 0) return;
    const index = Math.min(Math.max(next, 0), filtered.length - 1);
    setActiveIndex(index);
    virtualizer.scrollToIndex(index);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActive(activeIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(activeIndex - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = filtered[activeIndex];
      if (option && !option.disabled) onSelect(option.value);
    }
  }

  return (
    <div className="grid gap-1">
      <Input
        autoFocus
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(0);
        }}
        onKeyDown={handleKeyDown}
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
        aria-controls={listId}
        className="h-8"
      />
      {filtered.length === 0 ? (
        <p className="px-2 py-3 text-center text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <div ref={scrollRef} id={listId} role="listbox" className="overflow-auto" style={{ maxHeight: MAX_LIST_HEIGHT }}>
          <div className="relative w-full" style={{ height: virtualizer.getTotalSize() }}>
            {virtualizer.getVirtualItems().map((row) => {
              const option = filtered[row.index];
              const isSelected = option.value === value;
              return (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled}
                  data-active={row.index === activeIndex || undefined}
                  onMouseMove={() => setActiveIndex(row.index)}
                  onClick={() => !option.disabled && onSelect(option.value)}
                  className={cn(
                    "absolute top-0 left-0 flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm select-none",
                    "data-[active]:bg-muted data-[active]:text-foreground aria-disabled:pointer-events-none aria-disabled:opacity-50",
                  )}
                  style={{ height: row.size, transform: `translateY(${row.start}px)` }}
                >
                  <span className="line-clamp-1">{renderOption ? renderOption(option) : option.label}</span>
                  {isSelected && <CheckIcon className="absolute right-2 size-4" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function VirtualSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select",
  searchPlaceholder = "Search",
  emptyMessage = "No results",
  isDisabled,
  renderOption,
  className,
  "aria-label": ariaLabel,
}: VirtualSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  function handleSelect(nextValue: string) {
    onValueChange(nextValue);
    setIsOpen(false);
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={isOpen}
          aria-label={ariaLabel}
          disabled={isDisabled}
          data-slot="virtual-select-trigger"
          data-placeholder={selected ? undefined : ""}
          className={cn(
            "flex h-10 w-fit items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 text-sm whitespace-nowrap text-foreground motion-base outline-hidden focus-visible:border-focus focus-visible:shadow-[0_0_0_3px_color-mix(in_oklab,var(--focus)_25%,transparent)] disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted-foreground",
            className,
          )}
        >
          <span className="line-clamp-1">
            {selected ? (renderOption ? renderOption(selected) : selected.label) : placeholder}
          </span>
          <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-(--radix-popover-trigger-width) min-w-48 p-1">
        <VirtualList
          options={options}
          value={value}
          searchPlaceholder={searchPlaceholder}
          emptyMessage={emptyMessage}
          renderOption={renderOption}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  );
}

export { VirtualSelect };
export type { VirtualSelectOption, VirtualSelectProps };
