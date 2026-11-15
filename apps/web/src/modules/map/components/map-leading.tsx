import { Typography } from "@tomato/ui";
import { BackButton } from "@/shared/components/back-button";
import type { Map } from "../map.types";

export function MapLeading({ map }: { map: Map }) {
  return (
    <div className="flex flex-row items-center">
      <BackButton fallbackHref="/system/maps" label="Back to maps" />
      <Typography as="h1" className="truncate font-medium">{map.name}</Typography>
    </div>
  );
}
