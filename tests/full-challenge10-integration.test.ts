import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {challenge10} from "../data/challenge-10-preview.ts";
const source=(file:string)=>readFileSync(new URL("../"+file,import.meta.url),"utf8");
test("Grade 10 main routes use mixed historical and original training, other grades unchanged",()=>{
 const route=source("app/training/full-olympiad/page.tsx");
 assert.match(route,/Number\(profile\.grade\)===10\?"mixed":"official"/);
 const author=source("app/training/new-olympiad/page.tsx");
 assert.match(author,/Number\(profile\.grade\)===10\?"mixed":"generated"/);
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
