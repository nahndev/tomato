import { Button, Typography } from '@tomato/ui';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Typography as="h1" className="text-2xl font-semibold">Tomato Form</Typography>
      <Button><Typography>Get started</Typography></Button>
    </main>
  );
}
