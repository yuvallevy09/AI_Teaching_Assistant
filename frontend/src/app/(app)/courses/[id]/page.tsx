\"use client\";

import { useEffect } from \"react\";
import { useAppStore } from \"@/src/store/useAppStore\";

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const setSelectedCourseId = useAppStore((s) => s.setSelectedCourseId);
  useEffect(() => {
    setSelectedCourseId(params.id);
  }, [params.id, setSelectedCourseId]);

  return (
    <div>
      <h1 className=\"text-2xl font-semibold\">Course: {params.id}</h1>
      <p className=\"text-neutral-400 mt-2\">Course detail placeholder.</p>
    </div>
  );
}


