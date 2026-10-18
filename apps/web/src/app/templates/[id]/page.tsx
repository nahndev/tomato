import { TemplateEditor, resolveTemplateMode } from "@/modules/template-editor";

interface TemplateEditorPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
}

export default async function TemplateEditorPage({ params, searchParams }: TemplateEditorPageProps) {
  const [{ id }, { mode }] = await Promise.all([params, searchParams]);

  return <TemplateEditor templateId={id} mode={resolveTemplateMode(mode)} />;
}
