import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {challenge10} from "../data/challenge-10-preview.ts";
const source=(file:string)=>readFileSync(new URL("../"+file,import.meta.url),"utf8");
test("Grade 9–11 main routes use mixed history and original training, 7–8 unchanged",()=>{
 const route=source("app/training/full-olympiad/page.tsx");
 assert.match(route,/\[9,10,11\]\.includes\(Number\(profile\.grade\)\)\?"mixed":"official"/);
 const author=source("app/training/new-olympiad/page.tsx");
 assert.match(author,/\[9,10,11\]\.includes\(Number\(profile\.grade\)\)\?"mixed":"generated"/);
 const archive=source("app/training/official-archive/page.tsx");
 assert.match(archive,/return <FullOlympiadTraining\/>/);
});
test("Dashboard launches mixed full round, separate official archive and no redundant demo card",()=>{
 const dashboard=source("app/dashboard/page.tsx");
 const sidebar=source("components/Sidebar.tsx");
 assert.match(dashboard,/Начать новый смешанный вариант/);
 assert.match(dashboard,/Открыть официальный архив/);
 assert.ok(!dashboard.includes("Challenge 01 · Новый олимпиадный формат"));
 assert.ok(!dashboard.includes('href="/training/challenge-10-preview"'));
 assert.match(sidebar,/Полная тренировка/);
 assert.match(sidebar,/\/training\/full-olympiad/);
});
test("Original complete paper is retained as a reviewable stable archive",()=>{
 const content=source("app/training/challenge-10-preview/page.tsx");
 assert.match(content,/Пока подготовлен один авторский вариант/);
 assert.equal(challenge10.sections.length,4);
 assert.equal(Object.keys(challenge10.keys).length,60);
});

test("Grade 9–11 standalone sections do not silently display the old bank",()=>{
 const gate=source("components/training/GradeOfficialSection.tsx");
 assert.match(gate,/\(grade===9\|\|grade===10\|\|grade===11\)&&!openLegacySection/);
 assert.match(gate,/href="\/training\/full-olympiad"/);
 assert.match(gate,/прежний банк/);
 assert.match(gate,/setOpenLegacySection\(true\)/);
 const sidebar=source("components/Sidebar.tsx");
 assert.match(sidebar,/n\+" · отдельно"/);
 const dashboard=source("app/dashboard/page.tsx");
 assert.match(dashboard,/Это отдельные упражнения из прежнего банка/);
});

test("full training never highlights a standalone skill tab and offers explicit fresh versus resume",()=>{
 const page=source("components/training/FullOlympiadTraining.tsx");
 const menu=source("components/Sidebar.tsx");
 assert.ok(page.includes('<Sidebar active="Полная тренировка" fullTraining/>'));
 assert.ok(!page.includes("<Sidebar active={labels[section]}/>"));
 assert.match(page,/setResumeChoice\(Boolean\(resumed\)\)/);
 assert.match(page,/if\(resumeChoice&&session&&!session.completedAt\)/);
 assert.match(page,/Продолжить с сохранёнными ответами/);
 assert.match(page,/Начать новый вариант/);
 assert.match(page,/onClick=\{startAnother\}/);
 assert.match(menu,/fullTraining\?items\.filter/);
 assert.match(menu,/Полная тренировка/);
});

test("Grade 11 dashboard, menu and student guide display the same unified full route",()=>{
 const dashboard=source("app/dashboard/page.tsx");
 const sidebar=source("components/Sidebar.tsx");
 const guide=source("app/guide/page.tsx");
 const gate=source("components/training/GradeOfficialSection.tsx");
 assert.match(dashboard,/\[9,10,11\]\.includes\(grade\)/);
 assert.match(dashboard,/9,10,11/);
 assert.match(sidebar,/grade===11/);
 assert.match(guide,/9–11 классов/);
 assert.match(gate,/grade===11/);
});

test("Grade 9 uses one full-training entry, separate legacy practice and isolated task history",()=>{
 const route=source("app/training/full-olympiad/page.tsx");
 const dashboard=source("app/dashboard/page.tsx");
 const sidebar=source("components/Sidebar.tsx");
 const gate=source("components/training/GradeOfficialSection.tsx");
 const guide=source("app/guide/page.tsx");
 assert.match(route,/\[9,10,11\]/);
 assert.match(dashboard,/\[9,10,11\]\.includes\(grade\)/);
 assert.match(sidebar,/grade===9/);
 assert.match(gate,/grade===9/);
 assert.match(guide,/9–11/);
});
