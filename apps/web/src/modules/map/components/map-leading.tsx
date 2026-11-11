import { getDepartmentHref } from "@/modules/department";
import { Button } from "@tomato/ui";
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
      <h1 className="truncate font-medium">{map.name}</h1>
    </div>
  );
}
