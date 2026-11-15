"use client";

import { Button } from "@tomato/ui";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouteBeforeMount } from "@/shared/providers/route-history-provider";

interface BackButtonProps {
  fallbackHref: string;
  label: string;
}

export function BackButton({ fallbackHref, label }: BackButtonProps) {
  const backRoute = useRouteBeforeMount();

  return (
    <Button asChild variant="ghost" size="icon" aria-label={label}>
      <Link href={backRoute ?? fallbackHref}>
        <ArrowLeftIcon />
      </Link>
    </Button>
  );
}
