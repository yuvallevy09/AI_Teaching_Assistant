"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useAppStore } from "@/store/useAppStore";

const mockCourses = [
  { id: "alg1-2025", title: "Algorithms 1" },
  { id: "linalg-2025", title: "Linear Algebra" }
];

export function Sidebar() {
  const pathname = usePathname();
  const setSelectedCourseId = useAppStore((s) => s.setSelectedCourseId);
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/chat"
          onClick={() => setSelectedCourseId(null)}
          className={cn(
            "block rounded px-2 py-1 text-sm hover:bg-neutral-800",
            pathname === "/chat" && "bg-neutral-800"
          )}
        >
          New Chat
        </Link>
      </div>
      <div className="space-y-2">
        <div className="text-xs uppercase text-neutral-500">My Courses</div>
        <Link
          href="/dashboard"
          className={cn(
            "block rounded px-2 py-1 text-sm hover:bg-neutral-800",
            pathname === "/dashboard" && "bg-neutral-800"
          )}
        >
          Dashboard
        </Link>
        <div className="space-y-1">
          {mockCourses.map((c) => (
            <Link
              key={c.id}
              href={`/courses/${c.id}`}
              onClick={() => setSelectedCourseId(c.id)}
              className={cn(
                "block rounded px-2 py-1 text-sm hover:bg-neutral-800",
                pathname?.startsWith(`/courses/${c.id}`) && "bg-neutral-800"
              )}
            >
              {c.title}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <Link
          href="/settings"
          className={cn(
            "block rounded px-2 py-1 text-sm text-neutral-400 hover:bg-neutral-800"
          )}
        >
          Settings
        </Link>
      </div>
    </div>
  );
}


