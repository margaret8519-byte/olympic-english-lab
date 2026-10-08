import test from 'node:test';
import assert from 'node:assert/strict';
import {beginFullTraining,recordFullIssue,fullProfileKey,fullProfileIssuedKey,fullProfileHistoryKey,fullProfileLastIdsKey,preserveFullProfileSession,FULL_ISSUED_KEY} from '../lib/full-training-storage.ts';
import {createFullSession,FULL_ACTIVE_KEY,FULL_HISTORY_KEY,selectFullQuestions,resolveSessionQuestions,fullBankForGrade,type FullQuestion} from '../lib/full-olympiad.ts';

function storage(){const map=new Map<string,string>();return{getItem:(k:string)=>map.get(k)??null,setItem:(k:string,v:string)=>{map.set(k,v)},removeItem:(k:string)=>{map.delete(k)}}}
const anna={firstName:'Анна',lastName:'Иванова',grade:'10',classLetter:'А'};
const boris={...anna,firstName:'Борис'};
const jane={firstName:' ДЖЕЙН ',lastName:'СМИТ',grade:'9',classLetter:'Б'};

test('pupils sharing a browser get independent new-question queues',()=>{
 const store=storage();
 const firstAnna=beginFullTraining(store,10,'official',anna,()=>0.5);
 const secondAnna=beginFullTraining(store,10,'official',anna,()=>0.5);
 const firstBoris=beginFullTraining(store,10,'official',boris,()=>0.5);
 assert.notEqual(firstAnna.listeningGroupId,secondAnna.listeningGroupId);
 assert.notEqual(firstAnna.writingTaskId,secondAnna.writingTaskId);
 for(const section of ['reading','use-of-english'] as const){
   assert.ok(firstAnna.questionIds[section].length>0);
   assert.equal(firstAnna.questionIds[section].some(id=>secondAnna.questionIds[section].includes(id)),false);
   assert.deepEqual(firstBoris.questionIds[section],firstAnna.questionIds[section]);
 }
 assert.equal(firstBoris.listeningGroupId,firstAnna.listeningGroupId);
 assert.equal(firstBoris.writingTaskId,firstAnna.writingTaskId);
 assert.equal(store.getItem(FULL_ISSUED_KEY),null);
 assert.equal(store.getItem(FULL_HISTORY_KEY),null);
 assert.notEqual(fullProfileIssuedKey(anna),fullProfileIssuedKey(boris));
 assert.ok(store.getItem(fullProfileLastIdsKey(anna)));
 assert.ok(store.getItem(fullProfileLastIdsKey(boris)));
});

test('unfinished sessions keep answers and issue is recorded at most once for a pupil',()=>{
 const store=storage(),round=beginFullTraining(store,10,'official',anna);
 round.answers[round.questionIds.listening[0]]='a';
 const before=store.getItem(fullProfileIssuedKey(anna));
 recordFullIssue(store,round,anna);
 assert.equal(store.getItem(fullProfileIssuedKey(anna)),before);
 store.setItem(fullProfileKey(anna),JSON.stringify(round));
 assert.deepEqual(JSON.parse(store.getItem(fullProfileKey(anna))!).answers,round.answers);
 assert.equal(store.getItem(fullProfileKey(boris)),null);
 assert.equal(store.getItem(fullProfileIssuedKey(boris)),null);
});

test('switching profiles migrates a legacy active session only to its original owner',()=>{
 const store=storage(),round=createFullSession(10);
 store.setItem('studentProfile',JSON.stringify(anna));
 store.setItem(FULL_ACTIVE_KEY,JSON.stringify(round));
 preserveFullProfileSession(store);
 store.setItem('studentProfile',JSON.stringify(boris));
 assert.equal(store.getItem(FULL_ACTIVE_KEY),null);
 assert.equal(JSON.parse(store.getItem(fullProfileKey(anna))!).id,round.id);
 assert.equal(store.getItem(fullProfileKey(boris)),null);
 assert.ok(store.getItem(fullProfileIssuedKey(anna)));
 assert.equal(store.getItem(fullProfileIssuedKey(boris)),null);
 assert.equal(beginFullTraining(store,10,'official',anna).listeningGroupId===round.listeningGroupId,false);
});

test('errors recorded for one pupil do not influence another pupil',()=>{
 const store=storage();
 store.setItem(fullProfileHistoryKey(anna),JSON.stringify({'test-question':{seen:2,incorrect:2}}));
 assert.equal(store.getItem(fullProfileHistoryKey(boris)),null);
 assert.notEqual(fullProfileHistoryKey(anna),fullProfileHistoryKey(boris));
 assert.equal(fullProfileKey(jane),fullProfileKey({firstName:'джейн',lastName:'смит',grade:'9',classLetter:'б'}));
});

