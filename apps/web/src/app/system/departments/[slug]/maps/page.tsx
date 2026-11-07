import { MapList } from "@/modules/map";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <MapList departmentId={slug} />;
}
