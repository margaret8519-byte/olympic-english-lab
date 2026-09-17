import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import {
  adaptiveBankForSeniorGrade,
  grade10Listening2022,
  grade10Official2024,
  grade10WritingSets,
  grade11Listening2022,
  grade11Registry,
  grade11WritingSets,
  objectiveBankForSeniorGrade,
  seniorOriginalReading,
  seniorOriginalSet,
  seniorOriginalUseOfEnglish,
} from "../data/questions/grade-10-11/index.ts";
import { originalWritingSets } from "../data/questions/writing-original.ts";
import type { QuestionSet, Section } from "../data/questions/types.ts";
import {
  createFullSession,
  FULL_SECTION_ORDER,
  fullBankForGrade,
  resolveSessionQuestions,
} from "../lib/full-olympiad.ts";
import {
  completeStandaloneHistory,
  createStandaloneListeningSession,
  createStandaloneSession,
  listeningGroupsFromSets,
  selectableQuestions,
} from "../lib/standalone-training.ts";
import { isQuestionAllowedForGrade, registryForGrade } from "../lib/training-grade.ts";
import {
  disabledListeningGroups,
  isStrictlySafeListeningGroup,
  validatedListeningGroupsForGrade,
} from "../lib/listening-registry.ts";

test("grade 10 and 11 registries stay isolated", () => {
  assert.equal(registryForGrade(10), "grade-10");
  assert.equal(registryForGrade(11), "grade-11");
  for (const grade of [10, 11] as const) {
    const bank = objectiveBankForSeniorGrade(grade);
    assert.ok(bank.length >= 60);
    assert.ok(bank.every(q => q.grade === grade && isQuestionAllowedForGrade(q, grade)));
    assert.ok(bank.every(q => !isQuestionAllowedForGrade(q, grade === 10 ? 11 : 10)));
    assert.ok(bank.every(q => !isQuestionAllowedForGrade(q, 9)));
  }
});

test("shared Grade 9-10 Vzlet 2024 objective bank is exposed to Grade 10", () => {
  assert.equal(grade10Official2024.listening.items.length, 20);
  assert.equal(grade10Official2024.reading.items.length, 20);
  assert.equal(grade10Official2024["use-of-english"].items.length, 20);
  for (const section of ["listening", "reading", "use-of-english"] as const) {
    assert.ok(grade10Official2024[section].items.every(q => q.grade === 10));
    assert.ok(grade10Official2024[section].items.every(q => q.source === "official-vsosh-vzlet"));
    assert.ok(grade10Official2024[section].items.every(q => q.acceptedAnswers.length === 1 && !q.needsReview));
  }
  const bank = objectiveBankForSeniorGrade(10);
  assert.ok(bank.some(q => q.id.startsWith("g10-2024-reading-")));
  assert.ok(bank.some(q => q.id.startsWith("g10-2024-use-of-english-")));
  assert.ok(bank.every(q => !q.id.startsWith("g9-")));
});

test("only keyed senior objective items are auto-scored", () => {
  for (const grade of [10, 11] as const) {
    assert.ok(objectiveBankForSeniorGrade(grade).every(q => q.acceptedAnswers.length && !q.needsReview));
  }
});

test("senior Reading groups remain indivisible and ordered", () => {
  for (const grade of [10, 11] as const) {
    const reading = objectiveBankForSeniorGrade(grade).filter(q => q.section === "reading");
    for (const group of new Set(reading.map(q => q.groupId))) {
      assert.deepEqual(
        reading.filter(q => q.groupId === group).map(q => q.id),
        objectiveBankForSeniorGrade(grade).filter(q => q.groupId === group).map(q => q.id),
      );
    }
  }
});

test("full olympiad skips unavailable Grade 9 Listening and starts validated senior Listening", () => {
  assert.deepEqual(FULL_SECTION_ORDER, ["listening", "reading", "use-of-english", "writing"]);
  const grade9 = createFullSession(9, {}, [], () => 0.5, "2026-01-01T00:00:00.000Z");
  assert.equal(FULL_SECTION_ORDER[grade9.sectionIndex], "reading");
  assert.equal(grade9.listeningGroupId, undefined);
  assert.deepEqual(grade9.questionIds.listening, []);
  assert.ok(resolveSessionQuestions(grade9).every(question => question.section !== "listening"));

  for (const grade of [10, 11] as const) {
    const session = createFullSession(grade, {}, [], () => 0.5, "2026-01-01T00:00:00.000Z");
    const questions = resolveSessionQuestions(session);
    assert.equal(FULL_SECTION_ORDER[session.sectionIndex], "listening");
    assert.equal(session.listeningGroupId, `g${grade}-2022-listening`);
    assert.equal(session.questionIds.listening.length, 20);
    assert.ok(questions.some(question => question.section === "listening"));
    assert.ok(questions.some(question => question.section === "reading"));
    assert.ok(questions.some(question => question.section === "use-of-english"));
  }
});

test("senior Writing remains manual review material", () => {
  for (const sets of [grade10WritingSets, grade11WritingSets]) {
    assert.equal(sets.length, 3);
    assert.ok(sets.every(set => set.items[0].type === "writing" && set.items[0].needsReview && !set.items[0].acceptedAnswers.length));
  }
});

test("senior adaptive bank preserves the selected grade", () => {
  for (const grade of [10, 11] as const) {
    const bank = adaptiveBankForSeniorGrade(grade);
    assert.ok(bank.length);
    assert.ok(bank.every(q => q.grade === grade));
  }
});

