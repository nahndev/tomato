"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { publishTemplate } from "../services/template-versions.service";
import { templateKeys } from "../template.keys";

export function usePublishTemplate(templateId: string) {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => publishTemplate(templateId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: templateKeys.versions(templateId) }),
  });

  return { publish: mutateAsync, isPublishing: isPending };
}
