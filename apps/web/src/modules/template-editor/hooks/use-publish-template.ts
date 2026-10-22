"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { publishTemplate } from "../services/template-editor.service";
import { templateEditorKeys } from "../template-editor.keys";

export function usePublishTemplate(templateId: string) {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => publishTemplate(templateId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: templateEditorKeys.versions(templateId) }),
  });

  return { publish: mutateAsync, isPublishing: isPending };
}
