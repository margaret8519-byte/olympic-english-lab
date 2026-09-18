import test from "node:test";
import assert from "node:assert/strict";
import {
  grade78Writing2025,
  grade9Writing2025,
  grade10Writing2025,
  grade11Writing2025,
} from "../data/questions/writing-official-2025.ts";

test("official 2025 Writing tasks remain manual review", () => {
  for (const set of [grade78Writing2025, grade9Writing2025, grade10Writing2025, grade11Writing2025]) {
    assert.equal(set.items.length, 1);
    const task = set.items[0];
    assert.equal(task.year, 2025);
    assert.equal(task.source, "official-vsosh-vzlet");
    assert.equal(task.platformLabel, "Взлёт");
    assert.equal(task.type, "writing");
    assert.equal(task.needsReview, true);
    assert.deepEqual(task.acceptedAnswers, []);
    assert.equal(task.points, 20);
  }
});

test("2025 Grade 9 and 10 share the same official story requirements", () => {
  const g9 = grade9Writing2025.items[0];
  const g10 = grade10Writing2025.items[0];
  assert.equal(g9.requiredOpening, g10.requiredOpening);
  assert.equal(g9.text, g10.text);
  assert.deepEqual(g9.wordLimit, { min: 180, max: 250 });
  assert.deepEqual(g10.wordLimit, { min: 180, max: 250 });
  assert.deepEqual(g9.requirements, g10.requirements);
  assert.ok(g9.requirements?.some(value => /title is included.*180.*250/i.test(value)));
});

test("2025 Grade 11 uses reported speech rather than modal-verb requirement", () => {
  const task = grade11Writing2025.items[0];
  assert.ok(task.requirements?.some(value => /reported speech/i.test(value)));
  assert.ok(!task.requirements?.some(value => /modal verbs/i.test(value)));
});

test("2025 Grade 7-8 Writing keeps the official word limit and alien-story constraints", () => {
  const task = grade78Writing2025.items[0];
  assert.deepEqual(task.wordLimit, { min: 120, max: 200 });
  assert.ok(task.requirements?.some(value => /title is included.*120.*200/i.test(value)));
  assert.ok(task.requirements?.some(value => /aliens/i.test(value)));
  assert.ok(task.requirements?.some(value => /spacecraft/i.test(value)));
  assert.ok(task.requirements?.some(value => /happy ending/i.test(value)));
});
