import test from "node:test";
import assert from "node:assert/strict";
import {
  grade10UseOfEnglish2022Verified,
  grade11Listening2022Verified,
  grade11UseOfEnglish2022Verified,
} from "../data/questions/grade-10-11/official-2022.ts";

test("official 2022 senior Use of English uses the athlete cloze and official keys", () => {
  const expected = ["c", "b", "b", "a", "d", "b", "c", "b", "a", "d"];
  for (const set of [grade10UseOfEnglish2022Verified, grade11UseOfEnglish2022Verified]) {
    assert.equal(set.items.length, 40);
    const athlete = set.items.slice(10, 20);
    assert.deepEqual(athlete.map(item => item.acceptedAnswers[0]), expected);
    assert.match(athlete[0].text, /aspiring athlete/i);
    assert.deepEqual(athlete[0].options, ["A complete", "B finish", "C achieve", "D succeed"]);
    assert.match(athlete[9].text, /reflect/i);
    assert.ok(athlete.every(item => item.groupId?.endsWith("uoe-athletes")));
  }
});

test("official 2022 senior cultural knowledge and food idioms keep the published keys", () => {
  const set = grade11UseOfEnglish2022Verified;
  assert.deepEqual(set.items.slice(20, 30).map(item => item.acceptedAnswers[0]), ["f", "f", "t", "t", "t", "f", "f", "f", "t", "f"]);
  assert.deepEqual(set.items.slice(30, 40).map(item => item.acceptedAnswers[0]), ["apple", "nut", "cake", "cookie", "cucumber", "beans", "tea", "cream", "eggs", "salt"]);
});

test("official 2022 grade 11 Listening uses the published siesta statements", () => {
  assert.equal(grade11Listening2022Verified.items.length, 20);
  const siesta = grade11Listening2022Verified.items.slice(10);
  assert.match(siesta[0].text, /1 p\.m\. to 4 p\.m\./i);
  assert.match(siesta[3].text, /natural for people to feel sleepy/i);
  assert.match(siesta[8].text, /Spanish architecture/i);
  assert.deepEqual(siesta.map(item => item.acceptedAnswers[0]), ["f", "f", "f", "t", "f", "f", "t", "t", "f", "f"]);
});
