import { DEFAULT_THEME } from "@tomato/constants";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tomato",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme={DEFAULT_THEME}>
      <body>{children}</body>
    </html>
  );
}
