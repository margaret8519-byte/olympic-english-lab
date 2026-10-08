import test from "node:test";
import assert from "node:assert/strict";
import {fullBankForGrade,resolveFullListeningGroup,resolveSessionQuestions,resolveSessionWriting,selectFullQuestions,type FullQuestion} from "../lib/full-olympiad.ts";
import {beginFullTraining,fullGlobalIssuedKey,fullProfileKey} from "../lib/full-training-storage.ts";
import {generatedComplete78} from "../data/questions/generated-complete-78-2026.ts";

const makeProfile=(grade:number)=>({firstName:"Test",lastName:"Junior",grade:String(grade),classLetter:"A"});
function storage(){
 const map=new Map<string,string>();
 return{getItem:(key:string)=>map.get(key)??null,setItem:(key:string,value:string)=>{map.set(key,value)},removeItem:(key:string)=>{map.delete(key)},get length(){return map.size},key:(index:number)=>[...map.keys()][index]??null};
}
const fingerprint=(q:{section:string;text:string;passage?:string})=>[q.section,q.text,q.passage||""].join("|").normalize("NFKC").toLowerCase().replace(/\s+/g," ").trim();

for(const grade of [7,8]){
 test("Grade "+grade+" mixed bank contains vetted years and authored junior Olympiad tasks",()=>{
  const bank=fullBankForGrade(grade,"mixed"),official=fullBankForGrade(grade,"official");
  assert.ok(bank.objective.length>official.objective.length);
  for(const section of ["reading","use-of-english"] as const){
   const questions=bank.objective.filter(q=>q.section===section&&!q.needsReview&&q.acceptedAnswers.length>0);
   assert.ok(questions.some(q=>q.source==="official-vsosh-vzlet"&&q.year<=2025),section+" no official past-year tasks");
   assert.ok(questions.some(q=>q.source==="original-olympic-english-lab"&&q.year===2026),section+" no authored task");
   assert.ok(questions.every(q=>q.grade==="7-8"),section+" wrong grade");
  }
  assert.ok(bank.listeningGroups.some(g=>g.source==="official-vsosh-vzlet"));
  assert.ok(bank.listeningGroups.some(g=>g.source==="original-olympic-english-lab"));
  assert.ok(bank.writings.some(w=>w.source==="official-vsosh-vzlet"));
  assert.ok(bank.writings.some(w=>w.source==="original-olympic-english-lab"));
  assert.ok(!bank.objective.some(q=>q.grade===9||q.grade===10||q.grade===11));
 });

 test("Grade "+grade+" 3 consecutive complete rounds avoid early repeats and isolate sessions",()=>{
  const store=storage(),seen=new Set<string>(),audios=new Set<string>(),writing=new Set<string>(),profile=makeProfile(grade);
  for(let i=0;i<3;i++){
   const session=beginFullTraining(store,grade,"mixed",profile,()=>0.5);
   assert.equal(session.grade,grade);
   const recording=resolveFullListeningGroup(session);
   const task=resolveSessionWriting(session);
   assert.ok(recording?.questions.length,"Listening missing");
   assert.ok(!audios.has(recording!.id),"Listening group repeated");
   audios.add(recording!.id);
   assert.ok(task?.text,"Writing missing");
   assert.ok(!writing.has(task!.id),"Writing task repeated");
   writing.add(task!.id);
   const selected=resolveSessionQuestions(session);
   for(const section of ["reading","use-of-english"] as const){
    const qs=selected.filter(q=>q.section===section);
    assert.ok(qs.length>0,section+" missing");
    if(i===0){
     assert.ok(qs.some(q=>q.source==="official-vsosh-vzlet"),section+" no official questions");
     assert.ok(qs.some(q=>q.source==="original-olympic-english-lab"),section+" no original questions");
    }
    for(const q of qs){
     const text=fingerprint(q);
     assert.equal(seen.has(text),false,"Repeated visible text "+q.id);
     seen.add(text);
    }
   }
  }
  assert.ok(store.getItem(fullGlobalIssuedKey(grade,"mixed")),"shared issued ledger missing");
  assert.equal(store.getItem(fullProfileKey(profile)),null,"mixed round overwrote official archive");
 });
}
test("7 and 8 have separate histories even when joint official papers share questions",()=>{
 const s=storage(),profile7=makeProfile(7),profile8=makeProfile(8);
 const s7=beginFullTraining(s,7,"mixed",profile7,()=>0.5),s8=beginFullTraining(s,8,"mixed",profile8,()=>0.5);
 assert.equal(s7.grade,7);
 assert.equal(s8.grade,8);
 assert.notEqual(fullGlobalIssuedKey(7,"mixed"),fullGlobalIssuedKey(8,"mixed"));
 assert.ok(s.getItem(fullGlobalIssuedKey(7,"mixed")));
 assert.ok(s.getItem(fullGlobalIssuedKey(8,"mixed")));
 const bob={...profile7,firstName:"Bob"},b=beginFullTraining(s,7,"mixed",bob,()=>0.5);
 assert.notEqual(s7.listeningGroupId,b.listeningGroupId);
 for(const section of ["reading","use-of-english"] as const){
  assert.ok(!s7.questionIds[section].some(id=>b.questionIds[section].includes(id)),section+" repeats for different junior profile");
 }
});
test("reordering four author options also reorders the correct answer, reducing answer-key bias",()=>{
 for(const grade of [7,8]){
  const mixed=fullBankForGrade(grade,"mixed"),counts=new Map<string,number>();
  const questions=generatedComplete78.flatMap(set=>[...set.reading.items,...set.useOfEnglish.items]);
  assert.equal(questions.length,100);
  for(const old of questions){
   const updated=mixed.objective.find(q=>q.id===old.id);
   assert.ok(updated,"missing "+old.id);
   const prev=old.acceptedAnswers[0].toLowerCase(),next=updated.acceptedAnswers[0].toLowerCase();
   const oldChoice=old.options[prev.charCodeAt(0)-97],newChoice=updated.options[next.charCodeAt(0)-97];
   assert.equal(newChoice.slice(2),oldChoice.slice(2),"key incorrect after reorder: "+old.id);
   counts.set(next,(counts.get(next)||0)+1);
  }
  for(const key of ["a","b","c","d"])assert.ok((counts.get(key)||0)>=15,"Answer bias in Grade "+grade+" at "+key);
 }
});


