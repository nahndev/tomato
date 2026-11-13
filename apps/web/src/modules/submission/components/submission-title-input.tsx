"use client";

import { Input } from "@tomato/ui";
import { useEffect, useState } from "react";
import { useSubmissionTitle } from "./submission-doc-provider";

interface SubmissionTitleInputProps {
  placeholder: string;
}

export function SubmissionTitleInput({ placeholder }: SubmissionTitleInputProps) {
  const { title, setTitle } = useSubmissionTitle();
  const [text, setText] = useState(title);

  useEffect(() => setText(title), [title]);

  function commit() {
    const next = text.trim();
    setText(next);
    if (next !== title) setTitle(next);
  }

  return (
    <Input
      value={text}
      onChange={(event) => setText(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => event.key === "Enter" && event.currentTarget.blur()}
      aria-label="Submission title"
      placeholder={placeholder}
      className="h-8 max-w-md border-transparent bg-transparent px-2 font-medium"
    />
  );
}
