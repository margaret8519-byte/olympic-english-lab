import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
import{generatedListeningSetsForGrade}from"../data/questions/generated-listening-2026.ts";
import{generatedWritingSetsForGrade}from"../data/questions/generated-writing-2026.ts";
import{generatedComplete78}from"../data/questions/generated-complete-78-2026.ts";
import{generatedComplete910ForGrade}from"../data/questions/generated-complete-910-2026.ts";
import{generatedComplete11}from"../data/questions/generated-complete-11-2026.ts";
import{createFullSession,fullBankForGrade,resolveFullListeningGroup,resolveSessionQuestions,resolveSessionWriting}from"../lib/full-olympiad.ts";
import{findTeacherQuestion}from"../lib/teacher-attempt-questions.ts";


test("each age band has five complete author variants A-E",()=>{const banks=[generatedComplete78,generatedComplete910ForGrade(9),generatedComplete910ForGrade(10),generatedComplete11];for(const sets of banks){assert.deepEqual(sets.map(set=>set.id),["A","B","C","D","E"]);assert.equal(sets.length,5);for(const set of sets){assert.equal(set.listening.items.length,10);assert.equal(set.reading.items.length,10);assert.equal(set.useOfEnglish.items.length,10);assert.equal(set.writing.items.length,1);const tag="generated-set:"+set.id;assert.ok([...set.listening.items,...set.reading.items,...set.useOfEnglish.items,...set.writing.items].every(q=>q.tags.includes(tag)&&q.source==="original-olympic-english-lab"&&q.year===2026))}}});

test("generated listening banks are original 2026 material for every supported grade",()=>{for(const grade of[7,8,9,10,11]){const sets=generatedListeningSetsForGrade(grade);assert.equal(sets.length,2);for(const set of sets){assert.equal(set.items.length,10);assert.equal(set.audioMode,"speech");assert.ok(set.script&&set.script.length>300);assert.ok(set.items.every(q=>q.source==="original-olympic-english-lab"&&q.year===2026&&q.tags.includes("generated-olympiad")))}}});

test("generated writing banks contain two new manual-review prompts per grade",()=>{for(const grade of[7,8,9,10,11]){const sets=generatedWritingSetsForGrade(grade);assert.equal(sets.length,2);assert.ok(sets.every(set=>set.items[0].year===2026&&set.items[0].source==="original-olympic-english-lab"&&set.items[0].needsReview))}});

test("New Olympiad full bank excludes official Vzlet questions",()=>{for(const grade of[7,8,9,10,11]){const bank=fullBankForGrade(grade,"generated");const all=[...bank.objective,...bank.listeningGroups.flatMap(group=>group.questions),...bank.writings];assert.ok(all.length>0);assert.ok(all.every(q=>q.source==="original-olympic-english-lab"));assert.ok(all.every(q=>q.sourceLabel.includes("OLYMPIC ENGLISH LAB")));assert.ok(!all.some(q=>q.source==="official-vsosh-vzlet"))}});

test("New Olympiad session is one coherent A-E set across all four sections",()=>{for(const grade of[7,8,9,10,11]){const session=createFullSession(grade,{},[],()=>.25,"2026-09-18T12:00:00.000Z","generated"),questions=resolveSessionQuestions(session),listening=resolveFullListeningGroup(session),writing=resolveSessionWriting(session);assert.equal(session.variant,"generated");assert.ok(listening);assert.equal(session.questionIds.listening.length,10);assert.equal(session.questionIds.reading.length,10);assert.equal(session.questionIds["use-of-english"].length,10);assert.ok(questions.every(q=>q.source==="original-olympic-english-lab"));const tags=[...questions,writing].flatMap(q=>q.tags).filter(tag=>tag.startsWith("generated-set:"));assert.equal(new Set(tags).size,1);assert.equal(writing.year,2026);assert.ok(writing.tags.includes("generated-olympiad"))}});

test("New Olympiad has its own student route and dashboard entry",()=>{const page=readFileSync("app/training/new-olympiad/page.tsx","utf8"),dashboard=readFileSync("app/dashboard/page.tsx","utf8");assert.match(page,/variant="generated"/);assert.match(dashboard,/Авторская тренировка/);assert.match(dashboard,/Официальная тренировка/);assert.match(dashboard,/\/training\/new-olympiad/)});

test("teacher result lookup knows legacy and complete author ids",()=>{assert.ok(findTeacherQuestion("generated-9-digital-break-01"));assert.ok(findTeacherQuestion("generated-9-set-A-listening-01"));assert.ok(findTeacherQuestion("generated-10-set-C-reading-10"));assert.ok(findTeacherQuestion("generated-11-set-E-writing-01"))});

test("student class label does not concatenate a stale class name",()=>{const source=readFileSync("components/StudentClassPanel.tsx","utf8");assert.match(source,/Класс: \{klass\.grade\}/);assert.doesNotMatch(source,/— \{klass\.class_name\}/)});
