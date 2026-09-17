import type { QuestionBankItem, QuestionSet } from "./types.ts";

type Grade = "7-8" | 9 | 10 | 11;

const sourceLabel = "Всероссийская олимпиада школьников по английскому языку, муниципальный этап, 2020/2021";

function writingSet({
  grade,
  id,
  title,
  text,
  min,
  max,
  points,
  requirements,
}: {
  grade: Grade;
  id: string;
  title: string;
  text: string;
  min: number;
  max: number;
  points: number;
  requirements: string[];
}): QuestionSet {
  const item: QuestionBankItem = {
    id,
    grade,
    year: 2020,
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
    tags: ["official", "2020", "2020-2021", "vzlet", "manual-review"],
    needsReview: true,
    wordLimit: { min, max },
    requirements,
  };
  return { id: `${id}-set`, title, section: "writing", instruction: item.instruction, items: [item] };
}

export const grade78Writing2020 = writingSet({
  grade: "7-8",
  id: "g78-2020-writing-01",
  title: "Writing · Взлёт 2020/2021 · 7–8 классы",
  text: "Write an exciting short story for an English magazine with the title ‘An Unforgettable Adventure’. Present the events in chronological order and make the ending clear and memorable.",
  min: 150,
  max: 210,
  points: 20,
  requirements: [
    "Use the title ‘An Unforgettable Adventure’",
    "Set the scene: time, place, weather, characters and what they are doing",
    "Describe an incident leading to the main event",
    "Describe the main event and the characters’ mood",
    "Conclude with what happened in the end and the characters’ or narrator’s reaction",
  ],
});

const seniorRequirements = [
  "Include a headline",
  "Describe an important photograph and explain when and where it was taken and why it is special",
  "Use and underline: package holiday, breathtaking, wander, come up with, word of mouth; change grammatical form if necessary",
  "Use and underline any two idioms from: to be part and parcel; off the beaten track; to have a way with; in high spirits",
  "Include both direct and indirect speech",
  "Describe feelings and emotions",
  "Finish with an impressive ending",
];

function senior(grade: 9 | 10 | 11): QuestionSet {
  return writingSet({
    grade,
    id: `g${grade}-2020-writing-01`,
    title: `Writing · Взлёт 2020/2021 · ${grade} класс (общий вариант 9–11)`,
    text: "Write an article for a school English magazine called ‘A Special Photograph!’ about a photograph that is important to you.",
    min: 220,
    max: 250,
    points: 20,
    requirements: seniorRequirements,
  });
}

export const grade9Writing2020 = senior(9);
export const grade10Writing2020 = senior(10);
export const grade11Writing2020 = senior(11);
