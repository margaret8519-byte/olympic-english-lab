import test from "node:test";
import assert from "node:assert/strict";
import { grade11Registry, grade11WritingSets } from "../data/questions/grade-10-11/index.ts";

const officialListening = [
  "a", "c", "c", "b", "a", "c", "b", "b", "c", "a",
  "working", "commemorate", "unison", "gentle", "avalanches",
  "f", "f", "f", "t", "f",
];
const officialReading = [
  "c", "c", "a", "b", "a", "b", "b", "b",
  "snug", "dabble", "market", "freelance", "submit", "bare", "praise",
  "f", "t", "f", "t", "t",
];
const officialUseOfEnglish = [
  "outcomes", "curate", "ripping", "tutoring", "hone", "positives", "harnessing", "replicate",
  "c", "d", "a", "c", "d", "a", "b", "b", "d", "f", "c", "e",
];

test("Grade 11 2024 objective keys match the published municipal key", () => {
  const bank = grade11Registry[2024];
  assert.equal(bank.listening.items.length, 20);
  assert.equal(bank.reading.items.length, 20);
  assert.equal(bank["use-of-english"].items.length, 20);
  assert.deepEqual(bank.listening.items.map((item) => item.acceptedAnswers[0]), officialListening);
  assert.deepEqual(bank.reading.items.map((item) => item.acceptedAnswers[0]), officialReading);
  assert.deepEqual(bank["use-of-english"].items.map((item) => item.acceptedAnswers[0]), officialUseOfEnglish);
});

test("Grade 11 2024 Writing keeps the official conditional-and-idiom requirements", () => {
  const writing = grade11WritingSets.find((set) => set.items[0]?.year === 2024)?.items[0];
  assert.ok(writing);
  assert.deepEqual(writing.wordLimit, { min: 200, max: 250 });
  assert.ok(writing.needsReview);
  assert.equal(writing.acceptedAnswers.length, 0);
  assert.ok(writing.requirements?.some((value) => /conditional/i.test(value)));
  assert.ok(writing.requirements?.some((value) => /idiom/i.test(value)));
});

test("Grade 11 2024 Listening stays outside file playback until the official MP3 is stored and validated", () => {
  const listening = grade11Registry[2024].listening;
  assert.equal(listening.audioMode, "speech");
  assert.equal(listening.audioSrc, undefined);
});
