import test from "node:test";
import assert from "node:assert/strict";
import { official2024ForGrade } from "../data/questions/grade-9-10/official-2024.ts";

test("2024/25 municipal English uses one shared 9-10 official variant", () => {
  const grade9 = official2024ForGrade(9);
  const grade10 = official2024ForGrade(10);

  for (const bank of [grade9, grade10]) {
    assert.equal(bank.listening.items.length, 20);
    assert.equal(bank.reading.items.length, 20);
    assert.equal(bank["use-of-english"].items.length, 20);
    assert.equal(bank.writing.items.length, 1);
    assert.ok(bank.reading.items.every((item) => item.acceptedAnswers.length === 1));
    assert.ok(bank["use-of-english"].items.every((item) => item.acceptedAnswers.length === 1));
  }

  assert.deepEqual(
    grade9.reading.items.map((item) => item.acceptedAnswers[0]),
    ["e", "b", "a", "e", "d", "a", "c", "a", "c", "b", "b", "d", "a", "g", "c", "h", "b", "d", "a", "f"],
  );
  assert.deepEqual(
    grade9["use-of-english"].items.map((item) => item.acceptedAnswers[0]),
    ["outcomes", "curate", "ripping", "tutoring", "hone", "positives", "harnessing", "replicate", "d", "i", "j", "a", "f", "b", "c", "a", "h", "e", "b", "g"],
  );
  assert.deepEqual(
    grade9.listening.items.map((item) => item.acceptedAnswers[0]),
    ["silence", "exposed", "effort", "communicate", "countries", "first", "relationship", "f", "f", "t", "f", "f", "t", "a", "c", "b", "a", "b", "b", "c"],
  );

  assert.ok(grade9.reading.items[0].passage?.includes("six periods of eight minutes"));
  assert.ok(grade9.reading.items[13].passage?.includes("Republic of Kalmykia"));
  assert.ok(grade9["use-of-english"].items[0].passage?.includes("level the playing field"));

  assert.ok(grade9.reading.items.every((item) => item.grade === 9 && item.id.startsWith("g9-")));
  assert.ok(grade10.reading.items.every((item) => item.grade === 10 && item.id.startsWith("g10-")));
  assert.deepEqual(
    grade10.reading.items.map((item) => item.acceptedAnswers),
    grade9.reading.items.map((item) => item.acceptedAnswers),
  );
  assert.deepEqual(
    grade10["use-of-english"].items.map((item) => item.acceptedAnswers),
    grade9["use-of-english"].items.map((item) => item.acceptedAnswers),
  );
});

test("2024 shared bank keeps Listening audio disabled until source MP3 is validated", () => {
  for (const grade of [9, 10] as const) {
    const listening = official2024ForGrade(grade).listening;
    assert.equal(listening.audioSrc, undefined);
    assert.equal(listening.audioMode, undefined);
    assert.match(listening.script || "", /9-10/);
  }
});
