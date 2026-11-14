"use client";

import { Button, Spinner, toast, Typography } from "@tomato/ui";
import { UploadIcon } from "lucide-react";
import { usePublishTemplate } from "@/modules/template";
import { useTemplateId } from "../../provider/template-meta-provider";

export function PublishButton() {
  const templateId = useTemplateId();
  const { publish, isPublishing } = usePublishTemplate(templateId);

  async function handlePublish() {
    try {
      const { version } = await publish();
      toast.success(`Published v${version}`);
    } catch {
      toast.error("Could not publish the template");
    }
  }

  return (
    <Button size="sm" onClick={handlePublish} disabled={isPublishing}>
      {isPublishing ? <Spinner /> : <UploadIcon />}
      <Typography>Publish</Typography>
    </Button>
  );
}
