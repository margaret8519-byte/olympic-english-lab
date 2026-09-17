import test from "node:test";
import assert from "node:assert/strict";
import { fullBankForGrade } from "../lib/full-olympiad.ts";

for (const grade of [9, 10] as const) {
  test(`full olympiad Grade ${grade} includes shared Vzlet 2024 Reading and UOE`, () => {
    const bank = fullBankForGrade(grade).objective;
    const officialReading = bank.filter(q => q.source === "official-vsosh-vzlet" && q.year === 2024 && q.section === "reading");
    const officialUoe = bank.filter(q => q.source === "official-vsosh-vzlet" && q.year === 2024 && q.section === "use-of-english");
    assert.equal(officialReading.length, 20);
    assert.equal(officialUoe.length, 20);
    assert.ok([...officialReading, ...officialUoe].every(q => Number(q.grade) === grade));
    assert.ok([...officialReading, ...officialUoe].every(q => q.platformLabel === "Взлёт"));
  });
}

test("full olympiad keeps unverified 2024 Listening out of the objective bank", () => {
  for (const grade of [9, 10] as const) {
    assert.ok(fullBankForGrade(grade).objective.every(q => q.section !== "listening"));
  }
});
