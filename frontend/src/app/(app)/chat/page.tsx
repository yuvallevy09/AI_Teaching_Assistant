"use client";

import { useAppStore } from "@/store/useAppStore";

export default function ChatPage() {
  const selectedCourseId = useAppStore((s) => s.selectedCourseId);
  return (
    <div>
      <h1 className="text-2xl font-semibold">Chat</h1>
      <p className="text-neutral-400 mt-2">
        {selectedCourseId ? `Using course: ${selectedCourseId}` : "General chat"}
      </p>
    </div>
  );
}


