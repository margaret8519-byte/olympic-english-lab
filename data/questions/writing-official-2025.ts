import type { QuestionBankItem, QuestionSet } from "./types.ts";

type Grade = "7-8" | 9 | 10 | 11;

const sourceLabel = "Всероссийская олимпиада школьников по английскому языку, муниципальный этап, 2025/2026";

function writingSet(
  grade: Grade,
  id: string,
  title: string,
  text: string,
  min: number,
  max: number,
  requiredOpening: string,
  requirements: string[],
): QuestionSet {
  const item: QuestionBankItem = {
    id,
    grade,
    year: 2025,
    stage: "municipal",
    source: "official-vsosh-vzlet",
    sourceLabel,
    platformLabel: "Взлёт",
    section: "writing",
    skill: "Writing",
    subskill: "competition writing",
    difficulty: "advanced",
    type: "writing",
    instruction: `Write ${min}–${max} words. Follow every requirement and underline the required language features.`,
    text,
    options: [],
    acceptedAnswers: [],
    points: 20,
    explanation: "Письменная работа проверяется учителем по официальным критериям.",
    tags: ["official", "2025", "vzlet", "manual-review"],
    needsReview: true,
    wordLimit: { min, max },
    requiredOpening,
    requirements,
  };
  return { id: `${id}-set`, title, section: "writing", instruction: item.instruction, items: [item] };
}

const juniorOpening = "Oliver was walking in the park when suddenly the sky turned an unnatural shade of green.";
export const grade78Writing2025 = writingSet(
  "7-8",
  "g78-2025-writing-01",
  "Writing · Взлёт 2025/2026 · 7–8 классы",
  "Write a science-fiction story for a teenage online magazine. Start with the required sentence, include meeting aliens and a description of their spacecraft, use two different idioms, and finish with a happy ending.",
  120,
  200,
  juniorOpening,
  ["Give the story a title connected with the plot", `Begin exactly: “${juniorOpening}”`, "Include a meeting with aliens", "Describe their spacecraft", "Use and underline two different idioms", "Give the story a happy ending"],
);

const seniorOpening = "The old man in the park told me the statue would make one wish come true, but he never told me what it would cost.";

function shared910(grade: 9 | 10): QuestionSet {
  return writingSet(
    grade,
    `g${grade}-2025-writing-01`,
    `Writing · Взлёт 2025/2026 · ${grade} класс`,
    "Write a short competition story. The story must begin with the required sentence and clearly show the wish and its unexpected cost. Use the required language features and end with a moral.",
    180,
    250,
    seniorOpening,
    ["Give the story a title", `Begin exactly: “${seniorOpening}”`, "Clearly describe the wish and its unexpected cost", "Use and underline at least two different modal verbs", "Use and underline at least two different phrasal verbs", "Make sure the story has a moral"],
  );
}

export const grade9Writing2025 = shared910(9);
export const grade10Writing2025 = shared910(10);

export const grade11Writing2025 = writingSet(
  11,
  "g11-2025-writing-01",
  "Writing · Взлёт 2025/2026 · 11 класс",
  "Write a short competition story. The story must begin with the required sentence and clearly show the wish and its unexpected cost. Use the required language features and end with a meaningful moral.",
  180,
  250,
  seniorOpening,
  ["Give the story a title", `Begin exactly: “${seniorOpening}”`, "Clearly describe the wish and its unexpected cost", "Use and underline at least two cases of reported speech", "Use and underline at least two different phrasal verbs", "Make sure the story has a meaningful moral"],
);