test("Mixed sections do not reissue seen questions from a partly new text group",()=>{
 const make=(id:string,groupId:string,text:string):FullQuestion=>({
  id,groupId,section:"reading",text,passage:"One common story",acceptedAnswers:["a"],options:["A True","B False"],needsReview:false
 } as FullQuestion);
 const a=make("a","passage","Question A"),b=make("b","passage","Question B"),c=make("c","second","Question C");
 const history={a:{seen:1,incorrect:0}};
 const selected=selectFullQuestions([a,b,c],"reading",history,[],10,()=>0.5,{},true);
 assert.deepEqual(new Set(selected.map(q=>q.id)),new Set(["b","c"]),"Reusing an old question merely because the passage still has unused questions");
 assert.ok(selected.every(q=>q.passage==="One common story"),"The shared reading context must remain accessible");
 const officialLegacy=selectFullQuestions([a,b,c],"reading",history,[],10,()=>0.5);
 assert.ok(officialLegacy.some(q=>q.id==="a"),"Do not silently change the historic official entire-passage selection");
});

for(const grade of [7,8]){
 test("Grade "+grade+" long repeat practice uses all genuinely unseen text before recycling",()=>{
   const store=storage(),profile=makeProfile(grade),bank=fullBankForGrade(grade,"mixed"),seen=new Set<string>();
   for(let attempt=0;attempt<12;attempt++){
     const round=beginFullTraining(store,grade,"mixed",profile,()=>0.5);
     const questions=resolveSessionQuestions(round);
     for(const section of ["reading","use-of-english"] as const){
       const eligible=bank.objective.filter(q=>q.section===section&&!q.needsReview&&q.acceptedAnswers.length);
       const unique=new Set(eligible.map(fingerprint));
       const hadUnused=[...unique].some(q=>!seen.has(q));
       const current=questions.filter(q=>q.section===section);
       if(hadUnused){
         assert.ok(current.length>0,"Empty "+section+" even though unused tasks remain");
         for(const q of current)assert.equal(seen.has(fingerprint(q)),false,
           "Grade "+grade+" attempt "+(attempt+1)+": repeated "+section+" "+q.id+" before personal bank exhausted");
       }
       for(const q of current)seen.add(fingerprint(q));
     }
   }
 });
}
