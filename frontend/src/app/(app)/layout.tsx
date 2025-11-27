import type { ReactNode } from "react";
import { Topbar } from "@/src/components/shell/Topbar";
import { Sidebar } from "@/src/components/shell/Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr]">
      <header className="border-b border-neutral-800 p-4">
        <Topbar />
      </header>
      <div className="grid grid-cols-[240px_1fr]">
        <aside className="border-r border-neutral-800 p-4">
          <Sidebar />
        </aside>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}


