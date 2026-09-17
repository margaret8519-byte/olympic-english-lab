"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Flag } from "lucide-react";
import { useState } from "react";
import { AppHeader } from "@/components/Brand";
import { useProfile } from "@/components/ProfileBadge";
import { writingSet } from "@/data/questions/grade-7-8/2022";
import { grade9Writing2022 } from "@/data/questions/grade-9/official/2022";
import { grade9Writing2023 } from "@/data/questions/grade-9/official/2023";
import { official2024ForGrade } from "@/data/questions/grade-9-10/official-2024";
import { grade10WritingSets, grade11WritingSets } from "@/data/questions/grade-10-11";
import { originalWritingSets } from "@/data/questions/writing-original";
import {
  grade78Writing2019,
  grade9Writing2019,
  grade10Writing2019,
  grade11Writing2019,
} from "@/data/questions/writing-official-2019";
import {
  grade78Writing2025,
  grade9Writing2025,
  grade10Writing2025,
  grade11Writing2025,
} from "@/data/questions/writing-official-2025";
import type { QuestionSet } from "@/data/questions/types";
import WritingSection from "./WritingSection";

const grade9Writing2024 = official2024ForGrade(9).writing;
const grade10Writing2024 = official2024ForGrade(10).writing;

function academicYear(year: number | null | undefined) {
  if (year == null) return "тренировка";
  return `${year}/${year + 1}`;
}

export default function GradeWritingSection() {
  const profile = useProfile();
  const grade = Number(profile.grade);
  const [selected, setSelected] = useState<QuestionSet | null>(null);
  const originals = [9, 10, 11].includes(grade) ? originalWritingSets(grade as 9 | 10 | 11) : [];
  const sets =
    grade === 7 || grade === 8
      ? [grade78Writing2019, writingSet, grade78Writing2025]
      : grade === 9
        ? [grade9Writing2019, grade9Writing2022, grade9Writing2023, grade9Writing2024, grade9Writing2025, ...originals]
        : grade === 10
          ? [grade10Writing2019, ...grade10WritingSets.filter(set => set.items[0]?.year !== 2024), grade10Writing2024, grade10Writing2025, ...originals]
          : grade === 11
            ? [grade11Writing2019, ...grade11WritingSets, grade11Writing2025, ...originals]
            : [];

  if (selected) return <WritingSection set={selected} />;
  if (sets.length)
    return (
      <main className="portal training adaptive-page">
        <AppHeader blue />
        <div className="training-variant-shell">
          <Link href="/training"><ArrowLeft /> Режимы</Link>
          <header>
            <span>OLYMPIC ENGLISH LAB</span>
            <h1>Выбери Writing</h1>
            <p>Официальные варианты «Взлёта» отмечены отдельно. Работу проверит учитель после отправки.</p>
          </header>
          <div className="training-variant-grid">
            {sets.map((set, index) => {
              const item = set.items[0];
              const official = item?.source === "official-vsosh-vzlet";
              return (
                <article key={set.id}>
                  <div className="training-variant-icon"><Flag /></div>
                  <small>{official ? "ОФИЦИАЛЬНЫЙ ВАРИАНТ" : "АВТОРСКАЯ ТРЕНИРОВКА"}</small>
                  <h2>{official ? `Writing · ${academicYear(item.year)}` : `Writing · тренировка ${index + 1}`}</h2>
                  <p>{grade} класс</p>
                  <strong>1 задание</strong>
                  <span>{official ? "Взлёт · ручная проверка" : "OLYMPIC ENGLISH LAB · ручная проверка"}</span>
                  <button type="button" onClick={() => setSelected(set)}>Начать</button>
                </article>
              );
            })}
          </div>
        </div>
      </main>
    );
  return (
    <main className="portal training">
      <AppHeader blue />
      <div className="adaptive-shell">
        <Link href="/dashboard"><ArrowLeft /> Главная</Link>
        <section className="adaptive-empty">
          <BookOpen />
          <h1>Writing для {profile.grade} класса сейчас подключается.</h1>
        </section>
      </div>
    </main>
  );
}
