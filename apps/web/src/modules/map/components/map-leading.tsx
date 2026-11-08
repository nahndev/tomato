import { getDepartmentHref } from "@/modules/department";
import type { DepartmentMap } from "@tomato/types";
import { Button } from "@tomato/ui";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export function MapLeading({ map }: { map: DepartmentMap }) {
  return (
    <div className="flex flex-row items-center">
      <Button asChild variant="ghost" size="icon" aria-label="Back to maps">
        <Link href={`${getDepartmentHref(map.departmentId)}/maps`}>
          <ArrowLeftIcon />
        </Link>
      </Button>
      <h1 className="truncate font-medium">{map.name}</h1>
    </div>
  );
}
