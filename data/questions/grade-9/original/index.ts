export { grade9UseOfEnglish } from "./use-of-english.ts";
export { grade9Reading } from "./reading.ts";
export { grade9LanguageChallenge } from "./language-challenge.ts";
export { grade9ExpansionQuestionBank } from "./expansion.ts";
export { grade9BankExtension } from "./bank-extension.ts";

import { grade9UseOfEnglish } from "./use-of-english.ts";
import { grade9Reading } from "./reading.ts";
import { grade9LanguageChallenge } from "./language-challenge.ts";
import { grade9ExpansionQuestionBank } from "./expansion.ts";
import { grade9BankExtension } from "./bank-extension.ts";

export const grade9OriginalQuestionBank = [
  ...grade9UseOfEnglish,
  ...grade9Reading,
  ...grade9LanguageChallenge,
  ...grade9ExpansionQuestionBank,
  ...grade9BankExtension,
];
