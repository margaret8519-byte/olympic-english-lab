"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const routes: Array<[RegExp, string]> = [
  [/^\/teacher\/classes\/([^/]+)\/?$/, "/teacher/classes/detail/"],
  [/^\/teacher\/students\/([^/]+)\/?$/, "/teacher/students/detail/"],
  [/^\/teacher\/attempts\/([^/]+)\/?$/, "/teacher/attempts/detail/"],
  [/^\/teacher\/writing\/([^/]+)\/?$/, "/teacher/writing/detail/"],
  [/^\/teacher\/speaking\/([^/]+)\/?$/, "/teacher/speaking/detail/"],
];

export default function NotFound() {
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    let path = window.location.pathname;
    if (basePath && path.startsWith(basePath)) path = path.slice(basePath.length) || "/";
    for (const [pattern, target] of routes) {
      const match = path.match(pattern);
      if (match) {
        window.location.replace(`${basePath}${target}?id=${encodeURIComponent(match[1])}`);
        return;
      }
    }
    setRedirecting(false);
  }, []);

  if (redirecting) return <main className="teacher-page"><p>Открываем страницу…</p></main>;
  return <main className="teacher-page"><h1>Страница не найдена</h1><p><Link href="/">Вернуться на главную</Link></p></main>;
}
