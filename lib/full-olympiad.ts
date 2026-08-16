import type {QuestionBankItem,QuestionSet,Section} from "../data/questions/types.ts";
import type {AdaptiveQuestion} from "../data/questions/grade-7-8/original/types.ts";
import {originalQuestionBank} from "../data/questions/grade-7-8/original/index.ts";
import {grade782022Sets} from "../data/questions/grade-7-8/2022/index.ts";
import {grade9OriginalQuestionBank} from "../data/questions/grade-9/original/index.ts";
import {grade9Official2024} from "../data/questions/grade-9/official/2024/index.ts";
import {grade10Registry,grade11Registry,objectiveBankForSeniorGrade} from "../data/questions/grade-10-11/index.ts";

export const FULL_SECTION_ORDER=["listening","reading","use-of-english","writing"] as const;
export type FullSection=typeof FULL_SECTION_ORDER[number];
export type FullQuestion=QuestionBankItem&{options:string[]};
export type FullHistory=Record<string,{seen:number;incorrect:number}>;
export type FullSession={version:1;id:string;grade:number;startedAt:string;sectionIndex:number;questionIds:Record<Exclude<FullSection,"writing">,string[]>;answers:Record<string,string>;writingText:string;completedAt?:string;writingStatus?:"pending"|"reviewed";writingReview?:{score:number;maxScore:number;comment?:string|null}};
export const FULL_ACTIVE_KEY="olympic-full-olympiad-active-v1";
export const FULL_HISTORY_KEY="olympic-full-olympiad-history-v1";
export const FULL_LAST_IDS_KEY="olympic-full-olympiad-last-ids-v1";

const normalizeAdaptive=(q:AdaptiveQuestion,grade:number):FullQuestion=>({
  ...q,grade:grade===9?9:"7-8",year:(q.year||2024) as 2022|2023|2024,stage:"municipal",source:q.source as QuestionBankItem["source"],sourceLabel:"OLYMPIC ENGLISH LAB",platformLabel:"Взлёт",options:q.options.map(o=>`${o.id.toUpperCase()} ${o.label}`),needsReview:!!q.needsReview,
} as FullQuestion);
const keyed=(items:readonly QuestionBankItem[])=>items.filter(q=>!q.needsReview&&q.acceptedAnswers.length);

export function fullBankForGrade(grade:number){
  const objective:FullQuestion[]=grade===10||grade===11
    ? objectiveBankForSeniorGrade(grade).map(q=>({...q}) as FullQuestion)
    : grade===9
    ? [...grade9OriginalQuestionBank.map(q=>normalizeAdaptive(q,9)),...FULL_SECTION_ORDER.slice(0,3).flatMap(section=>keyed(grade9Official2024[section].items))]
    : [...originalQuestionBank.map(q=>normalizeAdaptive(q,grade)),...FULL_SECTION_ORDER.slice(0,3).flatMap(section=>keyed(grade782022Sets[section].items))];
  const writing=(grade===10?grade10Registry[2024].writing:grade===11?grade11Registry[2024].writing:grade===9?grade9Official2024.writing:grade782022Sets.writing).items[0] as FullQuestion;
  return{objective,writing};
}

type Unit={id:string;items:FullQuestion[];priority:number;tie:number};
export function selectFullQuestions(bank:FullQuestion[],section:Exclude<FullSection,"writing">,history:FullHistory={},lastIds:string[]=[],target=10,random=Math.random){
  const candidates=bank.filter(q=>q.section===section&&!q.needsReview&&q.acceptedAnswers.length);
  const groups=new Map<string,FullQuestion[]>();
  candidates.forEach(q=>{const id=q.groupId||q.id;groups.set(id,[...(groups.get(id)||[]),q])});
  const last=new Set(lastIds),units:Unit[]=[...groups].map(([id,items])=>{const records=items.map(q=>history[q.id]);const unseen=records.some(record=>!record);const wrong=records.some(record=>record?.incorrect>0);const exactRepeat=items.every(q=>last.has(q.id));return{id,items,priority:(unseen?0:wrong?1:2)+(exactRepeat?3:0),tie:random()}}).sort((a,b)=>a.priority-b.priority||a.tie-b.tie);
  const selected:FullQuestion[]=[];for(const unit of units){selected.push(...unit.items);if(selected.length>=target)break}return selected;
}

export function createFullSession(grade:number,history:FullHistory={},lastIds:string[]=[],random=Math.random,now=new Date().toISOString()):FullSession{
  const{objective}=fullBankForGrade(grade),ids={} as FullSession["questionIds"];
  for(const section of FULL_SECTION_ORDER.slice(0,3) as Exclude<FullSection,"writing">[])ids[section]=selectFullQuestions(objective,section,history,lastIds,10,random).map(q=>q.id);
  return{version:1,id:globalThis.crypto?.randomUUID?.()||`full-${Date.now()}`,grade,startedAt:now,sectionIndex:0,questionIds:ids,answers:{},writingText:""};
}

export function updateFullHistory(history:FullHistory,questions:FullQuestion[],answers:Record<string,string>,isCorrect:(q:FullQuestion,a:string)=>boolean){const next={...history};for(const q of questions){const old=next[q.id]||{seen:0,incorrect:0},correct=isCorrect(q,answers[q.id]||"");next[q.id]={seen:old.seen+1,incorrect:old.incorrect+(correct?0:1)}}return next}
export function resolveSessionQuestions(session:FullSession){const bank=fullBankForGrade(session.grade).objective,map=new Map(bank.map(q=>[q.id,q]));return FULL_SECTION_ORDER.slice(0,3).flatMap(section=>session.questionIds[section as keyof FullSession["questionIds"]].map(id=>map.get(id)).filter(Boolean)) as FullQuestion[]}
export function isSupportedFullGrade(grade:number){return[7,8,9,10,11].includes(grade)}
export type {Section,QuestionSet};
