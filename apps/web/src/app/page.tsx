import { Typography } from "@tomato/ui";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Typography as="h1" className="text-2xl font-semibold">
        Tomato Form
      </Typography>
      <Link href="/system">
        <Typography>Get started</Typography>
      </Link>
    </main>
  );
}
