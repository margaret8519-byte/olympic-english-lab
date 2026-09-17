export * from "./legacy.ts";

import type { AdaptiveQuestion, AdaptiveType } from "../grade-7-8/original/types.ts";
import type { QuestionBankItem, QuestionSet } from "../types.ts";
import { official2024ForGrade } from "../grade-9-10/official-2024.ts";
import { seniorOriginalObjective } from "./original.ts";
import {
  grade10WritingSets,
  grade11Registry as legacyGrade11Registry,
  objectiveBankForSeniorGrade as legacyObjectiveBankForSeniorGrade,
} from "./legacy.ts";

const shared2024 = official2024ForGrade(10);

export const grade10Official2024 = {
  listening: shared2024.listening,
  reading: shared2024.reading,
  "use-of-english": shared2024["use-of-english"],
} as const;

export const grade10Registry = {
  2024: { ...grade10Official2024, writing: shared2024.writing },
  writing: grade10WritingSets,
};

const asAdaptedGrade11Reading = (question: QuestionBankItem): QuestionBankItem =>
  question.grade === 11 && question.year === 2024 && question.section === "reading" && question.source === "official-vsosh-vzlet"
    ? {
        ...question,
        stage: "training",
        source: "original-olympic-english-lab",
        sourceLabel: "OLYMPIC ENGLISH LAB · адаптировано по варианту Взлёт 2024/2025",
        platformLabel: "OLYMPIC ENGLISH LAB",
        tags: Array.from(new Set([...question.tags, "adapted-source-excerpt"])),
      }
    : question;

const grade11Reading2024Adapted: QuestionSet = {
  ...legacyGrade11Registry[2024].reading,
  title: "Reading · адаптированная тренировка 2024/2025",
  items: legacyGrade11Registry[2024].reading.items.map(asAdaptedGrade11Reading),
};

export const grade11Registry = {
  ...legacyGrade11Registry,
  2024: {
    ...legacyGrade11Registry[2024],
    reading: grade11Reading2024Adapted,
  },
};

export const objectiveBankForSeniorGrade = (grade: 10 | 11): QuestionBankItem[] =>
  grade === 10
    ? [...Object.values(grade10Official2024).flatMap(set => set.items), ...seniorOriginalObjective(10)]
    : legacyObjectiveBankForSeniorGrade(11).map(asAdaptedGrade11Reading);

export const adaptiveBankForSeniorGrade = (grade: 10 | 11): AdaptiveQuestion[] =>
  objectiveBankForSeniorGrade(grade)
    .filter((question: QuestionBankItem) => question.section !== "listening")
    .map((question: QuestionBankItem) => ({
      ...question,
      grade,
      section: question.section as AdaptiveQuestion["section"],
      difficulty: "hard",
      type: (question.type === "true-false" ? "true-false-not-stated" : question.type) as AdaptiveType,
      options: question.options.map((label: string, index: number) => ({
        id: (label.match(/^[A-F]/i)?.[0] || String.fromCharCode(97 + index)).toLowerCase(),
        label: label.replace(/^[A-F]\s+/i, ""),
      })),
    })) as AdaptiveQuestion[];
