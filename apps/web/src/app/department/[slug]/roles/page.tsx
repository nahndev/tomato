import { RoleList } from "@/modules/roles";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <RoleList departmentId={slug} />;
}
