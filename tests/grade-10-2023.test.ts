import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { grade10Reading2023Verified, grade10UseOfEnglish2023Verified } from "../data/questions/grade-10-11/official-2023-grade10.ts";

test("Grade 10 2023 Reading is a complete keyed official set",()=>{
  const items=grade10Reading2023Verified.items;
  assert.equal(items.length,20);
  assert.ok(items.every(q=>q.grade===10&&q.year===2023&&q.section==="reading"&&q.source==="official-vsosh-vzlet"&&q.acceptedAnswers.length===1&&!q.needsReview));
  assert.deepEqual(items.map(q=>q.acceptedAnswers[0]),["c","c","a","b","d","b","c","d","b","b","d","e","c","d","ns","f","t","ns","f","ns"]);
  assert.match(items[0].passage||"",/Mount Belukha/);
  assert.match(items[8].passage||"",/Wingsuit jumping/);
});

test("Grade 10 2023 Use of English is a complete keyed official set",()=>{
  const items=grade10UseOfEnglish2023Verified.items;
  assert.equal(items.length,20);
  assert.ok(items.every(q=>q.grade===10&&q.year===2023&&q.section==="use-of-english"&&q.source==="official-vsosh-vzlet"&&q.acceptedAnswers.length===1&&!q.needsReview));
  assert.deepEqual(items.map(q=>q.acceptedAnswers[0]),["bounds","steam","grindstone","reach","sink","bargains","ground","scratch","b","d","c","d","a","b","e","a","f","d","h","b"]);
  assert.match(items[0].passage||"",/19th Century Britain/);
  assert.match(items[8].passage||"",/How do you choose the right job/);
});

test("Grade 10 training exposes verified 2023 Reading and UOE but not unverified Listening",()=>{
  const source=readFileSync("components/training/GradeOfficialSection.tsx","utf8");
  assert.match(source,/grade10Reading2023Verified/);
  assert.match(source,/grade10UseOfEnglish2023Verified/);
  assert.doesNotMatch(source,/grade10Listening2023Verified/);
});
