"use client";

import { useEffect, useState } from "react";
import {
  TeacherAttemptDetail,
  TeacherClassDetail,
  TeacherStudentDetail,
  TeacherWritingReview,
} from "@/components/teacher/TeacherViews";
import { TeacherSpeakingReview } from "@/components/teacher/TeacherSpeakingViews";

type Kind = "class" | "student" | "attempt" | "writing" | "speaking";

export default function StaticDetailParam({ kind }: { kind: Kind }) {
  const [id, setId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setId(new URLSearchParams(window.location.search).get("id"));
    setLoaded(true);
  }, []);

  if (!loaded) return <div className="teacher-page"><p>Загрузка…</p></div>;
  if (!id) return <div className="teacher-page teacher-error">Не указан идентификатор записи.</div>;

  if (kind === "class") return <TeacherClassDetail classId={id} />;
  if (kind === "student") return <TeacherStudentDetail studentId={id} />;
  if (kind === "attempt") return <TeacherAttemptDetail attemptId={id} />;
  if (kind === "writing") return <TeacherWritingReview attemptId={id} />;
  return <TeacherSpeakingReview attemptId={id} />;
}
