import type {QuestionBankItem,QuestionSet,Section} from "../data/questions/types.ts";
import type {AdaptiveQuestion} from "../data/questions/grade-7-8/original/types.ts";
import {originalQuestionBank} from "../data/questions/grade-7-8/original/index.ts";
import {grade782022Sets} from "../data/questions/grade-7-8/2022/index.ts";
import {grade9OriginalQuestionBank} from "../data/questions/grade-9/original/index.ts";
import {grade9Official2024} from "../data/questions/grade-9/official/2024/index.ts";
import {grade9Writing2022} from "../data/questions/grade-9/official/2022/index.ts";
import {grade9Writing2023} from "../data/questions/grade-9/official/2023/index.ts";
import {grade10WritingSets,grade11WritingSets,objectiveBankForSeniorGrade} from "../data/questions/grade-10-11/index.ts";
import {originalWritingSets} from "../data/questions/writing-original.ts";
import {listeningGroupsFromSets,seededRandom,selectListeningGroup,type ListeningGroup} from "./standalone-training.ts";
import {validatedListeningGroupsForGrade} from "./listening-registry.ts";

export const FULL_SECTION_ORDER=["listening","reading","use-of-english","writing"] as const;
export type FullSection=typeof FULL_SECTION_ORDER[number];
export type FullQuestion=QuestionBankItem&{options:string[]};
export type FullHistory=Record<string,{seen:number;incorrect:number}>;
export type FullSession={version:1;id:string;grade:number;startedAt:string;sectionIndex:number;questionIds:Record<Exclude<FullSection,"writing">,string[]>;listeningGroupId:string;writingTaskId?:string;answers:Record<string,string>;writingText:string;completedAt?:string;writingStatus?:"pending"|"reviewed";writingReview?:{score:number;maxScore:number;comment?:string|null}};
export const FULL_ACTIVE_KEY="olympic-full-olympiad-active-v1";
export const FULL_HISTORY_KEY="olympic-full-olympiad-history-v1";
export const FULL_LAST_IDS_KEY="olympic-full-olympiad-last-ids-v1";

const normalizeAdaptive=(q:AdaptiveQuestion,grade:number):FullQuestion=>({
  ...q,grade:grade===9?9:"7-8",year:(q.year||2024) as 2022|2023|2024,stage:"municipal",source:q.source as QuestionBankItem["source"],sourceLabel:"OLYMPIC ENGLISH LAB",platformLabel:"Взлёт",options:q.options.map(o=>`${o.id.toUpperCase()} ${o.label}`),needsReview:!!q.needsReview,
} as FullQuestion);
const keyed=(items:readonly QuestionBankItem[])=>items.filter(q=>!q.needsReview&&q.acceptedAnswers.length);

export function fullBankForGrade(grade:number){
  const objective:FullQuestion[]=grade===10||grade===11
    ? objectiveBankForSeniorGrade(grade).map(q=>({...q,groupId:q.section==="listening"&&!q.groupId?`g${grade}-2024-listening-audio`:q.groupId}) as FullQuestion)
    : grade===9
    ? [...grade9OriginalQuestionBank.map(q=>normalizeAdaptive(q,9)),...FULL_SECTION_ORDER.slice(0,3).flatMap(section=>keyed(grade9Official2024[section].items).map(q=>({...q,groupId:section==="listening"&&!q.groupId?grade9Official2024.listening.id:q.groupId})))]
    : [...originalQuestionBank.map(q=>normalizeAdaptive(q,grade)),...FULL_SECTION_ORDER.slice(0,3).flatMap(section=>keyed(grade782022Sets[section].items).map(q=>({...q,groupId:section==="listening"&&!q.groupId?grade782022Sets.listening.id:q.groupId})))];
  const writingSets=grade===10?[...grade10WritingSets,...originalWritingSets(10)]:grade===11?[...grade11WritingSets,...originalWritingSets(11)]:grade===9?[grade9Writing2022,grade9Writing2023,grade9Official2024.writing,...originalWritingSets(9)]:[grade782022Sets.writing];
  const writings=writingSets.flatMap(set=>set.items) as FullQuestion[];
  const listeningGroups=grade>=9?validatedListeningGroupsForGrade(grade):listeningGroupsFromSets([grade782022Sets.listening],grade);
  return{objective:objective.filter(question=>question.section!=="listening"),listeningGroups,writing:writings[0],writings};
}

