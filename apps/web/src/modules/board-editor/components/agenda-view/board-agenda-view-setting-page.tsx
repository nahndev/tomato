import { Typography } from "@tomato/ui";

export function BoardAgendaViewSettingPage() {
  return (
    <section className="flex flex-col gap-3" aria-label="Agenda view">
      <div>
        <Typography as="h2" className="font-medium">Agenda view</Typography>
        <Typography as="p" className="text-sm text-muted-foreground">
          Show the submissions of this board on an agenda.
        </Typography>
      </div>
      <Typography as="p" className="text-sm text-muted-foreground">Not available yet.</Typography>
    </section>
  );
}
