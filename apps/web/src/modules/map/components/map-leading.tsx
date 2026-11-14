import { getDepartmentHref } from "@/modules/department";
import { Button, Typography } from "@tomato/ui";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import type { DepartmentMap } from "../map.types";

export function MapLeading({ map }: { map: DepartmentMap }) {
  return (
    <div className="flex flex-row items-center">
      <Button asChild variant="ghost" size="icon" aria-label="Back to maps">
        <Link href={`${getDepartmentHref(map.departmentId)}/maps`}>
          <ArrowLeftIcon />
        </Link>
      </Button>
      <Typography as="h1" className="truncate font-medium">{map.name}</Typography>
    </div>
  );
}
