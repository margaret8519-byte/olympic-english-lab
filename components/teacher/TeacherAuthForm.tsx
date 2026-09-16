"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function teacherAuthErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : typeof error === "object" && error && "message" in error ? String(error.message) : String(error || "");
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login credentials")) return "Неверный email или пароль.";
  if (normalized.includes("email not confirmed")) return "Сначала подтвердите email по ссылке из письма.";
  if (normalized.includes("user already registered")) return "Аккаунт с таким email уже существует.";
  if (normalized.includes("password") && normalized.includes("characters")) return "Пароль должен содержать не менее 8 символов.";
  if (normalized.includes("supabase") && normalized.includes("environment")) return "Сервис авторизации не настроен. Проверьте переменные окружения Supabase.";
  if (normalized.includes("failed to fetch") || normalized.includes("fetch failed") || normalized.includes("network") || normalized.includes("could not be resolved") || normalized.includes("load failed")) return "Не удалось подключиться к сервису авторизации. Попробуйте позже.";
  return "Не удалось выполнить вход. Попробуйте ещё раз.";
}

export default function TeacherAuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const displayName = String(form.get("displayName") || "").trim();
    const confirm = String(form.get("confirm") || "");
    if (mode === "register" && password !== confirm) {
      setError("Пароли не совпадают.");
      setPending(false);
      return;
    }

    try {
      const supabase = createClient();
      await supabase.auth.signOut({ scope: "local" });
      if (mode === "register") {
        const { data, error: authError } = await supabase.auth.signUp({ email, password, options: { data: { account_type: "teacher", display_name: displayName } } });
        if (authError) {
          setError(teacherAuthErrorMessage(authError));
        } else if (data.session) {
          router.replace("/teacher");
          router.refresh();
        } else {
          setMessage("Аккаунт создан. Подтвердите email, затем войдите.");
        }
      } else {
        const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) {
          setError(teacherAuthErrorMessage(authError));
        } else {
          const { data: profile, error: profileError } = await supabase.from("teacher_profiles").select("id").eq("id", data.user.id).maybeSingle();
          if (profileError || !profile) {
            await supabase.auth.signOut({ scope: "local" });
            setError(profileError ? teacherAuthErrorMessage(profileError) : "У этого аккаунта нет профиля учителя.");
          } else {
            router.replace("/teacher");
            router.refresh();
          }
        }
      }
    } catch (error) {
      setError(teacherAuthErrorMessage(error));
    } finally {
      setPending(false);
    }
  }

  return <form className="teacher-auth-form" onSubmit={submit}>
    {mode === "register" ? <label>Имя учителя<input name="displayName" required minLength={2}/></label> : null}
    <label>Email<input name="email" type="email" required autoComplete="email"/></label>
    <label>Пароль<input name="password" type="password" required minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"}/></label>
    {mode === "register" ? <label>Подтвердите пароль<input name="confirm" type="password" required minLength={8} autoComplete="new-password"/></label> : null}
    {error ? <p className="teacher-error">{error}</p> : null}
    {message ? <p className="teacher-success">{message}</p> : null}
    <button className="primary blue" disabled={pending}>{pending ? "Подождите…" : mode === "login" ? "Войти" : "Зарегистрироваться"}</button>
    <p>{mode === "login" ? <>Нет аккаунта? <Link href="/teacher/register">Зарегистрироваться</Link></> : <>Уже есть аккаунт? <Link href="/teacher/login">Войти</Link></>}</p>
  </form>;
}