test('reading groups are kept whole, and seen questions never pad a partly fresh round',()=>{
 const q=(id:string,groupId:string)=>({id,groupId,section:'reading',acceptedAnswers:['a'],needsReview:false,options:['A yes']} as FullQuestion);
 const bank=[q('a1','a'),q('a2','a'),q('b1','b'),q('b2','b'),q('c1','c')];
 const history={a1:{seen:1,incorrect:0},a2:{seen:1,incorrect:0},b1:{seen:1,incorrect:0},b2:{seen:1,incorrect:0}};
 const fresh=selectFullQuestions(bank,'reading',history,[],10,()=>0.5);
 assert.deepEqual(fresh.map(item=>item.id),['c1']);
 const after=selectFullQuestions(bank,'reading',{...history,c1:{seen:1,incorrect:0}},[],10,()=>0.5);
 assert.deepEqual(new Set(after.map(item=>item.id)),new Set(bank.map(item=>item.id)));
});

test('every supported grade uses all unseen official tasks before reissuing them',()=>{
 for(const grade of [7,8,9,10,11]){
   const profile={...anna,grade:String(grade)},store=storage(),bank=fullBankForGrade(grade);
   for(const section of ['reading','use-of-english'] as const){
     const all=new Set(bank.objective.filter(q=>q.source==='official-vsosh-vzlet'&&q.section===section&&!q.needsReview&&q.acceptedAnswers.length).map(q=>q.id));
     if(!all.size)continue;
     const seen=new Set<string>();
     for(let turn=0;seen.size<all.size&&turn<100;turn++){
       const round=beginFullTraining(store,grade,'official',profile,()=>0.5);
       for(const id of round.questionIds[section]){
         assert.ok(all.has(id),`Grade ${grade}: unexpected ${section} ${id}`);
         assert.equal(seen.has(id),false,`Grade ${grade}: repeated ${section} ${id} while unseen remain`);
         seen.add(id);
       }
     }
     // The bank may contain duplicate group identifiers but every eligible question must be covered.
     assert.equal(seen.size,all.size,`Grade ${grade}: incomplete ${section} coverage`);
   }
 }
});

test('listening and writing choose new groups and topics before repeating',()=>{
 for(const grade of [7,8,9,10,11]){
   const profile={...anna,grade:String(grade)},store=storage(),bank=fullBankForGrade(grade);
   const listening=new Set(bank.listeningGroups.map(group=>group.id));
   const writing=new Set(bank.writings.filter(q=>q.source==='official-vsosh-vzlet').map(q=>q.id));
   const heard=new Set<string>(),written=new Set<string>();
   for(let turn=0;turn<Math.max(listening.size,writing.size)&&turn<100;turn++){
     const round=beginFullTraining(store,grade,'official',profile,()=>0.5);
     if(heard.size<listening.size&&round.listeningGroupId){
       assert.equal(heard.has(round.listeningGroupId),false,`Grade ${grade}: early listening repeat`);
       heard.add(round.listeningGroupId);
     }
     if(written.size<writing.size&&round.writingTaskId){
       assert.equal(written.has(round.writingTaskId),false,`Grade ${grade}: early writing repeat`);
       written.add(round.writingTaskId);
     }
   }
   assert.equal(heard.size,listening.size,`Grade ${grade}: unheard audio remains`);
   assert.equal(written.size,writing.size,`Grade ${grade}: unseen writing remains`);
 }
});

test('generated practice selects unused complete sets before cycling',()=>{
 const store=storage(),seen=new Set<string>();
 for(let i=0;i<5;i++){
   const round=beginFullTraining(store,10,'generated',anna,()=>0.5);
   const id=round.listeningGroupId;
   assert.ok(id);
   assert.equal(seen.has(id),false);
   seen.add(id!);
 }
 const again=beginFullTraining(store,10,'generated',anna,()=>0.5);
 assert.ok(seen.has(again.listeningGroupId!));
});

test('grade 10 still includes verified 2022 and 2023 reading and grammar, with whole text blocks',()=>{
 const bank=fullBankForGrade(10).objective;
 for(const year of [2022,2023])for(const section of ['reading','use-of-english'])
   assert.ok(bank.some(q=>q.year===year&&q.section===section&&!q.needsReview));
 const round=beginFullTraining(storage(),10,'official',anna);
 for(const section of ['reading','use-of-english'] as const)for(const id of round.questionIds[section]){
   const q=bank.find(q=>q.id===id)!;
   if(q.groupId)assert.ok(bank.filter(other=>other.groupId===q.groupId).every(other=>round.questionIds[section].includes(other.id)));
 }
 const questions=resolveSessionQuestions(round);
 assert.equal(questions.length,Object.values(round.questionIds).flat().length);
});
