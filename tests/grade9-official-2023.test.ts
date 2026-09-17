import test from "node:test";
import assert from "node:assert/strict";
import { grade9Listening2023Verified, grade9Reading2023Verified, grade9UseOfEnglish2023Verified } from "../data/questions/grade-9/official/2023/verified.ts";

test("Grade 9 official 2023 verified banks have complete keys", () => {
  assert.equal(grade9Listening2023Verified.items.length, 20);
  assert.equal(grade9Reading2023Verified.items.length, 20);
  assert.equal(grade9UseOfEnglish2023Verified.items.length, 20);
  for (const set of [grade9Listening2023Verified, grade9Reading2023Verified, grade9UseOfEnglish2023Verified]) {
    assert.ok(set.items.every(item => item.acceptedAnswers.length === 1 && !item.needsReview));
  }
});

test("Grade 9 official 2023 Listening keys match the verified source material", () => {
  assert.deepEqual(grade9Listening2023Verified.items.map(q => q.acceptedAnswers[0]), [
    "plastic", "rules", "field", "stand", "shoulders", "view", "parents",
    "t", "f", "f", "f", "t", "t", "b", "b", "a", "c", "a", "b", "a",
  ]);
});

test("Grade 9 official 2023 Reading and UOE keys stay stable", () => {
  assert.deepEqual(grade9Reading2023Verified.items.map(q => q.acceptedAnswers[0]), [
    "e", "c", "b", "d", "a", "c", "a", "b", "b", "c", "c", "a", "b", "e", "b", "g", "d", "a", "h", "c",
  ]);
  assert.deepEqual(grade9UseOfEnglish2023Verified.items.map(q => q.acceptedAnswers[0]), [
    "bounds", "steam", "grindstone", "reach", "sink", "bargains", "ground", "scratch",
    "d", "c", "b", "a", "c", "c", "e", "a", "f", "d", "h", "b",
  ]);
});
