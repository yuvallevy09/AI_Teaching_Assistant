"use client";

import { create } from "zustand";

type AppState = {
  selectedCourseId: string | null;
  setSelectedCourseId: (courseId: string | null) => void;
};

export const useAppStore = create<AppState>((set) => ({
  selectedCourseId: null,
  setSelectedCourseId: (courseId) => set({ selectedCourseId: courseId })
}));


