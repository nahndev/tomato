"use client";

import { Button } from "@tomato/ui";
import type { FormEvent } from "react";
import { useState } from "react";

interface TemplateFilterProps {
  onFilter: (query: string) => void;
}

export function TemplateFilter({ onFilter }: TemplateFilterProps) {
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onFilter(query.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Filter templates"
        aria-label="Filter templates"
        className="h-10 min-w-0 flex-1 rounded-md border border-input bg-background px-3 focus-visible:outline-2 focus-visible:outline-ring"
      />
      <Button type="submit">Filter</Button>
    </form>
  );
}