test("only validated 2022 senior MP3s are currently SAFE", () => {
  for (const path of ["public/audio/grade-10/2022/listening.mp3", "public/audio/grade-11/2022/listening.mp3"]) {
    assert.ok(existsSync(path));
    assert.ok(statSync(path).size > 1_000_000);
    assert.equal(readFileSync(path).subarray(0, 3).toString("latin1"), "ID3");
  }
  assert.equal(grade10Listening2022.audioMode, "file");
  assert.equal(grade10Listening2022.audioSrc, "/audio/grade-10/2022/listening.mp3");
  assert.equal(grade10Listening2022.items.length, 20);
  assert.equal(grade11Listening2022.audioMode, "file");
  assert.equal(grade11Listening2022.audioSrc, "/audio/grade-11/2022/listening.mp3");
  assert.equal(grade11Listening2022.items.length, 20);

  assert.equal(validatedListeningGroupsForGrade(9).length, 0);
  for (const grade of [10, 11] as const) {
    const groups = validatedListeningGroupsForGrade(grade);
    assert.equal(groups.length, 1);
    assert.equal(isStrictlySafeListeningGroup(groups[0]), true);
    assert.equal(groups[0].grade, grade);
    assert.equal(groups[0].audioMode, "file");
    assert.match(groups[0].audioSrc, new RegExp(`/audio/grade-${grade}/2022/listening\\.mp3`));
  }
});

test("2024 Listening remains out of SAFE registry until source MP3 verification", () => {
  assert.ok(disabledListeningGroups.some(group => group.grade === 9 && group.year === 2024 && group.reason === "audio-transcript-mismatch"));
  assert.ok(disabledListeningGroups.some(group => group.grade === 10 && group.year === 2024 && group.reason === "audio-transcript-mismatch"));
  assert.ok(disabledListeningGroups.some(group => group.grade === 11 && group.year === 2024 && group.reason === "missing-audio"));

  const groups = validatedListeningGroupsForGrade(10);
  const selected = createStandaloneListeningSession("student", 10, groups);
  assert.ok(selected);
  assert.equal(selected.group.id, "g10-2022-listening");
  assert.equal(fullBankForGrade(10).listeningGroups[0].id, "g10-2022-listening");
});

test("Standalone and Full Olympiad share the SAFE Listening registry", () => {
  const standalone = readFileSync("components/training/GradeOfficialSection.tsx", "utf8");
  const full = readFileSync("lib/full-olympiad.ts", "utf8");
  assert.match(standalone, /validatedListeningGroupsForGrade\(grade\)/);
  assert.match(full, /validatedListeningGroupsForGrade\(grade\)/);
  for (const grade of [9, 10, 11]) {
    assert.deepEqual(fullBankForGrade(grade).listeningGroups, validatedListeningGroupsForGrade(grade));
  }
});

test("senior original banks keep broad Reading and UOE coverage", () => {
  for (const grade of [10, 11] as const) {
    const reading = seniorOriginalReading(grade);
    const uoe = seniorOriginalUseOfEnglish(grade);
    assert.equal(new Set(reading.map(q => q.groupId)).size, 10);
    assert.equal(reading.length, 50);
    assert.equal(uoe.length, 70);
    assert.equal(new Set([...reading, ...uoe].map(q => q.id)).size, 120);
    assert.ok([...reading, ...uoe].every(q => q.source === "original-olympic-english-lab" && q.acceptedAnswers.length === 1));
  }
});

test("Grade 10 official 2024 bank never falls back to Grade 9 IDs", () => {
  for (const section of ["reading", "use-of-english"] as const) {
    const official = grade10Official2024[section].items;
    assert.equal(official.length, 20);
    assert.ok(official.every(question => question.grade === 10));
    assert.ok(official.every(question => question.id.startsWith("g10-2024-")));
    assert.ok(official.every(question => !question.id.startsWith("g9-") && !question.groupId?.startsWith("g9-")));
  }
});

test("three consecutive senior attempts rotate material", () => {
  for (const grade of [10, 11] as const) for (const section of ["reading", "use-of-english"] as const) {
    const original = seniorOriginalSet(grade, section) as QuestionSet;
    const official = grade === 10 ? grade10Official2024[section] : grade11Registry[2024][section];
    const bank = selectableQuestions([original, official as QuestionSet], section as Section);
    let history = {};
    let last: string[] = [];
    const attempts: ReturnType<typeof createStandaloneSession>[] = [];
    for (let index = 0; index < 3; index++) {
      const attempt = createStandaloneSession(`student-${grade}`, grade, section, bank, history, last, () => 0.5, `2026-01-0${index + 1}T00:00:00.000Z`);
      attempts.push(attempt);
      history = completeStandaloneHistory(history, attempt.questions, Object.fromEntries(attempt.questions.map(question => [question.id, question.acceptedAnswers[0]])));
      last = attempt.session.questionIds;
    }
    for (let index = 1; index < attempts.length; index++) {
      assert.equal(attempts[index - 1].session.questionIds.filter(id => attempts[index].session.questionIds.includes(id)).length, 0);
    }
  }
});

test("grades 9, 10 and 11 each have original manual-review Writing prompts", () => {
  for (const grade of [9, 10, 11] as const) {
    const sets = originalWritingSets(grade);
    assert.equal(sets.length, 3);
    assert.ok(sets.every(set => (set.items[0] as unknown as { source: string }).source === "original-olympic-english-lab" && set.items[0].needsReview && !set.items[0].acceptedAnswers.length));
  }
});

test("senior training UI renders grade and selected audio group", () => {
  const official = readFileSync("components/training/OfficialSection.tsx", "utf8");
  const full = readFileSync("components/training/FullOlympiadTraining.tsx", "utf8");
  assert.match(official, /set\.items\[0\]\?\.grade/);
  assert.match(full, /listeningGroup\.audioSrc/);
  assert.doesNotMatch(full, /grade===10\?"\/audio\/grade-10\/2024\/listening\.mp3"/);
});
