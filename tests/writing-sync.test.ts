import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { grade9Writing2024 } from "../data/questions/grade-9/official/2024/index.ts";
import {
  FULL_ACTIVE_KEY,
  createFullSession,
  resolveSessionQuestions,
} from "../lib/full-olympiad.ts";
import {
  buildFullObjectiveAnswerPayloads,
  buildWritingAnswerPayload,
  buildWritingAttemptPayload,
  getWritingSubmissionErrorMessage,
  needsWritingAnswerInsert,
  writingSubmissionKey,
  type WritingSubmissionInput,
} from "../lib/supabase/writing-sync.ts";

const text = [
  "A Museum Worth Discovering",
  ...Array.from({ length: 223 }, (_, index) => `word${index + 1}`),
].join(" ");
const input: WritingSubmissionInput = {
  attemptId: "22222222-2222-4222-8222-222222222222",
  startedAt: "2026-01-01T10:00:00.000Z",
  completedAt: "2026-01-01T10:30:00.000Z",
  task: grade9Writing2024.items[0],
  text,
  wordCount: 227,
  headlinePresent: true,
};

test("Official Writing 2024 with 227 words produces a pending-review attempt", () => {
  const payload = buildWritingAttemptPayload(input, "student-id");
  assert.equal(payload.section, "writing");
  assert.equal(payload.mode, "official");
  assert.equal(payload.metadata.reviewStatus, "pending");
  assert.equal(payload.metadata.wordCount, 227);
  assert.equal(payload.metadata.requirementsMet.wordCountInLimit, true);
  assert.equal(payload.score, null);
  assert.equal(payload.max_score, null);
  assert.equal(payload.percentage, null);
  assert.equal(payload.correct_answers, null);
  assert.equal(payload.incorrect_answers, null);
});

test("Writing answer preserves the complete text and has no invented correctness or points", () => {
  const payload = buildWritingAnswerPayload(input, "student-id");
  assert.equal(payload.answer_text, text);
  assert.equal(payload.question_id, grade9Writing2024.items[0].id);
  assert.equal(payload.is_correct, null);
  assert.equal(payload.points, null);
  assert.equal(payload.max_points, null);
});

test("full official Writing submission carries objective answers into the teacher attempt", () => {
  const session = createFullSession(11, {}, []);
  const questions = resolveSessionQuestions(session);
  session.answers = Object.fromEntries(
    questions.map((question) => [question.id, question.acceptedAnswers[0] || ""]),
  );
  const storage = {
    getItem(key: string) {
      return key === FULL_ACTIVE_KEY ? JSON.stringify(session) : null;
    },
    setItem() {},
  };
  const payloads = buildFullObjectiveAnswerPayloads(
    storage,
    session.id,
    "student-id",
  );
  assert.equal(payloads.length, questions.length);
  assert.ok(payloads.length > 0);
  assert.ok(payloads.every((payload) => payload.is_correct === true));
  assert.ok(payloads.every((payload) => payload.student_id === "student-id"));
});

test("objective answers are not borrowed from another active full session", () => {
  const session = createFullSession(11, {}, []);
  const storage = {
    getItem(key: string) {
      return key === FULL_ACTIVE_KEY ? JSON.stringify(session) : null;
    },
    setItem() {},
  };
  assert.deepEqual(
    buildFullObjectiveAnswerPayloads(storage, "another-attempt", "student-id"),
    [],
  );
});

test("existing answer for stable Writing attempt prevents duplicate insert", () => {
  assert.equal(needsWritingAnswerInsert([]), true);
  assert.equal(needsWritingAnswerInsert([{ id: 1 }]), false);
});

test("Writing component shows pending status without inventing a pre-review percentage", () => {
  const source = readFileSync("components/training/WritingSection.tsx", "utf8"),
    start = source.indexOf("if(submitted)"),
    status = source.slice(start, source.indexOf("return <main", start + 20));
  assert.match(status, /Работа отправлена/);
  assert.match(status, /Ожидает проверки/);
  assert.match(status, /review\?\.status==="reviewed"/);
  assert.match(status, /Итоговая оценка будет выставлена после проверки/);
});

test("technical fetch errors are hidden from students", () => {
  const message = getWritingSubmissionErrorMessage(new Error("Failed to fetch"));
  assert.doesNotMatch(message, /Failed to fetch/i);
  assert.match(message, /сервером|интернет/i);
});

test("Writing local state is isolated by task id, not only grade and year",()=>{assert.notEqual(writingSubmissionKey("g9-2025-writing-01"),writingSubmissionKey("g9-original-writing-community-01"));assert.match(writingSubmissionKey("g9-2025-writing-01"),/g9-2025-writing-01/);const source=readFileSync("components/training/WritingSection.tsx","utf8");assert.match(source,/olympic-writing-draft-v2-\$\{task\.id\}/);assert.match(source,/writingSubmissionKey\(task\.id\)/)});
test("full Olympiad Writing attempt metadata includes objective result context",()=>{const session=createFullSession(11,{},[]),questions=resolveSessionQuestions(session);session.answers=Object.fromEntries(questions.map(q=>[q.id,q.acceptedAnswers[0]||""]));const storage={getItem(key:string){return key===FULL_ACTIVE_KEY?JSON.stringify(session):null},setItem(){}};const objective=buildFullObjectiveAnswerPayloads(storage,session.id,"student-id"),payload=buildWritingAttemptPayload({...input,attemptId:session.id,task:session.grade===11?{...input.task,grade:11,id:session.writingTaskId||input.task.id}:input.task},"student-id",objective);assert.equal(payload.mode,"olympiad");assert.equal(payload.total_questions,objective.length+1);assert.equal(payload.metadata.fullOlympiad,true);assert.equal(payload.metadata.objectiveQuestions,objective.length);assert.ok(payload.metadata.objectiveMax>0)});
