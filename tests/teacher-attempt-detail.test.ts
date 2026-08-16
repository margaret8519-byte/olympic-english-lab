import test from"node:test";import assert from"node:assert/strict";
import{readFileSync}from"node:fs";
import{displayCorrectAnswer,displayTeacherAnswer,findTeacherQuestion}from"../lib/teacher-attempt-questions.ts";
test("Grade 9 original question id resolves to full question text",()=>{const question=findTeacherQuestion("g9-lc-05");assert.ok(question);assert.ok(question.text.length>10)});
test("Grade 9 original multiple-choice key resolves to option text",()=>{const question=findTeacherQuestion("g9-lc-05")!;assert.notEqual(displayTeacherAnswer(question,"b"),"b");assert.ok(displayCorrectAnswer(question))});
test("Official 2024 question ids resolve with question and correct answer",()=>{const question=findTeacherQuestion("g9-2024-listening-14");assert.ok(question);assert.match(question.text,/According to the speaker/);assert.equal(displayTeacherAnswer(question,"a"),"spiritual experience");assert.equal(displayCorrectAnswer(question),"spiritual experience")});
test("Official 2024 gap-fill exposes the accepted answer",()=>{const question=findTeacherQuestion("g9-2024-use-of-english-01");assert.ok(question);assert.equal(displayTeacherAnswer(question,"outcomes"),"outcomes");assert.equal(displayCorrectAnswer(question),"outcomes")});
test("unknown question id keeps raw-answer fallback",()=>{assert.equal(findTeacherQuestion("missing-id"),undefined);assert.equal(displayTeacherAnswer(undefined,"b"),"b");assert.equal(displayCorrectAnswer(undefined),null)});
test("teacher attempt UI filters only incorrect answers",()=>{const source=readFileSync("components/teacher/TeacherViews.tsx","utf8");assert.match(source,/filter==="errors"\?data\.answers\.filter\(answer=>answer\.is_correct===false\)/);assert.match(source,/>Только ошибки</)});
