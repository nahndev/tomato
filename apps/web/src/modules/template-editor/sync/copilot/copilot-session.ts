import type { SessionProperties } from "@tomato/types";
import { z } from "zod";
import { EditorIconKey } from "../../template-editor.icons";
import { toEditorState } from "./copilot-widget-properties";

/** A session's editable fields in a shape a model can produce reliably; `condition` is not edited by the copilot. */
export const sessionPropertiesInput = z.object({
  name: z.string().trim().min(1).describe("Title of the session (wizard step), shown to the people filling the form."),
  icon: z.enum(EditorIconKey).optional().describe("Icon of the session, one of the supported icon keys."),
  description: z.string().optional().describe("Text under the title. A new line starts a new paragraph."),
});

export const sessionPatchInput = sessionPropertiesInput.partial();

export type SessionPropertiesInput = z.infer<typeof sessionPropertiesInput>;
export type SessionPatchInput = z.infer<typeof sessionPatchInput>;

export function toSessionProperties(input: SessionPropertiesInput): SessionProperties {
  const { description, name, ...scalars } = input;
  const properties: SessionProperties = { ...scalars, name: name.trim() };
  if (!description) return properties;
  return { ...properties, description: toEditorState(description) };
}

/** Only the keys the model sent; an empty description clears the stored one. */
export function toSessionPatch(input: SessionPatchInput): Partial<SessionProperties> {
  const { description, name, ...scalars } = input;
  const patch: Partial<SessionProperties> = { ...scalars };
  if (name !== undefined) patch.name = name.trim();
  if (description !== undefined) patch.description = description ? toEditorState(description) : undefined;
  return patch;
}
