import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { speakingSets } from "../data/speaking/2022/sets.ts";
import { selectSpeakingVisitTask } from "../lib/speaking-selection.ts";

test("mobile navigation exposes every training category separately", () => {
  const sidebar = readFileSync("components/Sidebar.tsx", "utf8");
  const css = readFileSync("app/globals.css", "utf8");
  assert.match(sidebar, /className="mobile-category-nav"/);
  for (const href of ["/training/listening", "/training/reading", "/training/use-of-english", "/training/writing", "/training/speaking"])
    assert.match(sidebar, new RegExp(`h: "${href}"`));
  assert.match(css, /@media\(max-width:900px\)[\s\S]*?\.mobile-category-nav\{[^}]*display:flex/);
  assert.match(css, /\.mobile-category-nav a\{[^}]*pointer-events:auto;touch-action:manipulation/);
  assert.match(css, /\.sidebar:not\(\.open\)\{pointer-events:none\}/);
  assert.match(sidebar, /aria-current=\{n === active \? "page"/);
  assert.doesNotMatch(sidebar, /training && !trainingAllowed/);
});

test("twenty Speaking visits are mixed without repeating a task", () => {
  const shown: string[] = [];
  for (let visit = 0; visit < 20; visit += 1) {
    const task = selectSpeakingVisitTask(speakingSets, 10, shown, () => ((visit * 7) % 20) / 20);
    assert.ok(task);
    assert.ok(!shown.includes(task.id));
    shown.push(task.id);
  }
  assert.equal(new Set(shown).size, 20);
  assert.equal(selectSpeakingVisitTask(speakingSets, 10, shown, () => 0.5), null);
});

test("student UI keeps the vivid responsive design system accessible", () => {
  const css = readFileSync("app/globals.css", "utf8");
  assert.match(css, /Student experience — vivid, game-like visual refresh/);
  assert.match(css, /\.full-dashboard-hero\{[^}]*isolation:isolate/);
  assert.match(css, /\.skill-card:nth-child\(4\)/);
  assert.match(css, /\.portal button:focus-visible/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
});

test("release UI has grade-safe resume, reviewed Full Writing, and friendly auth errors", () => {
  const dashboard = readFileSync("app/dashboard/page.tsx", "utf8");
  const full = readFileSync("components/training/FullOlympiadTraining.tsx", "utf8");
  const auth = readFileSync("components/teacher/TeacherAuthForm.tsx", "utf8");
  const start = readFileSync("app/start/page.tsx", "utf8");
  assert.match(dashboard, /stored\?\.grade === grade \? stored : null/);
  assert.match(dashboard, /Полный письменный банк доступен для 7–11 классов/);
  assert.doesNotMatch(dashboard, /<b>\{attempt\.mode\}<\/b>/);
  assert.match(full, /from\("writing_reviews"\)/);
  assert.match(full, /writingStatus:"reviewed"/);
  assert.match(auth, /Неверный email или пароль/);
  assert.doesNotMatch(start, /local"\);console\.error\("\[Supabase profile sync error\]/);
});
