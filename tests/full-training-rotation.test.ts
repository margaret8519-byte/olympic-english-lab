import test from 'node:test';
import assert from 'node:assert/strict';
import {beginFullTraining,recordFullIssue,fullProfileKey,preserveFullProfileSession,FULL_ISSUED_KEY} from '../lib/full-training-storage.ts';
import {createFullSession,FULL_ACTIVE_KEY,FULL_HISTORY_KEY,resolveSessionQuestions,fullBankForGrade} from '../lib/full-olympiad.ts';
function storage(){const map=new Map<string,string>();return{getItem:(k:string)=>map.get(k)??null,setItem:(k:string,v:string)=>{map.set(k,v)},removeItem:(k:string)=>{map.delete(k)}}}
const anna={firstName:'Анна',lastName:'Иванова',grade:'10',classLetter:'А'},boris={...anna,firstName:'Борис'};
test('unfinished rounds rotate all sections across pupils without recording scores',()=>{
 const store=storage();const rounds=Array.from({length:8},()=>beginFullTraining(store,10,'official',()=>0.5));
 for(let i=1;i<rounds.length;i++){
  assert.notEqual(rounds[i].listeningGroupId,rounds[i-1].listeningGroupId);
  assert.notEqual(rounds[i].writingTaskId,rounds[i-1].writingTaskId);
  for(const section of ['reading','use-of-english'] as const)assert.equal(rounds[i].questionIds[section].some(id=>rounds[i-1].questionIds[section].includes(id)),false);
 }
 assert.equal(new Set(rounds.slice(0,4).map(round=>round.writingTaskId)).size,4);
 assert.equal(store.getItem(FULL_HISTORY_KEY),null);
 for(const round of rounds){const questions=resolveSessionQuestions(round);assert.equal(questions.length,Object.values(round.questionIds).flat().length);assert.ok(questions.every(q=>q.source==='official-vsosh-vzlet'&&!q.needsReview));}
});
test('resume preserves answers and records an issued round only once',()=>{const store=storage(),round=beginFullTraining(store,10,'official');round.answers[round.questionIds.listening[0]]='a';const before=store.getItem(FULL_ISSUED_KEY);recordFullIssue(store,round);assert.equal(store.getItem(FULL_ISSUED_KEY),before);store.setItem(fullProfileKey(anna),JSON.stringify(round));assert.deepEqual(JSON.parse(store.getItem(fullProfileKey(anna))!).answers,round.answers);assert.equal(store.getItem(fullProfileKey(boris)),null)});
test('switching profile migrates a legacy round to its original pupil',()=>{const store=storage(),round=createFullSession(10);store.setItem('studentProfile',JSON.stringify(anna));store.setItem(FULL_ACTIVE_KEY,JSON.stringify(round));preserveFullProfileSession(store);store.setItem('studentProfile',JSON.stringify(boris));assert.equal(store.getItem(FULL_ACTIVE_KEY),null);assert.equal(JSON.parse(store.getItem(fullProfileKey(anna))!).id,round.id);assert.equal(store.getItem(fullProfileKey(boris)),null);assert.notEqual(beginFullTraining(store,10,'official').listeningGroupId,round.listeningGroupId)});
test('grade 10 includes verified 2022 and 2023 reading and grammar and keeps whole blocks',()=>{const bank=fullBankForGrade(10).objective;for(const year of [2022,2023])for(const section of ['reading','use-of-english'])assert.ok(bank.some(q=>q.year===year&&q.section===section&&!q.needsReview));const round=beginFullTraining(storage(),10,'official');for(const section of ['reading','use-of-english'] as const)for(const id of round.questionIds[section]){const q=bank.find(q=>q.id===id)!;if(q.groupId)assert.ok(bank.filter(other=>other.groupId===q.groupId).every(other=>round.questionIds[section].includes(other.id)))}});
