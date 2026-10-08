import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {challenge10} from "../data/challenge-10-preview.ts";
const source=(file:string)=>readFileSync(new URL("../"+file,import.meta.url),"utf8");
test("Grade 10 full training uses approved challenge, other grades keep the existing official trainer",()=>{
 const route=source("app/training/full-olympiad/page.tsx");
 assert.match(route,/Number\(profile\.grade\)===10\?<Grade10Challenge\/>:<FullOlympiadTraining\/>/);
 const author=source("app/training/new-olympiad/page.tsx");
 assert.match(author,/Number\(profile\.grade\)===10\?<Grade10Challenge\/>:<FullOlympiadTraining variant="generated"\/>/);
 const archive=source("app/training/official-archive/page.tsx");
 assert.match(archive,/return <FullOlympiadTraining\/>/);
});
test("Grade 10 student dashboard starts the new full route, not a standalone demo",()=>{
 const dashboard=source("app/dashboard/page.tsx");
 const sidebar=source("components/Sidebar.tsx");
 assert.match(dashboard,/Начать полную тренировку/);
 assert.match(dashboard,/Открыть официальный архив/);
 assert.ok(!dashboard.includes("Challenge 01 · Новый олимпиадный формат"));
 assert.ok(!dashboard.includes('href="/training/challenge-10-preview"'));
 assert.match(sidebar,/Полная тренировка/);
 assert.match(sidebar,/\/training\/full-olympiad/);
});
test("Full paper stays intact and honestly marks its single author-written set",()=>{
 const content=source("app/training/challenge-10-preview/page.tsx");
 assert.match(content,/Пока подготовлен один авторский вариант/);
 assert.match(content,/Основная тренировка · вариант 01/);
 assert.equal(challenge10.sections.length,4);
 assert.equal(Object.keys(challenge10.keys).length,60);
});
