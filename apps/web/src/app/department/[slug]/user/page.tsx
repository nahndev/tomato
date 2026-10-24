import { UserList } from "@/modules/user";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <UserList departmentId={slug} />;
}
