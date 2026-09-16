import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {grade9Writing2024} from "../data/questions/grade-9/official/2024/index.ts";
import {buildWritingAnswerPayload,buildWritingAttemptPayload,getWritingSubmissionErrorMessage,needsWritingAnswerInsert,type WritingSubmissionInput} from "../lib/supabase/writing-sync.ts";

const text=["A Museum Worth Discovering",...Array.from({length:223},(_,index)=>`word${index+1}`)].join(" ");
const input:WritingSubmissionInput={attemptId:"22222222-2222-4222-8222-222222222222",startedAt:"2026-01-01T10:00:00.000Z",completedAt:"2026-01-01T10:30:00.000Z",task:grade9Writing2024.items[0],text,wordCount:227,headlinePresent:true};
test("Official Writing 2024 with 227 words produces a pending-review attempt",()=>{const payload=buildWritingAttemptPayload(input,"student-id");assert.equal(payload.section,"writing");assert.equal(payload.mode,"official");assert.equal(payload.metadata.reviewStatus,"pending");assert.equal(payload.metadata.wordCount,227);assert.equal(payload.metadata.requirementsMet.wordCount200To250,true);assert.equal(payload.score,null);assert.equal(payload.max_score,null);assert.equal(payload.percentage,null);assert.equal(payload.correct_answers,null);assert.equal(payload.incorrect_answers,null)});
test("Writing answer preserves the complete text and has no invented correctness or points",()=>{const payload=buildWritingAnswerPayload(input,"student-id");assert.equal(payload.answer_text,text);assert.equal(payload.question_id,grade9Writing2024.items[0].id);assert.equal(payload.is_correct,null);assert.equal(payload.points,null);assert.equal(payload.max_points,null)});
test("existing answer for stable Writing attempt prevents duplicate insert",()=>{assert.equal(needsWritingAnswerInsert([]),true);assert.equal(needsWritingAnswerInsert([{id:1}]),false)});
test("Writing component shows pending status without inventing a pre-review percentage",()=>{const source=readFileSync("components/training/WritingSection.tsx","utf8"),start=source.indexOf("if(submitted)"),status=source.slice(start,source.indexOf("return <main",start+20));assert.match(status,/Работа отправлена/);assert.match(status,/Ожидает проверки/);assert.match(status,/review\?\.status==="reviewed"/);assert.match(status,/Итоговая оценка будет выставлена после проверки/)});

test("technical fetch errors are hidden from students",()=>{const message=getWritingSubmissionErrorMessage(new Error("Failed to fetch"));assert.doesNotMatch(message,/Failed to fetch/i);assert.match(message,/сервером|интернет/i)});
