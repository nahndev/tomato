import { getFileContentUrl } from "@/modules/file";
import { ImageVariant } from "@tomato/constants";
import { Picture } from "@tomato/storage-ui";
import { Button, ConfirmDialog } from "@tomato/ui";
import { MapIcon, PencilIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import type { MapInput } from "../map.schemas";
import { getFirstImage } from "../map.utils";
import { MapFormDialog } from "./map-form-dialog";
import type { DepartmentMap } from "../map.types";

interface MapCardProps {
  map: DepartmentMap;
  onRename: (id: string, input: MapInput) => Promise<void>;
  onDelete: (id: string) => void;
}

export function MapCard({ map, onRename, onDelete }: MapCardProps) {
  const imageFileId = getFirstImage(map.value)?.fileId;

  return (
    <li className="group relative flex flex-col gap-2 rounded-lg bg-card p-2 shadow-card">
      <Picture
        src={imageFileId && getFileContentUrl(imageFileId, ImageVariant.MEDIUM)}
        alt=""
        className="aspect-4/3 w-full rounded-md"
        fallback={
          <MapIcon
            className="absolute inset-0 m-auto size-10 text-muted-foreground"
            strokeWidth={1.25}
          />
        }
      />
      <div className="flex items-center gap-1 px-1">
        <Link
          href={`/maps/${map.id}`}
          className="min-w-0 flex-1 truncate font-medium after:absolute after:inset-0 focus-ring"
        >
          {map.name}
        </Link>
        <MapFormDialog map={map} onSubmit={(input) => onRename(map.id, input)}>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={`Rename ${map.name}`}
            className="relative text-muted-foreground"
          >
            <PencilIcon />
          </Button>
        </MapFormDialog>
        <ConfirmDialog
          title={`Delete “${map.name}”?`}
          description="Its pins are deleted too. This action cannot be undone."
          destructive="Delete"
          onDestructive={() => onDelete(map.id)}
        >
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={`Delete ${map.name}`}
            className="relative text-muted-foreground"
          >
            <Trash2Icon />
          </Button>
        </ConfirmDialog>
      </div>
    </li>
  );
}