type Unit={id:string;items:FullQuestion[];priority:number;tie:number};
export function selectFullQuestions(bank:FullQuestion[],section:Exclude<FullSection,"writing">,history:FullHistory={},lastIds:string[]=[],target=10,random=Math.random){
  const candidates=bank.filter(q=>q.section===section&&!q.needsReview&&q.acceptedAnswers.length);
  const groups=new Map<string,FullQuestion[]>();
  candidates.forEach(q=>{const id=q.groupId||q.id;groups.set(id,[...(groups.get(id)||[]),q])});
  const last=new Set(lastIds),units:Unit[]=[...groups].map(([id,items])=>{const records=items.map(q=>history[q.id]);const unseen=records.some(record=>!record);const wrong=records.some(record=>record?.incorrect>0);const exactRepeat=items.every(q=>last.has(q.id));return{id,items,priority:(unseen?0:wrong?1:2)+(exactRepeat?3:0),tie:random()}}).sort((a,b)=>a.priority-b.priority||a.tie-b.tie);
  const selected:FullQuestion[]=[];for(const unit of units){selected.push(...unit.items);if(selected.length>=target)break}return selected;
}

export function createFullSession(grade:number,history:FullHistory={},lastIds:string[]=[],random?:()=>number,now=new Date().toISOString()):FullSession{
  const id=globalThis.crypto?.randomUUID?.()||`full-${Date.now()}`,rng=random||seededRandom(id),{objective,listeningGroups,writings}=fullBankForGrade(grade),ids={} as FullSession["questionIds"],lastListeningGroupId=lastIds.find(value=>listeningGroups.some(group=>group.id===value)),listeningGroup=selectListeningGroup(listeningGroups,history,lastListeningGroupId,rng);
  if(!listeningGroup)throw new Error(`No validated ListeningGroup for grade ${grade}`);ids.listening=listeningGroup.questions.map(question=>question.id);
  for(const section of ["reading","use-of-english"] as const)ids[section]=selectFullQuestions(objective,section,history,lastIds,10,rng).map(q=>q.id);
  const last=new Set(lastIds),writing=[...writings].sort((a,b)=>{const ar=history[a.id],br=history[b.id],ap=(!ar?0:ar.incorrect?1:2)+(last.has(a.id)?3:0),bp=(!br?0:br.incorrect?1:2)+(last.has(b.id)?3:0);return ap-bp||rng()-.5})[0];
  return{version:1,id,grade,startedAt:now,sectionIndex:0,questionIds:ids,listeningGroupId:listeningGroup.id,writingTaskId:writing?.id,answers:{},writingText:""};
}

export function resolveSessionWriting(session:FullSession){const bank=fullBankForGrade(session.grade);return bank.writings.find(task=>task.id===session.writingTaskId)||bank.writing}

export function updateFullHistory(history:FullHistory,questions:FullQuestion[],answers:Record<string,string>,isCorrect:(q:FullQuestion,a:string)=>boolean){const next={...history};for(const q of questions){const old=next[q.id]||{seen:0,incorrect:0},correct=isCorrect(q,answers[q.id]||"");next[q.id]={seen:old.seen+1,incorrect:old.incorrect+(correct?0:1)}}return next}
export function resolveFullListeningGroup(session:FullSession):ListeningGroup|null{const group=fullBankForGrade(session.grade).listeningGroups.find(candidate=>candidate.id===session.listeningGroupId);return group&&session.questionIds.listening.length===group.questions.length&&session.questionIds.listening.every((id,index)=>id===group.questions[index].id)?group:null}
export function isResumableFullSession(session:FullSession|null|undefined,grade:number):session is FullSession{return!!session&&session.grade===grade&&!session.completedAt&&!!resolveFullListeningGroup(session)}
export function resolveSessionQuestions(session:FullSession){const bank=fullBankForGrade(session.grade),map=new Map([...bank.objective,...bank.listeningGroups.flatMap(group=>group.questions)].map(q=>[q.id,q]));return FULL_SECTION_ORDER.slice(0,3).flatMap(section=>session.questionIds[section as keyof FullSession["questionIds"]].map(id=>map.get(id)).filter(Boolean)) as FullQuestion[]}
export function isSupportedFullGrade(grade:number){return[7,8,9,10,11].includes(grade)}
export type {Section,QuestionSet};
