import test from "node:test";
import assert from "node:assert/strict";
import { grade11Registry, objectiveBankForSeniorGrade } from "../data/questions/grade-10-11/index.ts";

test("shortened Grade 11 Reading 2024 is not presented as an exact Vzlet source", () => {
  const reading = grade11Registry[2024].reading.items;
  assert.equal(reading.length, 20);
  assert.ok(reading.every(q => q.stage === "training"));
  assert.ok(reading.every(q => q.source === "original-olympic-english-lab"));
  assert.ok(reading.every(q => q.platformLabel === "OLYMPIC ENGLISH LAB"));
  assert.ok(reading.every(q => q.tags.includes("adapted-source-excerpt")));
});

test("full Grade 11 bank uses the same adapted Reading labeling", () => {
  const reading = objectiveBankForSeniorGrade(11).filter(q => q.year === 2024 && q.section === "reading" && q.id.startsWith("g11-2024-reading-"));
  assert.equal(reading.length, 20);
  assert.ok(reading.every(q => q.source !== "official-vsosh-vzlet"));
});
