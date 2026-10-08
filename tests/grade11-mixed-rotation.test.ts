import test from "node:test";
import assert from "node:assert/strict";
import {fullBankForGrade,resolveFullListeningGroup,resolveSessionQuestions,resolveSessionWriting} from "../lib/full-olympiad.ts";
import {beginFullTraining,fullProfileKey,fullGlobalIssuedKey} from "../lib/full-training-storage.ts";
import {generatedComplete11} from "../data/questions/generated-complete-11-2026.ts";

const anna={firstName:"Anna",lastName:"Test",grade:"11",classLetter:"A"};
const grade10={...anna,grade:"10"};
function storage(){
 const map=new Map<string,string>();
 return{getItem:(k:string)=>map.get(k)??null,setItem:(k:string,v:string)=>{map.set(k,v)},removeItem:(k:string)=>{map.delete(k)},get length(){return map.size},key:(i:number)=>[...map.keys()][i]??null};
}
test("Grade 11 bank has genuine past-year and independent original materials",()=>{
 const mixed=fullBankForGrade(11,"mixed");
 const official=fullBankForGrade(11,"official");
 for(const section of ["reading","use-of-english"] as const){
   const questions=mixed.objective.filter(q=>q.section===section);
   assert.ok(questions.some(q=>q.source==="official-vsosh-vzlet"&&q.grade===11&&q.year<=2025),section+" official missing");
   assert.ok(questions.some(q=>q.source==="original-olympic-english-lab"&&q.grade===11&&q.year===2026),section+" authored missing");
 }
 assert.ok(mixed.listeningGroups.some(g=>g.source==="official-vsosh-vzlet"&&g.grade===11));
 assert.ok(mixed.listeningGroups.some(g=>g.source==="original-olympic-english-lab"&&g.grade===11));
 assert.ok(mixed.writings.some(w=>w.source==="official-vsosh-vzlet"&&w.grade===11));
 assert.ok(mixed.writings.some(w=>w.source==="original-olympic-english-lab"&&w.grade===11));
 assert.ok(mixed.objective.every(q=>q.grade===11), "mixed Grade 11 includes questions from Grade 10");
 assert.ok(mixed.listeningGroups.every(group=>group.grade===11));
 assert.ok(mixed.objective.length>official.objective.length);
});
test("answer permutation breaks the A-key bias while preserving the correct option",()=>{
 const mixed=fullBankForGrade(11,"mixed");
 const newQuestions=generatedComplete11.flatMap(set=>[...set.reading.items,...set.useOfEnglish.items]);
 const freq=new Map<string,number>();
 for(const original of newQuestions){
   const adapted=mixed.objective.find(q=>q.id===original.id);
   assert.ok(adapted, "No adapted author item "+original.id);
   assert.equal(adapted.options.length,4);
   const prior=original.acceptedAnswers[0].toLowerCase();
   const updated=adapted.acceptedAnswers[0].toLowerCase();
   const a=original.options[prior.charCodeAt(0)-97];
   const b=adapted.options[updated.charCodeAt(0)-97];
   assert.equal(b.slice(2),a.slice(2),"Incorrect key after permutation: "+original.id);
   freq.set(updated,(freq.get(updated)||0)+1);
 }
 assert.equal(newQuestions.length,100);
 for(const letter of ["a","b","c","d"])assert.ok((freq.get(letter)||0)>=15,"Biased answer key "+letter);
});
test("three fresh Grade 11 rounds differ in Listening, Reading and Use of English",()=>{
 const store=storage(),previous=new Set<string>(),heard=new Set<string>(),written=new Set<string>();
 for(let n=0;n<3;n++){
   const session=beginFullTraining(store,11,"mixed",anna,()=>0.5);
   const listening=resolveFullListeningGroup(session);
   const writing=resolveSessionWriting(session);
   assert.ok(listening?.questions.length);
   assert.equal(heard.has(listening!.id),false,"Listening repeated too soon");
   heard.add(listening!.id);
   assert.ok(writing?.text&&writing.grade===11);
   assert.equal(written.has(writing.id),false,"Writing repeated too soon");
   written.add(writing.id);
   for(const section of ["reading","use-of-english"] as const){
     const qs=resolveSessionQuestions(session).filter(q=>q.section===section);
     assert.ok(qs.some(q=>q.source==="official-vsosh-vzlet"),section+" missing official source");
     assert.ok(qs.some(q=>q.source==="original-olympic-english-lab"),section+" missing authored source");
     for(const q of qs){
       const fingerprint=[q.section,q.text,q.passage||""].join("|").normalize("NFKC").toLowerCase().replace(/\s+/g," ").trim();
       assert.equal(previous.has(fingerprint),false,"Question wording repeated before exhaustion: "+q.id);
       previous.add(fingerprint);
     }
   }
 }
 assert.ok(store.getItem(fullGlobalIssuedKey(11,"mixed")));
 assert.equal(store.getItem(fullProfileKey(grade10)),null);
});
test("per-student history is independent and Grade 10 and Grade 11 do not share ledgers",()=>{
 const s=storage(),a=beginFullTraining(s,11,"mixed",anna,()=>0.5);
 const b=beginFullTraining(s,11,"mixed",{...anna,firstName:"Boris"},()=>0.5);
 assert.notEqual(a.listeningGroupId,b.listeningGroupId);
 for(const section of ["reading","use-of-english"] as const)
   assert.equal(a.questionIds[section].some(q=>b.questionIds[section].includes(q)),false,section+" repeated for second student");
 assert.notEqual(fullGlobalIssuedKey(10,"mixed"),fullGlobalIssuedKey(11,"mixed"));
 const c=beginFullTraining(s,10,"mixed",grade10,()=>0.5);
 assert.equal(c.grade,10);
 assert.equal(a.grade,11);
});
