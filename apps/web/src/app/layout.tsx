import { THEME_COOKIE, resolveTheme } from "@/modules/theme";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tomato",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const theme = resolveTheme((await cookies()).get(THEME_COOKIE)?.value);

  return (
    <html lang="en" data-theme={theme}>
      <body>{children}</body>
    </html>
  );
}
