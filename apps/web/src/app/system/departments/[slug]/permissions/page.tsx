import { PermissionSetup } from "@/modules/permissions";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PermissionSetup departmentId={slug} />;
}
