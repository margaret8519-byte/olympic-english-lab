import { official2024ForGrade } from "../../../grade-9-10/official-2024.ts";

const official = official2024ForGrade(9);

export const grade9Listening2024 = official.listening;
export const grade9Reading2024 = official.reading;
export const grade9UseOfEnglish2024 = official["use-of-english"];
export const grade9Writing2024 = official.writing;

export const grade9Official2024 = {
  listening: grade9Listening2024,
  reading: grade9Reading2024,
  "use-of-english": grade9UseOfEnglish2024,
  writing: grade9Writing2024,
};
