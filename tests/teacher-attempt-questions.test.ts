import test from "node:test";
import assert from "node:assert/strict";
import {displayCorrectAnswer,displayTeacherAnswer,findTeacherQuestion} from "../lib/teacher-attempt-questions.ts";

test("teacher review resolves official Grade 11 Listening questions",()=>{
  const question=findTeacherQuestion("g11-2022-listening-01");
  assert.ok(question);
  assert.notEqual(question.text,"g11-2022-listening-01");
  assert.equal(question.acceptedAnswers[0],"c");
});

test("wrong multiple-choice answer shows option text and a short explanation",()=>{
  const question=findTeacherQuestion("g11-2022-listening-01");
  assert.ok(question);
  const shown=displayTeacherAnswer(question,"a");
  assert.match(shown,/A\s+—/);
  assert.match(shown,/Почему ошибка:/);
  assert.ok(shown.length>"a".length);
});

test("correct answer is displayed clearly without a false error explanation",()=>{
  const question=findTeacherQuestion("g11-2022-listening-01");
  assert.ok(question);
  const correct=displayCorrectAnswer(question);
  assert.ok(correct);
  assert.match(correct,/C\s+—/);
  assert.doesNotMatch(correct,/Почему ошибка:/);
});
