import type { LucideProps } from "lucide-react";
import { EDITOR_ICONS, isEditorIconKey } from "../template-editor.icons";

interface EditorIconProps extends Omit<LucideProps, "ref"> {
  icon: string | undefined;
}

export function EditorIcon({ icon, ...props }: EditorIconProps) {
  if (!isEditorIconKey(icon)) return null;
  const Icon = EDITOR_ICONS[icon];
  return <Icon {...props} />;
}
