"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import TeacherShell from "@/components/teacher/TeacherShell";

function teacherLogin(error?: string) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${basePath}/teacher/login/${error ? `?error=${encodeURIComponent(error)}` : ""}`;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!active) return;
      if (userError || !user) {
        window.location.replace(teacherLogin());
        return;
      }
      const { data: profile, error } = await supabase
        .from("teacher_profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle();
      if (!active) return;
      if (error || !profile) {
        window.location.replace(teacherLogin("not-teacher"));
        return;
      }
      setName(profile.display_name || "Учитель");
      setReady(true);
    };
    void load();
    return () => { active = false; };
  }, []);

  if (!ready) return <main className="teacher-workspace"><div className="teacher-page"><p>Проверяем доступ…</p></div></main>;
  return <TeacherShell name={name}>{children}</TeacherShell>;
}
