import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  grade78Writing2020,
  grade9Writing2020,
  grade10Writing2020,
  grade11Writing2020,
} from "../data/questions/writing-official-2020.ts";

test("2020-2021 Vzlet Writing preserves the historical 7-8 and 9-11 grouping", () => {
  const junior = grade78Writing2020.items[0];
  assert.equal(junior.grade, "7-8");
  assert.equal(junior.year, 2020);
  assert.equal(junior.source, "official-vsosh-vzlet");
  assert.equal(junior.platformLabel, "Взлёт");
  assert.deepEqual(junior.wordLimit, { min: 150, max: 210 });
  assert.equal(junior.points, 20);
  assert.match(junior.text, /Unforgettable Adventure/i);

  const senior = [grade9Writing2020, grade10Writing2020, grade11Writing2020].map(set => set.items[0]);
  assert.deepEqual(senior.map(item => item.grade), [9, 10, 11]);
  assert.ok(senior.every(item => item.year === 2020));
  assert.ok(senior.every(item => item.source === "official-vsosh-vzlet"));
  assert.ok(senior.every(item => item.platformLabel === "Взлёт"));
  assert.ok(senior.every(item => item.wordLimit?.min === 220 && item.wordLimit.max === 250));
  assert.ok(senior.every(item => item.points === 20));
  assert.ok(senior.every(item => item.requirements?.some(value => /package holiday/i.test(value))));
  assert.ok(senior.every(item => item.requirements?.some(value => /direct and indirect speech/i.test(value))));
  assert.ok(senior.every(item => item.needsReview && item.acceptedAnswers.length === 0));
});

test("Writing selector exposes official 2020 variants for every supported grade", () => {
  const source = readFileSync("components/training/GradeWritingSection.tsx", "utf8");
  assert.match(source, /grade78Writing2020/);
  assert.match(source, /grade9Writing2020/);
  assert.match(source, /grade10Writing2020/);
  assert.match(source, /grade11Writing2020/);
});
