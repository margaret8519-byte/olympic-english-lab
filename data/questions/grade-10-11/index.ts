export * from "./legacy.ts";

import type { AdaptiveQuestion, AdaptiveType } from "../grade-7-8/original/types.ts";
import type { QuestionBankItem } from "../types.ts";
import { official2024ForGrade } from "../grade-9-10/official-2024.ts";
import { seniorOriginalObjective } from "./original.ts";
import {
  adaptiveBankForSeniorGrade as legacyAdaptiveBankForSeniorGrade,
  grade10WritingSets,
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

export const objectiveBankForSeniorGrade = (grade: 10 | 11): QuestionBankItem[] =>
  grade === 10
    ? [...Object.values(grade10Official2024).flatMap(set => set.items), ...seniorOriginalObjective(10)]
    : legacyObjectiveBankForSeniorGrade(11);

export const adaptiveBankForSeniorGrade = (grade: 10 | 11): AdaptiveQuestion[] =>
  grade === 10
    ? objectiveBankForSeniorGrade(grade)
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
        })) as AdaptiveQuestion[]
    : legacyAdaptiveBankForSeniorGrade(11);
