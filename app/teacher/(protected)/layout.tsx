"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import TeacherShell from "@/components/teacher/TeacherShell";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!active) return;
      if (!user) {
        router.replace("/teacher/login");
        return;
      }
      const { data: profile, error } = await supabase
        .from("teacher_profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle();
      if (!active) return;
      if (error || !profile) {
        router.replace("/teacher/login?error=not-teacher");
        return;
      }
      setName(profile.display_name || "Учитель");
      setReady(true);
    };
    void load();
    return () => { active = false; };
  }, [router]);

  if (!ready) return <main className="teacher-workspace"><div className="teacher-page"><p>Проверяем доступ…</p></div></main>;
  return <TeacherShell name={name}>{children}</TeacherShell>;
}
