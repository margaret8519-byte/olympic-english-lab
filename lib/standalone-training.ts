import type{QuestionBankItem,QuestionSet,Section}from"../data/questions/types.ts";
import{isQuestionAllowedForGrade}from"./training-grade.ts";

export type StandaloneHistory=Record<string,{seen:number;incorrect:number}>;
export type StandaloneSession={version:1;id:string;studentId:string;grade:number;section:Section;questionIds:string[];listeningGroupId?:string;startedAt:string;status:"active"|"completed"};
export type ListeningGroup={id:string;grade:number;audioSrc?:string;script?:string;audioMode?:"speech"|"file";source:QuestionBankItem["source"];year:QuestionBankItem["year"];title:string;instruction:string;questions:QuestionBankItem[]};

export function isResumableStandaloneSession(session:StandaloneSession|null|undefined,grade:number,section:Section):session is StandaloneSession{return session?.status==="active"&&session.grade===grade&&session.section===section}

export const standaloneActiveKey=(grade:number,section:Section)=>`olympic-standalone-active-v1-${grade}-${section}`;
export const standaloneHistoryKey=(grade:number,section:Section)=>`olympic-standalone-history-v1-${grade}-${section}`;
export const standaloneLastKey=(grade:number,section:Section)=>`olympic-standalone-last-v1-${grade}-${section}`;

const unitId=(question:QuestionBankItem)=>question.groupId||(question.section==="listening"?`${question.source}-${question.year}-audio`:question.id);
const usable=(question:QuestionBankItem)=>question.acceptedAnswers.length>0&&!question.needsReview;

export function selectableQuestions(sets:QuestionSet[],section:Section){const seen=new Set<string>();return sets.flatMap(set=>set.items).filter(question=>{if(question.section!==section||!usable(question)||seen.has(question.id))return false;seen.add(question.id);return true})}

export function listeningGroupsFromSets(sets:QuestionSet[],grade:number):ListeningGroup[]{return sets.flatMap(set=>{const questions=set.items.filter(question=>question.section==="listening"&&isQuestionAllowedForGrade(question,grade)&&usable(question));if(!questions.length||questions.length!==set.items.length||(!set.audioSrc&&!set.script))return[];const first=questions[0];return[{id:set.id,grade,audioSrc:set.audioSrc,script:set.script,audioMode:set.audioMode,source:first.source,year:first.year,title:set.title,instruction:set.instruction,questions}]})}

export function selectListeningGroup(groups:ListeningGroup[],history:StandaloneHistory={},lastGroupId:string|undefined,random=Math.random){return[...groups].map(group=>{const records=group.questions.map(question=>history[question.id]),unseen=records.some(record=>!record),incorrect=records.some(record=>(record?.incorrect||0)>0);return{group,priority:(unseen?0:incorrect?1:2)+(group.id===lastGroupId?3:0),tie:random()}}).sort((a,b)=>a.priority-b.priority||a.tie-b.tie)[0]?.group}

export function seededRandom(seed:string){let value=2166136261;for(const char of seed)value=Math.imul(value^char.charCodeAt(0),16777619);return()=>{value+=0x6d2b79f5;let next=value;next=Math.imul(next^next>>>15,next|1);next^=next+Math.imul(next^next>>>7,next|61);return((next^next>>>14)>>>0)/4294967296}}
const shuffled=<T,>(items:T[],random:()=>number)=>{const copy=[...items];for(let index=copy.length-1;index>0;index--){const swap=Math.floor(random()*(index+1));[copy[index],copy[swap]]=[copy[swap],copy[index]]}return copy};

export function selectStandaloneQuestions(bank:QuestionBankItem[],history:StandaloneHistory={},lastIds:string[]=[],target=10,random=Math.random){
 const groups=new Map<string,QuestionBankItem[]>();for(const question of bank){const id=unitId(question);groups.set(id,[...(groups.get(id)||[]),question])}
 const last=new Set(lastIds),pools:[{id:string;items:QuestionBankItem[]}[],{id:string;items:QuestionBankItem[]}[],{id:string;items:QuestionBankItem[]}[],{id:string;items:QuestionBankItem[]}[]]=[[],[],[],[]];for(const[id,items]of groups){const records=items.map(item=>history[item.id]),inLast=items.some(item=>last.has(item.id)),unseen=records.every(record=>!record),incorrect=records.some(record=>(record?.incorrect||0)>0),pool=inLast?3:unseen?0:incorrect?1:2;pools[pool].push({id,items})}const ranked=pools.flatMap(pool=>shuffled(pool,random));
 const selected:QuestionBankItem[]=[];for(const group of ranked){if(selected.length&&selected.length+group.items.length>target)continue;selected.push(...group.items);if(selected.length>=target)break}if(!selected.length&&ranked[0])selected.push(...ranked[0].items);return selected;
}

export function createStandaloneSession(studentId:string,grade:number,section:Section,bank:QuestionBankItem[],history:StandaloneHistory={},lastIds:string[]=[],random?:()=>number,now=new Date().toISOString()){const id=globalThis.crypto?.randomUUID?.()||`standalone-${Date.now()}`,questions=selectStandaloneQuestions(bank,history,lastIds,10,random||seededRandom(id));return{session:{version:1,id,studentId,grade,section,questionIds:questions.map(question=>question.id),startedAt:now,status:"active"}as StandaloneSession,questions}}
export function createStandaloneListeningSession(studentId:string,grade:number,groups:ListeningGroup[],history:StandaloneHistory={},lastGroupId?:string,random?:()=>number,now=new Date().toISOString()){const id=globalThis.crypto?.randomUUID?.()||`standalone-${Date.now()}`,group=selectListeningGroup(groups,history,lastGroupId,random||seededRandom(id));if(!group)return null;return{session:{version:1,id,studentId,grade,section:"listening",questionIds:group.questions.map(question=>question.id),listeningGroupId:group.id,startedAt:now,status:"active"}as StandaloneSession,group,questions:group.questions}}
export function resolveStandaloneQuestions(session:StandaloneSession,bank:QuestionBankItem[]){const map=new Map(bank.map(question=>[question.id,question]));return session.questionIds.map(id=>map.get(id)).filter(Boolean)as QuestionBankItem[]}
export function resolveStandaloneListeningGroup(session:StandaloneSession,groups:ListeningGroup[]){const group=groups.find(candidate=>candidate.id===session.listeningGroupId);return group&&session.questionIds.length===group.questions.length&&session.questionIds.every((id,index)=>id===group.questions[index].id)?group:null}
export function completeStandaloneHistory(history:StandaloneHistory,questions:QuestionBankItem[],answers:Record<string,string>){const next={...history};for(const question of questions){const old=next[question.id]||{seen:0,incorrect:0},answer=(answers[question.id]||"").trim().toLowerCase(),correct=question.acceptedAnswers.includes(answer);next[question.id]={seen:old.seen+1,incorrect:old.incorrect+(correct?0:1)}}return next}
