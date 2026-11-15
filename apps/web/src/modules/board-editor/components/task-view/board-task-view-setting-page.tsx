import { Typography } from "@tomato/ui";

export function BoardTaskViewSettingPage() {
  return (
    <section className="flex flex-col gap-3" aria-label="Task view">
      <div>
        <Typography as="h2" className="font-medium">Task view</Typography>
        <Typography as="p" className="text-sm text-muted-foreground">
          Show the submissions of this board as tasks.
        </Typography>
      </div>
      <Typography as="p" className="text-sm text-muted-foreground">Not available yet.</Typography>
    </section>
  );
}
