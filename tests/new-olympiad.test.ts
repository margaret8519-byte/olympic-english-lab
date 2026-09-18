import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
import{generatedListeningSetsForGrade}from"../data/questions/generated-listening-2026.ts";
import{generatedWritingSetsForGrade}from"../data/questions/generated-writing-2026.ts";
import{createFullSession,fullBankForGrade,resolveFullListeningGroup,resolveSessionQuestions,resolveSessionWriting}from"../lib/full-olympiad.ts";

test("generated listening banks are original 2026 material for every supported grade",()=>{for(const grade of[7,8,9,10,11]){const sets=generatedListeningSetsForGrade(grade);assert.equal(sets.length,2);for(const set of sets){assert.equal(set.items.length,10);assert.equal(set.audioMode,"speech");assert.ok(set.script&&set.script.length>300);assert.ok(set.items.every(q=>q.source==="original-olympic-english-lab"&&q.year===2026&&q.tags.includes("generated-olympiad")))}}});

test("generated writing banks contain two new manual-review prompts per grade",()=>{for(const grade of[7,8,9,10,11]){const sets=generatedWritingSetsForGrade(grade);assert.equal(sets.length,2);assert.ok(sets.every(set=>set.items[0].year===2026&&set.items[0].source==="original-olympic-english-lab"&&set.items[0].needsReview))}});

test("New Olympiad full bank excludes official Vzlet questions",()=>{for(const grade of[7,8,9,10,11]){const bank=fullBankForGrade(grade,"generated");const all=[...bank.objective,...bank.listeningGroups.flatMap(group=>group.questions),...bank.writings];assert.ok(all.length>0);assert.ok(all.every(q=>q.source==="original-olympic-english-lab"));assert.ok(all.every(q=>q.sourceLabel.includes("OLYMPIC ENGLISH LAB")));assert.ok(!all.some(q=>q.source==="official-vsosh-vzlet"))}});

test("New Olympiad session is a coherent generated four-section round",()=>{for(const grade of[7,8,9,10,11]){const session=createFullSession(grade,{},[],()=>.25,"2026-09-18T12:00:00.000Z","generated"),questions=resolveSessionQuestions(session),listening=resolveFullListeningGroup(session),writing=resolveSessionWriting(session);assert.equal(session.variant,"generated");assert.ok(listening);assert.equal(session.questionIds.listening.length,10);assert.ok(session.questionIds.reading.length>=10);assert.ok(session.questionIds["use-of-english"].length>=10);assert.ok(questions.every(q=>q.source==="original-olympic-english-lab"));assert.equal(writing.year,2026);assert.ok(writing.tags.includes("generated-olympiad"))}});

test("New Olympiad has its own student route and dashboard entry",()=>{const page=readFileSync("app/training/new-olympiad/page.tsx","utf8"),dashboard=readFileSync("app/dashboard/page.tsx","utf8");assert.match(page,/variant="generated"/);assert.match(dashboard,/Новая олимпиада/);assert.match(dashboard,/\/training\/new-olympiad/)});
