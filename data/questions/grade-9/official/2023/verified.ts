import type { QuestionSet } from "../../../types.ts";
import { grade9Listening2023, grade9Reading2023, grade9UseOfEnglish2023 } from "./index.ts";

/**
 * Verified answer keys for the 2023/2024 Moscow Region municipal stage, Grade 9.
 * Task source: https://tasks.olimpiada.ru/upload/files/tasks/88/2023/tasks-engl-9-pism-mun-mosobl-23-24.pdf
 * Listening source material is the same Cambridge material used in the official paper:
 * Test 7 Part 2 (Archery) and Test 8 Part 4 (Maggie Wharton).
 */
const listeningKeys = [
  "plastic", "rules", "field", "stand", "shoulders", "view", "parents",
  "t", "f", "f", "f", "t", "t",
  "b", "b", "a", "c", "a", "b", "a",
] as const;

const readingKeys = [
  "e", "c", "b", "d", "a", "c", "a",
  "b", "b", "c", "c", "a", "b",
  "e", "b", "g", "d", "a", "h", "c",
] as const;

const useOfEnglishKeys = [
  "bounds", "steam", "grindstone", "reach", "sink", "bargains", "ground", "scratch",
  "d", "c", "b", "a", "c", "c",
  "e", "a", "f", "d", "h", "b",
] as const;

function withKeys(set: QuestionSet, keys: readonly string[], id: string): QuestionSet {
  if (set.items.length !== keys.length) throw new Error(`${id}: expected ${keys.length} items, got ${set.items.length}`);
  return {
    ...set,
    id,
    items: set.items.map((question, index) => ({
      ...question,
      acceptedAnswers: [keys[index].toLowerCase()],
      needsReview: false,
      explanation: "Ответ сверён с официальным вариантом и исходным материалом задания.",
      tags: Array.from(new Set([...(question.tags || []), "verified-key"])),
    })),
  };
}

export const grade9Listening2023Verified = withKeys(grade9Listening2023, listeningKeys, "g9-2023-listening-verified");
export const grade9Reading2023Verified = withKeys(grade9Reading2023, readingKeys, "g9-2023-reading-verified");
export const grade9UseOfEnglish2023Verified = withKeys(grade9UseOfEnglish2023, useOfEnglishKeys, "g9-2023-use-of-english-verified");

export const grade9Official2023Verified = {
  listening: grade9Listening2023Verified,
  reading: grade9Reading2023Verified,
  "use-of-english": grade9UseOfEnglish2023Verified,
} as const;
