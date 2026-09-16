import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const profileBadge = readFileSync("components/ProfileBadge.tsx", "utf8");
const classPanel = readFileSync("components/StudentClassPanel.tsx", "utf8");

test("profile grade prefers the joined teacher class over stale local profile", () => {
  assert.match(profileBadge, /studentClass/);
  assert.match(profileBadge, /grade:String\(klass\.grade\)/);
  assert.match(profileBadge, /classLetter:klass\.class_letter/);
});

test("existing Supabase enrollment refreshes local class and profile state", () => {
  assert.match(classPanel, /localStorage\.setItem\("studentClass"/);
  assert.match(classPanel, /localStorage\.setItem\("studentProfile"/);
  assert.match(classPanel, /student-profile-change/);
});
