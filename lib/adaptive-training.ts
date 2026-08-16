import type {AdaptiveDifficulty,AdaptiveOption,AdaptiveQuestion} from "../data/questions/grade-7-8/original/index.ts";
export type TrainingMode="quick"|"olympiad"|"challenge"|"weak";
export type ConfirmationCandidate={subskill:string;accuracy:number;updatedAt?:string};
export type QuestionHistoryEntry={seen:number;attempts:number;correct:number;incorrect:number;lastAttempt:string;skill:string;subskill:string};
export type QuestionHistory=Record<string,QuestionHistoryEntry>;
export type TrainingAttempt={id:string;date:string;mode:TrainingMode;questionIds:string[];correct:number;incorrect:number;percentage:number;weakSkills:string[]};
export type AccuracyRow={name:string;attempts:number;correct:number;accuracy:number;status:"Нужно повторить"|"Стоит потренироваться"|"Хороший результат"|"Сильная сторона"};
export const RECENT_LIMIT=30;
const shuffle=<T,>(items:T[],random=Math.random)=>{const copy=[...items];for(let i=copy.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy};
export const normalizeSubskill=(value:string)=>value.trim().toLocaleLowerCase("en-US").replace(/[-_]+/g," ").replace(/\s+/g," ");
export type WeakSubskillRow={name:string;attempts:number;accuracy:number};
export function getWeakSubskills<T extends WeakSubskillRow>(rows:T[]):T[]{return rows.filter(row=>row.attempts>=3&&row.accuracy<70).sort((a,b)=>a.accuracy-b.accuracy||b.attempts-a.attempts||normalizeSubskill(a.name).localeCompare(normalizeSubskill(b.name),"en"))}
export function shuffleOptions(question:AdaptiveQuestion,random=Math.random):AdaptiveQuestion{return{...question,options:shuffle(question.options,random)}}
const units=(bank:AdaptiveQuestion[])=>{const keys=[...new Set(bank.map(q=>q.groupId||q.id))];return keys.map(key=>bank.filter(q=>(q.groupId||q.id)===key))};
const priority=(group:AdaptiveQuestion[],history:QuestionHistory,recent:Set<string>)=>{const rows=group.map(q=>history[q.id]);const unseen=rows.every(x=>!x);const wrong=rows.reduce((n,x)=>n+(x?.incorrect||0),0);const isRecent=group.some(q=>recent.has(q.id));return(unseen?1000:0)+(isRecent?-500:0)+wrong*20-Math.max(...rows.map(x=>x?.seen||0),0)};
const difficultyCount=(questions:AdaptiveQuestion[])=>questions.reduce((result,q)=>({...result,[q.difficulty]:result[q.difficulty]+1}),{easy:0,medium:0,hard:0});
function selectBalancedQuick(bank:AdaptiveQuestion[],count:number,history:QuestionHistory,recentIds:string[],random:()=>number,confirmationCandidates:ConfirmationCandidate[]){
 const target={easy:Math.round(count*.3),medium:Math.round(count*.5),hard:count-Math.round(count*.3)-Math.round(count*.5)},recent=new Set(recentIds),remaining=units(bank),selected:AdaptiveQuestion[]=[];
 const candidates=[...confirmationCandidates].filter(candidate=>candidate.accuracy<70).sort((a,b)=>a.accuracy-b.accuracy||new Date(b.updatedAt||0).getTime()-new Date(a.updatedAt||0).getTime()||random()-.5);
 let confirmationQuestions=0;
 for(const candidate of candidates){
  if(confirmationQuestions>=3)break;
  const choices=remaining.filter(group=>selected.length+group.length<=count&&group.some(question=>question.subskill===candidate.subskill)).sort((a,b)=>{const fresh=(group:AdaptiveQuestion[])=>group.some(question=>question.subskill===candidate.subskill&&!history[question.id]&&!recent.has(question.id))?1:0;return fresh(b)-fresh(a)||priority(b,history,recent)-priority(a,history,recent)||random()-.5});
  const choice=choices[0];if(!choice)continue;
  const matching=choice.filter(question=>question.subskill===candidate.subskill&&!selected.some(item=>item.id===question.id));
  const newMatches=matching.filter(question=>!history[question.id]&&!recent.has(question.id));
  if(!newMatches.length&&bank.some(question=>question.subskill===candidate.subskill&&!history[question.id]&&!recent.has(question.id)))continue;
  selected.push(...choice);remaining.splice(remaining.indexOf(choice),1);confirmationQuestions+=Math.min(newMatches.length||matching.length,3-confirmationQuestions);
  if(selected.length>=Math.ceil(count*.5))break;
 }
 while(selected.length<count){const current=difficultyCount(selected),ranked=remaining.filter(group=>selected.length+group.length<=count).map(group=>{const mix=difficultyCount(group);const fit=(["easy","medium","hard"] as AdaptiveDifficulty[]).reduce((sum,key)=>sum+Math.min(Math.max(target[key]-current[key],0),mix[key])*120-Math.max(current[key]+mix[key]-target[key],0)*80,0);return{group,score:priority(group,history,recent)+fit/group.length+random()}}).sort((a,b)=>b.score-a.score);const next=ranked[0];if(!next)break;selected.push(...next.group);remaining.splice(remaining.indexOf(next.group),1)}
 return selected.map(q=>shuffleOptions(q,random))
}
function selectWeakSession(bank:AdaptiveQuestion[],count:number,history:QuestionHistory,recentIds:string[],primaryWeakSubskill:string,random:()=>number){
 const normalizedPrimary=normalizeSubskill(primaryWeakSubskill),recent=new Set(recentIds);
 const weakPool=bank.filter(question=>normalizeSubskill(question.subskill)===normalizedPrimary);
 const rankQuestions=(questions:AdaptiveQuestion[])=>questions.map(question=>({question,score:(!history[question.id]?1000:0)+(recent.has(question.id)?-500:0)+(history[question.id]?.incorrect||0)*20-(history[question.id]?.seen||0)+random()})).sort((a,b)=>b.score-a.score).map(row=>row.question);
 const targetWeak=Math.min(Math.ceil(count*.8),weakPool.length),selected=rankQuestions(weakPool).slice(0,targetWeak);
 const selectedIds=new Set(selected.map(question=>question.id));
 const relatedPool=bank.filter(question=>normalizeSubskill(question.subskill)!==normalizedPrimary&&!selectedIds.has(question.id));
 selected.push(...rankQuestions(relatedPool).slice(0,count-selected.length));
 if(process.env.NODE_ENV==="development"){
  console.log("[Adaptive] primary weak:",primaryWeakSubskill);
  console.log("[Adaptive] weak pool size:",weakPool.length);
  console.log("[Adaptive] selected weak:",selected.filter(question=>normalizeSubskill(question.subskill)===normalizedPrimary).length);
  console.log("[Adaptive] selected related:",selected.filter(question=>normalizeSubskill(question.subskill)!==normalizedPrimary).length);
  console.log("[Adaptive] question subskills:",selected.map(question=>question.subskill));
  if(weakPool.length<Math.ceil(count*.8))console.log("[Adaptive] limited weak pool");
 }
 return selected.map(question=>shuffleOptions(question,random));
}
export function selectSession(bank:AdaptiveQuestion[],mode:TrainingMode,count:number,history:QuestionHistory={},recentIds:string[]=[],weakSubskill?:string|string[],random=Math.random,confirmationCandidates:ConfirmationCandidate[]=[]){if(mode==="quick")return selectBalancedQuick(bank,count,history,recentIds,random,confirmationCandidates);const primaryWeak=Array.isArray(weakSubskill)?weakSubskill[0]:weakSubskill;if(mode==="weak"&&primaryWeak)return selectWeakSession(bank,count,history,recentIds,primaryWeak,random);let candidates=bank;if(mode==="challenge"){const hard=bank.filter(q=>q.difficulty==="hard");candidates=hard.length>=count?hard:bank}const recent=new Set(recentIds),ranked=units(candidates).map(group=>({group,score:priority(group,history,recent)+random()})).sort((a,b)=>b.score-a.score);const selected:AdaptiveQuestion[]=[];for(const {group} of ranked){if(selected.length+group.length<=count)selected.push(...group);if(selected.length>=count)break}return selected.map(q=>shuffleOptions(q,random))}
export function updateHistory(history:QuestionHistory,questions:AdaptiveQuestion[],answers:Record<string,string>,isCorrect:(q:AdaptiveQuestion,a:string)=>boolean,now=new Date().toISOString()){const next={...history};for(const q of questions){const ok=isCorrect(q,answers[q.id]||"");const old=next[q.id]||{seen:0,attempts:0,correct:0,incorrect:0,lastAttempt:"",skill:q.skill,subskill:q.subskill};next[q.id]={...old,seen:old.seen+1,attempts:old.attempts+1,correct:old.correct+(ok?1:0),incorrect:old.incorrect+(ok?0:1),lastAttempt:now}}return next}
export function accuracyRows(history:QuestionHistory,key:"skill"|"subskill"){const map=new Map<string,{attempts:number;correct:number}>();Object.values(history).forEach(x=>{const name=x[key],row=map.get(name)||{attempts:0,correct:0};row.attempts+=x.attempts;row.correct+=x.correct;map.set(name,row)});return [...map].map(([name,row])=>{const accuracy=Math.round(row.correct/row.attempts*100);return{name,...row,accuracy,status:accuracy<50?"Нужно повторить":accuracy<70?"Стоит потренироваться":accuracy<85?"Хороший результат":"Сильная сторона"} as AccuracyRow})}
export function weakAreas(history:QuestionHistory){return getWeakSubskills(accuracyRows(history,"subskill"))}
export function answerIsCorrect(q:AdaptiveQuestion,answer:string){return q.acceptedAnswers.includes(answer.trim().toLowerCase())}
export function optionLabel(options:AdaptiveOption[],id:string){return options.find(o=>o.id===id)?.label||id||"Нет ответа"}
