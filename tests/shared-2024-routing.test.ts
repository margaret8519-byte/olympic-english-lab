import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { official2024ForGrade } from "../data/questions/grade-9-10/official-2024.ts";

test("2024 municipal bank is shared by Grades 9 and 10",()=>{
  const g9=official2024ForGrade(9),g10=official2024ForGrade(10);
  for(const section of ["listening","reading","use-of-english"] as const){
    assert.equal(g9[section].items.length,20);
    assert.equal(g10[section].items.length,20);
    assert.deepEqual(g9[section].items.map(q=>q.acceptedAnswers),g10[section].items.map(q=>q.acceptedAnswers));
    assert.deepEqual(g9[section].items.map(q=>q.text),g10[section].items.map(q=>q.text));
    assert.ok(g9[section].items.every(q=>q.grade===9&&q.source==="official-vsosh-vzlet"&&q.platformLabel==="Взлёт"));
    assert.ok(g10[section].items.every(q=>q.grade===10&&q.source==="official-vsosh-vzlet"&&q.platformLabel==="Взлёт"));
  }
  assert.equal(g9.writing.items.length,1);
  assert.equal(g10.writing.items.length,1);
  assert.equal(g9.writing.items[0].text,g10.writing.items[0].text);
});

test("Grade 9 standalone routes no longer import the old separate 2024 bank",()=>{
  for(const path of ["app/training/reading/page.tsx","app/training/use-of-english/page.tsx","app/training/listening/page.tsx"]){
    const source=readFileSync(path,"utf8");
    assert.match(source,/official2024ForGrade/);
    assert.doesNotMatch(source,/grade-9\/official\/2024/);
  }
});

test("Writing uses the shared 2024 task for both Grade 9 and Grade 10",()=>{
  const source=readFileSync("components/training/GradeWritingSection.tsx","utf8");
  assert.match(source,/official2024ForGrade\(9\)\.writing/);
  assert.match(source,/official2024ForGrade\(10\)\.writing/);
  assert.doesNotMatch(source,/grade9Writing2024.*grade-9\/official\/2024/);
});
