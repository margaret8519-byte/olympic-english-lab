import type { QuestionBankItem, QuestionSet } from "./types.ts";

type Grade = "7-8" | 9 | 10 | 11;

const sourceLabel = "Всероссийская олимпиада школьников по английскому языку, муниципальный этап, 2019/2020";

function writingSet({
  grade,
  id,
  title,
  text,
  min,
  max,
  points,
  requiredOpening,
  requirements,
}: {
  grade: Grade;
  id: string;
  title: string;
  text: string;
  min: number;
  max: number;
  points: number;
  requiredOpening?: string;
  requirements: string[];
}): QuestionSet {
  const item: QuestionBankItem = {
    id,
    grade,
    year: 2019,
    stage: "municipal",
    source: "official-vsosh-vzlet",
    sourceLabel,
    platformLabel: "Взлёт",
    section: "writing",
    skill: "Writing",
    subskill: "competition writing",
    difficulty: "advanced",
    type: "writing",
    instruction: `Write ${min}–${max} words and follow every requirement.`,
    text,
    options: [],
    acceptedAnswers: [],
    points,
    explanation: "Письменная работа проверяется учителем по официальным критериям.",
    tags: ["official", "2019", "2019-2020", "vzlet", "manual-review"],
    needsReview: true,
    wordLimit: { min, max },
    ...(requiredOpening ? { requiredOpening } : {}),
    requirements,
  };
  return { id: `${id}-set`, title, section: "writing", instruction: item.instruction, items: [item] };
}

export const grade78Writing2019 = writingSet({
  grade: "7-8",
  id: "g78-2019-writing-01",
  title: "Writing · Взлёт 2019/2020 · 7–8 классы",
  text: "Your friend has won a 10-day trip and asks you to choose between Camp Florida in the USA and a London city experience. Write an email giving your advice.",
  min: 120,
  max: 160,
  points: 14,
  requirements: [
    "Write an email to your friend; do not add a date or postal address",
    "Choose either the USA camp or the London experience",
    "Give three reasons for choosing that option",
    "Give one reason for not choosing the alternative",
  ],
});

const seniorOpening = "Last year I spent some time studying abroad.";
const seniorRequirements = [
  "Give the story a title",
  `Begin exactly: “${seniorOpening}”`,
  "Use and underline the words/expressions: union, forthcoming, break up, midterm, common room; change grammatical form if necessary",
  "Use and underline any two idioms from: pass with flying colours; back to basics; as easy as ABC; show of hands",
  "Include both direct and indirect speech",
  "Describe feelings and emotions",
  "Finish with an emotional ending",
];

function senior(grade: 9 | 10 | 11): QuestionSet {
  return writingSet({
    grade,
    id: `g${grade}-2019-writing-01`,
    title: `Writing · Взлёт 2019/2020 · ${grade} класс (общий вариант 9–11)`,
    text: "Write a short story for a youth magazine on any subject. It must use the official opening and the required vocabulary, idioms and speech features.",
    min: 220,
    max: 250,
    points: 20,
    requiredOpening: seniorOpening,
    requirements: seniorRequirements,
  });
}

export const grade9Writing2019 = senior(9);
export const grade10Writing2019 = senior(10);
export const grade11Writing2019 = senior(11);
