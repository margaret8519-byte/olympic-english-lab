import test from "node:test";
import assert from "node:assert/strict";
import {
  grade78Listening2025,
  grade78Reading2025,
  grade78UseOfEnglish2025,
} from "../data/questions/grade-7-8/2025/index.ts";

const answers = (items: { acceptedAnswers: string[] }[]) => items.map(item => item.acceptedAnswers[0]);

test("Vzlet 2025 Grade 7-8 objective sections match the official key sizes", () => {
  assert.equal(grade78Listening2025.items.length, 15);
  assert.equal(grade78Reading2025.items.length, 20);
  assert.equal(grade78UseOfEnglish2025.items.length, 20);
});

test("Vzlet 2025 Grade 7-8 Listening key is exact", () => {
  assert.deepEqual(answers(grade78Listening2025.items), [
    "F", "T", "F", "T", "T", "F", "T", "B", "B", "C", "C", "A", "A", "C", "B",
  ]);
  assert.equal(grade78Listening2025.items[12].options[0], "A Being an actress.");
  assert.equal(
    grade78Listening2025.audioSrc,
    "https://reg.storage.yandexcloud.net/public/olymp_tasks/audio_4476_1764686336.mp3",
  );
  assert.equal(grade78Listening2025.audioMode, "file");
});

test("Vzlet 2025 Grade 7-8 Reading key is exact", () => {
  assert.deepEqual(answers(grade78Reading2025.items), [
    "A", "C", "E", "H", "F", "B", "F", "T", "T", "F", "T", "F", "B", "B", "C", "C", "A", "B", "A", "C",
  ]);
  assert.ok(grade78Reading2025.items.slice(0, 6).every(item => item.imageSrc?.endsWith(".svg")));
  assert.ok(grade78Reading2025.items.slice(0, 6).every(item => item.tags.includes("visual-adaptation")));
});

test("Vzlet 2025 Grade 7-8 Use of English key is exact", () => {
  assert.deepEqual(answers(grade78UseOfEnglish2025.items), [
    "unusual", "creativity", "carefully", "suitable", "scientists", "natural", "truly",
    "feet", "track", "place", "spread", "wrong", "hat", "swim",
    "F", "A", "C", "B", "H", "D",
  ]);
});

test("Vzlet 2025 Grade 7-8 objective metadata is safe for auto-checking", () => {
  for (const set of [grade78Listening2025, grade78Reading2025, grade78UseOfEnglish2025]) {
    for (const item of set.items) {
      assert.equal(item.grade, "7-8");
      assert.equal(item.year, 2025);
      assert.equal(item.source, "official-vsosh-vzlet");
      assert.equal(item.platformLabel, "Взлёт");
      assert.equal(item.needsReview, false);
      assert.ok(item.acceptedAnswers.length > 0);
    }
  }
});
