"use client";

import { useState } from "react";
import { endStudentSession } from "@/lib/supabase/student-profile";

export default function SwitchStudentButton() {
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState("");

  async function switchStudent() {
    if (!window.confirm("Сменить ученика? Отправленные работы останутся у учителя. Черновики и прогресс, сохранённые только в этом браузере, будут удалены.")) return;
    setSwitching(true);
    setError("");
    try {
      await endStudentSession();
      window.location.replace("/start");
    } catch {
      setError("Не удалось завершить сессию. Попробуйте ещё раз.");
      setSwitching(false);
    }
  }

  return (
    <div className="student-class-join">
      <button type="button" onClick={switchStudent} disabled={switching}>
        {switching ? "Завершаем сессию…" : "Сменить ученика"}
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
