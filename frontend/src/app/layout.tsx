"use client";

import "./globals.css";
import type { ReactNode } from "react";
import { SessionProvider } from "@/components/providers/SessionProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-neutral-100">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}


