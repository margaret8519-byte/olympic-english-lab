import test from "node:test";
import assert from "node:assert/strict";
import {fullBankForGrade,resolveSessionQuestions,resolveFullListeningGroup} from "../lib/full-olympiad.ts";
import {beginFullTraining,fullProfileKey,fullGlobalIssuedKey} from "../lib/full-training-storage.ts";
import {approved10Questions,approved10Listening,approved10Writing} from "../data/challenge-10-mixed-bank.ts";

function store(){
 const records=new Map<string,string>();
 return{getItem:(k:string)=>records.get(k)||null,setItem:(k:string,v:string)=>{records.set(k,v)},removeItem:(k:string)=>{records.delete(k)},get length(){return records.size},key:(i:number)=>[...records.keys()][i]||null};
}
const profile={firstName:"Tester",lastName:"Olympiad",grade:"10",classLetter:"A"};

test("the approved challenge is fully converted: answers, sections, scripts and original Writing",()=>{
 assert.equal(approved10Questions.length,60);
 assert.equal(new Set(approved10Questions.map(q=>q.id)).size,60);
 for(const q of approved10Questions){
   assert.ok(q.text&&!q.text.startsWith("Answer question "),q.id+": no task question");
   assert.ok(q.acceptedAnswers[0],q.id+": no answer");
   if(q.type!=="gap-fill")assert.ok(q.options.length>=2,q.id+": missing response options");
 }
 assert.deepEqual(approved10Listening.map(s=>s.questions.length),[6,7,7]);
 assert.ok(approved10Listening.every(s=>s.script&&s.script.length>1200));
 assert.ok(approved10Writing.text.includes("At first, I thought the letter"));
 assert.equal(approved10Questions[20].options.length,8);
 assert.equal(approved10Questions[27].options.length,7);
 assert.ok(approved10Questions[51].text.includes("BELIEVED"));
});

test("mixed grade-10 bank contains official years and original question sets across skills",()=>{
 const bank=fullBankForGrade(10,"mixed");
 for(const section of ["reading","use-of-english"] as const){
  const subset=bank.objective.filter(q=>q.section===section);
  assert.ok(subset.some(q=>q.source==="official-vsosh-vzlet"&&q.year<=2025));
  assert.ok(subset.some(q=>q.source==="original-olympic-english-lab"&&q.year===2026));
 }
 assert.ok(bank.listeningGroups.some(g=>g.source==="official-vsosh-vzlet"));
 assert.ok(bank.listeningGroups.some(g=>g.source==="original-olympic-english-lab"));
 assert.ok(bank.writings.some(g=>g.source==="official-vsosh-vzlet"));
 assert.ok(bank.writings.some(g=>g.id==="approved10-writing"));
});

test("each new full round mixes origins and keeps listening, reading, grammar and Writing connected",()=>{
 const storage=store(),previous=new Set<string>(),audio=new Set<string>();
 for(let run=0;run<3;run++){
  const round=beginFullTraining(storage,10,"mixed",profile,()=>0.5);
  const selected=resolveSessionQuestions(round);
  const listener=resolveFullListeningGroup(round);
  assert.ok(listener&&listener.questions.length>0,"Missing playable Listening");
  assert.ok(!audio.has(listener.id),"Audio group repeated before pool exhausted");
  audio.add(listener.id);
  for(const section of ["reading","use-of-english"] as const){
   const block=selected.filter(q=>q.section===section);
   assert.ok(block.some(q=>q.source==="official-vsosh-vzlet"),section+" missing official material");
   assert.ok(block.some(q=>q.source==="original-olympic-english-lab"),section+" missing original material");
   for(const q of block){assert.equal(previous.has(q.id),false,q.id+" unexpectedly repeated in first 3 rounds");previous.add(q.id)}
  }
  assert.ok(round.writingTaskId);
 }
 assert.ok(storage.getItem(fullGlobalIssuedKey(10,"mixed")));
 assert.equal(storage.getItem(fullProfileKey(profile)),null,"Mixed rounds must not replace official archive draft");
});

test("different pupils share browser rotation, but resume independently",()=>{
 const s=store();
 const a=beginFullTraining(s,10,"mixed",profile,()=>0.5);
 const bob={...profile,firstName:"Bob"};
 const b=beginFullTraining(s,10,"mixed",bob,()=>0.5);
 assert.notEqual(a.listeningGroupId,b.listeningGroupId);
 for(const section of ["reading","use-of-english"] as const){
  assert.ok(!a.questionIds[section].some(id=>b.questionIds[section].includes(id)),section+" shared task too soon");
 }
});
