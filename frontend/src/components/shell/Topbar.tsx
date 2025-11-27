"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Topbar() {
  const { data: session } = useSession();
  return (
    <div className="flex items-center justify-between">
      <div className="font-semibold">AI Teaching Assistant</div>
      <div className="flex items-center gap-3">
        <div className="text-sm text-neutral-400">
          {session?.user?.email ?? "Guest"}
        </div>
        {session ? (
          <Button size="sm" variant="ghost" onClick={() => signOut({ callbackUrl: "/login" })}>
            Sign out
          </Button>
        ) : null}
      </div>
    </div>
  );
}


