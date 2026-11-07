import { MapPage } from "@/modules/map";

interface MapRoutePageProps {
  params: Promise<{ id: string }>;
}

export default async function MapRoutePage({ params }: MapRoutePageProps) {
  const { id } = await params;

  return <MapPage mapId={id} />;
}
