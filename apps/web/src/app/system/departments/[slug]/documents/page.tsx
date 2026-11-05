import { DocumentList } from "@/modules/documents";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <DocumentList departmentId={slug} />;
}
