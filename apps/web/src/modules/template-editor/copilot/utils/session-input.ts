import type { SessionProperties } from "@/shared/types/template.types";
import { z } from "zod";
import { EditorIconKey } from "@/modules/template-widget";
import { toRichTextState } from "./widget-properties-input";

/** `condition` is not edited by the copilot. */
export const sessionPropertiesInputSchema = z.object({
  name: z.string().trim().min(1).describe("Title of the session (wizard step), shown to the people filling the form."),
  icon: z.enum(EditorIconKey).optional().describe("Icon of the session, one of the supported icon keys."),
  description: z.string().optional().describe("Text under the title. A new line starts a new paragraph."),
});

export const sessionPatchInputSchema = sessionPropertiesInputSchema.partial();

export type SessionPropertiesInput = z.infer<typeof sessionPropertiesInputSchema>;
export type SessionPatchInput = z.infer<typeof sessionPatchInputSchema>;

export function toSessionProperties(input: SessionPropertiesInput): SessionProperties {
  const { description, name, ...scalars } = input;
  const properties: SessionProperties = { ...scalars, name: name.trim() };
  if (!description) return properties;
  return { ...properties, description: toRichTextState(description) };
}

/** An empty description clears the stored one. */
export function toSessionPatch(input: SessionPatchInput): Partial<SessionProperties> {
  const { description, name, ...scalars } = input;
  const patch: Partial<SessionProperties> = { ...scalars };
  if (name !== undefined) patch.name = name.trim();
  if (description !== undefined) patch.description = description ? toRichTextState(description) : undefined;
  return patch;
}
