import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  grade10UseOfEnglish2022Verified,
  grade11Listening2022Verified,
  grade11UseOfEnglish2022Verified,
  grade10Writing2022Verified,
  grade11Writing2022Verified,
} from "../data/questions/grade-10-11/official-2022.ts";
import { validatedListeningGroupsForGrade } from "../lib/listening-registry.ts";

test("verified grade 11 Listening 2022 uses the published siesta statements and key", () => {
  assert.equal(grade11Listening2022Verified.id, "g11-2022-listening");
  assert.equal(grade11Listening2022Verified.items.length, 20);
  assert.equal(grade11Listening2022Verified.items[10].text, "Spaniards stop working from 1 p.m. to 4 p.m. every day.");
  assert.equal(grade11Listening2022Verified.items[13].text, "Studies have shown that it’s natural for people to feel sleepy in the middle of the day.");
  assert.deepEqual(grade11Listening2022Verified.items.slice(10).map(item => item.acceptedAnswers[0]), ["f","f","f","t","f","f","t","t","f","f"]);
  assert.ok(grade11Listening2022Verified.items.every(item => item.source === "official-vsosh-vzlet" && item.year === 2022 && !item.needsReview));
});

test("safe grade 11 Listening registry now points to the verified 2022 set", () => {
  const groups = validatedListeningGroupsForGrade(11);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].id, "g11-2022-listening");
  assert.equal(groups[0].questions[10].text, "Spaniards stop working from 1 p.m. to 4 p.m. every day.");
});

test("senior 2022 Use of English has all 40 official keyed items", () => {
  for (const set of [grade10UseOfEnglish2022Verified, grade11UseOfEnglish2022Verified]) {
    assert.equal(set.items.length, 40);
    assert.ok(set.items.every(item => item.source === "official-vsosh-vzlet" && item.year === 2022 && item.acceptedAnswers.length > 0 && !item.needsReview));
    assert.deepEqual(set.items.slice(0,10).map(item => item.acceptedAnswers[0]), ["benefit","representative","highlight","government","respectively","showcases","commemorates","annually","significance","delicacies"]);
    assert.deepEqual(set.items.slice(10,20).map(item => item.acceptedAnswers[0]), ["c","b","b","a","d","b","c","b","a","d"]);
    assert.deepEqual(set.items.slice(20,30).map(item => item.acceptedAnswers[0]), ["f","f","t","t","t","f","f","f","t","f"]);
    assert.deepEqual(set.items.slice(30,40).map(item => item.acceptedAnswers[0]), ["apple","nut","cake","cookie","cucumber","beans","tea","cream","eggs","salt"]);
  }
});

test("senior 2022 Writing keeps grade-specific language requirements", () => {
  assert.equal(grade10Writing2022Verified.items[0].wordLimit?.min, 220);
  assert.equal(grade10Writing2022Verified.items[0].wordLimit?.max, 250);
  assert.ok(grade10Writing2022Verified.items[0].requirements?.some(value => /two phrasal verbs/i.test(value)));
  assert.ok(grade11Writing2022Verified.items[0].requirements?.some(value => /one idiom and two phrasal verbs/i.test(value)));
  assert.ok(grade10Writing2022Verified.items[0].needsReview && grade11Writing2022Verified.items[0].needsReview);
});

test("standalone senior Use of English imports the verified 2022 bank", () => {
  const source = readFileSync("components/training/GradeOfficialSection.tsx", "utf8");
  assert.match(source, /grade10UseOfEnglish2022Verified/);
  assert.match(source, /grade11UseOfEnglish2022Verified/);
  assert.match(source, /canAutoScore\(set2022\)/);
});
