import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { grade10Reading2022Verified, grade11Reading2022Verified } from "../data/questions/grade-10-11/official-2022-reading.ts";

const keys10 = ["d","b","d","a","c","b","b","c","d","a","e","a","d","b","f","c","a","e","b","d"];
const keys11 = ["g","d","a","f","c","e","g","b","f","c","d","b","c","b","d","d","b","a","a","a"];

test("official 2022 grade 10 Reading matches the published 20-key sequence", () => {
  assert.equal(grade10Reading2022Verified.items.length, 20);
  assert.deepEqual(grade10Reading2022Verified.items.map(item => item.acceptedAnswers[0]), keys10);
  assert.ok(grade10Reading2022Verified.items.every(item => item.grade === 10 && item.year === 2022 && item.source === "official-vsosh-vzlet" && !item.needsReview));
  assert.equal(new Set(grade10Reading2022Verified.items.map(item => item.groupId)).size, 3);
  assert.match(grade10Reading2022Verified.items[0].passage || "", /Eco-Adventure in Costa-Rica/i);
  assert.match(grade10Reading2022Verified.items[14].passage || "", /Scottish Wildcat/i);
});

test("official 2022 grade 11 Reading matches the published 20-key sequence", () => {
  assert.equal(grade11Reading2022Verified.items.length, 20);
  assert.deepEqual(grade11Reading2022Verified.items.map(item => item.acceptedAnswers[0]), keys11);
  assert.ok(grade11Reading2022Verified.items.every(item => item.grade === 11 && item.year === 2022 && item.source === "official-vsosh-vzlet" && !item.needsReview));
  assert.equal(new Set(grade11Reading2022Verified.items.map(item => item.groupId)).size, 3);
  assert.match(grade11Reading2022Verified.items[0].passage || "", /Scottish Wildcat/i);
  assert.match(grade11Reading2022Verified.items[10].passage || "", /Traditional Chinese Medicine/i);
});

test("senior section training exposes verified 2022 Reading alongside existing UOE", () => {
  const source = readFileSync("components/training/GradeOfficialSection.tsx", "utf8");
  assert.match(source, /grade10Reading2022Verified/);
  assert.match(source, /grade11Reading2022Verified/);
  assert.match(source, /section===\"reading\"\?grade10Reading2022Verified/);
  assert.match(source, /section===\"reading\"\?grade11Reading2022Verified/);
});
