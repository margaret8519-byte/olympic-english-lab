import test from "node:test";
import assert from "node:assert/strict";
import {fullBankForGrade,resolveFullListeningGroup,resolveSessionQuestions,resolveSessionWriting} from "../lib/full-olympiad.ts";
import {beginFullTraining,fullGlobalIssuedKey,fullProfileKey} from "../lib/full-training-storage.ts";
import {generatedComplete910ForGrade} from "../data/questions/generated-complete-910-2026.ts";

const profile={firstName:"Nina",lastName:"Test",grade:"9",classLetter:"A"};
function storage(){
 const map=new Map<string,string>();
 return{getItem:(k:string)=>map.get(k)??null,setItem:(k:string,v:string)=>{map.set(k,v)},removeItem:(k:string)=>{map.delete(k)},get length(){return map.size},key:(i:number)=>[...map.keys()][i]??null};
}
const fingerprint=(q:{section:string;text:string;passage?:string})=>[q.section,q.text,q.passage||""].join("|").normalize("NFKC").toLowerCase().replace(/\s+/g," ").trim();

test("Grade 9 mixed bank contains real archive material and its own original packs",()=>{
 const mixed=fullBankForGrade(9,"mixed"),official=fullBankForGrade(9,"official");
 for(const section of ["reading","use-of-english"] as const){
  const questions=mixed.objective.filter(q=>q.section===section);
  assert.ok(questions.some(q=>q.source==="official-vsosh-vzlet"&&q.grade===9&&q.year===2023),section+" missing verified 2023 archive");
  assert.ok(questions.some(q=>q.source==="official-vsosh-vzlet"&&q.grade===9&&q.year===2025),section+" missing official 2025 archive");
  assert.ok(questions.some(q=>q.source==="original-olympic-english-lab"&&q.grade===9&&q.year===2026),section+" missing Grade 9 author material");
 }
 assert.ok(mixed.objective.every(q=>Number(q.grade)===9),"Grade 10 or 11 questions leaked into Grade 9 bank");
 assert.ok(mixed.listeningGroups.length>5&&mixed.listeningGroups.every(g=>g.grade===9));
 assert.ok(mixed.listeningGroups.some(g=>g.source==="official-vsosh-vzlet"));
 assert.ok(mixed.listeningGroups.some(g=>g.source==="original-olympic-english-lab"));
 assert.ok(mixed.writings.some(q=>q.source==="official-vsosh-vzlet"&&q.grade===9));
 assert.ok(mixed.writings.some(q=>q.source==="original-olympic-english-lab"&&q.grade===9));
 assert.ok(mixed.objective.length>official.objective.length);
});

test("fix old predictable answer-key pattern without altering the right answer",()=>{
 const originals=generatedComplete910ForGrade(9).flatMap(set=>[...set.reading.items,...set.useOfEnglish.items]);
 const bank=fullBankForGrade(9,"mixed");
 const counts=new Map<string,number>();
 assert.equal(originals.length,100);
 for(const q of originals){
  const updated=bank.objective.find(p=>p.id===q.id);
  assert.ok(updated,"Missing author question "+q.id);
  const originalKey=q.acceptedAnswers[0].toLowerCase(),newKey=updated.acceptedAnswers[0].toLowerCase();
  assert.ok(["a","b","c","d"].includes(newKey));
  const previous=q.options[originalKey.charCodeAt(0)-97],current=updated.options[newKey.charCodeAt(0)-97];
  assert.equal(current.slice(2),previous.slice(2),"Incorrect option after shuffle: "+q.id);
  counts.set(newKey,(counts.get(newKey)||0)+1);
 }
 for(const key of ["a","b","c","d"])assert.ok((counts.get(key)||0)>=15,"Unbalanced answer "+key);
});

test("three new attempts have different questions and fresh Listening and Writing",()=>{
 const store=storage(),textSeen=new Set<string>(),audioSeen=new Set<string>(),writingSeen=new Set<string>();
 for(let run=0;run<3;run++){
  const session=beginFullTraining(store,9,"mixed",profile,()=>0.5);
  assert.equal(session.grade,9);
  const listening=resolveFullListeningGroup(session),writing=resolveSessionWriting(session);
  assert.ok(listening?.questions.length);
  assert.equal(audioSeen.has(listening!.id),false,"Listening group prematurely repeated");
  audioSeen.add(listening!.id);
  assert.ok(writing?.text);
  assert.equal(writingSeen.has(writing!.id),false,"Writing prematurely repeated");
  writingSeen.add(writing!.id);
  const questions=resolveSessionQuestions(session);
  for(const section of ["reading","use-of-english"] as const){
   const selected=questions.filter(q=>q.section===section);
   assert.ok(selected.length>0);
   if(run===0){
    assert.ok(selected.some(q=>q.source==="official-vsosh-vzlet"),"No archive questions in "+section);
    assert.ok(selected.some(q=>q.source==="original-olympic-english-lab"),"No author questions in "+section);
   }
   for(const q of selected){
    const key=fingerprint(q);
    assert.equal(textSeen.has(key),false,"Same visible question in new attempt: "+q.id);
    textSeen.add(key);
   }
  }
 }
 assert.ok(store.getItem(fullGlobalIssuedKey(9,"mixed")));
 assert.equal(store.getItem(fullProfileKey(profile)),null,"Mixed session cannot overwrite official draft");
});

test("new pupils in Grade 9 have distinct issued questions and isolated class history",()=>{
 const s=storage();
 const a=beginFullTraining(s,9,"mixed",profile,()=>0.5);
 const b=beginFullTraining(s,9,"mixed",{...profile,firstName:"Sasha"},()=>0.5);
 assert.notEqual(a.listeningGroupId,b.listeningGroupId);
 for(const section of ["reading","use-of-english"] as const)
  assert.ok(!a.questionIds[section].some(id=>b.questionIds[section].includes(id)),section+" cross-profile repetition");
 assert.notEqual(fullGlobalIssuedKey(9,"mixed"),fullGlobalIssuedKey(10,"mixed"));
 assert.notEqual(fullGlobalIssuedKey(9,"mixed"),fullGlobalIssuedKey(11,"mixed"));
});
