import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  grade78Writing2019,
  grade9Writing2019,
  grade10Writing2019,
  grade11Writing2019,
} from "../data/questions/writing-official-2019.ts";

test("2019-2020 Vzlet Writing preserves the historical class grouping", () => {
  const junior = grade78Writing2019.items[0];
  assert.equal(junior.grade, "7-8");
  assert.equal(junior.year, 2019);
  assert.equal(junior.source, "official-vsosh-vzlet");
  assert.equal(junior.platformLabel, "Взлёт");
  assert.deepEqual(junior.wordLimit, { min: 120, max: 160 });
  assert.equal(junior.points, 14);
  assert.match(junior.text, /Camp Florida/i);
  assert.match(junior.text, /London/i);

  const senior = [grade9Writing2019, grade10Writing2019, grade11Writing2019].map(set => set.items[0]);
  assert.deepEqual(senior.map(item => item.grade), [9, 10, 11]);
  assert.ok(senior.every(item => item.year === 2019));
  assert.ok(senior.every(item => item.source === "official-vsosh-vzlet"));
  assert.ok(senior.every(item => item.platformLabel === "Взлёт"));
  assert.ok(senior.every(item => item.requiredOpening === "Last year I spent some time studying abroad."));
  assert.ok(senior.every(item => item.wordLimit?.min === 220 && item.wordLimit.max === 250));
  assert.ok(senior.every(item => item.points === 20));
  assert.ok(senior.every(item => item.needsReview && item.acceptedAnswers.length === 0));
});

test("Writing selector exposes archived official variants with honest source labels", () => {
  const source = readFileSync("components/training/GradeWritingSection.tsx", "utf8");
  assert.match(source, /grade78Writing2019/);
  assert.match(source, /grade9Writing2019/);
  assert.match(source, /grade10Writing2019/);
  assert.match(source, /grade11Writing2019/);
  assert.match(source, /ОФИЦИАЛЬНЫЙ ВАРИАНТ/);
  assert.match(source, /АВТОРСКАЯ ТРЕНИРОВКА/);
  assert.match(source, /Взлёт · ручная проверка/);
  assert.match(source, /OLYMPIC ENGLISH LAB · ручная проверка/);
});
