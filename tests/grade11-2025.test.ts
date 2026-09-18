import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  grade11Listening2025,
  grade11Reading2025,
  grade11UseOfEnglish2025,
} from "../data/questions/grade-11/official-2025.ts";
import { createFullSession, fullBankForGrade } from "../lib/full-olympiad.ts";

test("Vzlet 2025 Grade 11 objective sections match official sizes and keys",()=>{
  assert.equal(grade11Listening2025.items.length,20);
  assert.equal(grade11Reading2025.items.length,20);
  assert.equal(grade11UseOfEnglish2025.items.length,20);

  assert.deepEqual(grade11Listening2025.items.map(q=>q.acceptedAnswers),[
    ["a"],["c"],["a"],["c"],["b"],["c"],["g"],["a"],["f","h"],["f","h"],["c","e"],["c","e"],["d"],["F"],["T"],["F"],["T"],["T"],["F"],["F"],
  ]);
  assert.deepEqual(grade11Reading2025.items.map(q=>q.acceptedAnswers[0]),[
    "c","a","f","b","h","g","d","c","g","a","e","f","b","F","F","T","F","T","F","T",
  ]);
  assert.deepEqual(grade11UseOfEnglish2025.items.map(q=>q.acceptedAnswers[0]),[
    "packaging","solid","certainly","inedible","commonly","height","ensure",
    "under wraps","get to the bottom of","wave a magic wand","fall into place","the answer to our prayers","come to light","spread like wildfire",
    "b","h","e","f","d","g",
  ]);

  for(const set of [grade11Listening2025,grade11Reading2025,grade11UseOfEnglish2025]){
    assert.ok(set.items.every(q=>q.grade===11&&q.year===2025&&q.source==="official-vsosh-vzlet"&&!q.needsReview&&q.acceptedAnswers.length>0));
  }
});

test("Vzlet 2025 Grade 11 Listening uses official MP3 and preserves unordered paired answers",()=>{
  assert.equal(grade11Listening2025.audioSrc,"https://reg.storage.yandexcloud.net/public/olymp_tasks/audio_4478_1764686443.mp3");
  assert.equal(grade11Listening2025.audioMode,"file");
  assert.ok(grade11Listening2025.items[8].tags.includes("exclusive-pair:listening-speaker-3"));
  assert.ok(grade11Listening2025.items[9].tags.includes("exclusive-pair:listening-speaker-3"));
  assert.ok(grade11Listening2025.items[10].tags.includes("exclusive-pair:listening-speaker-4"));
  assert.ok(grade11Listening2025.items[11].tags.includes("exclusive-pair:listening-speaker-4"));
});

test("Grade 11 full round is coherent 2025 across all four sections",()=>{
  const bank=fullBankForGrade(11);
  assert.ok(bank.objective.some(q=>q.year===2025&&q.section==="reading"));
  assert.ok(bank.objective.some(q=>q.year===2025&&q.section==="use-of-english"));
  const session=createFullSession(11,{},[],()=>.5,"2026-09-18T10:00:00.000Z");
  assert.equal(session.listeningGroupId,"g11-2025-listening");
  assert.equal(session.questionIds.listening.length,20);
  assert.equal(session.questionIds.reading.length,20);
  assert.equal(session.questionIds["use-of-english"].length,20);
  assert.equal(session.writingTaskId,"g11-2025-writing-01");
});

test("official training UI supports large matching banks and paired-answer exclusivity",()=>{
  const official=readFileSync("components/training/OfficialSection.tsx","utf8");
  const full=readFileSync("components/training/FullOlympiadTraining.tsx","utf8");
  assert.ok(official.includes('q.type==="matching"'));
  assert.ok(official.includes("exclusive-pair:"));
  assert.ok(full.includes("exclusive-pair:"));
});
