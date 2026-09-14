import type { AdaptiveQuestion } from "../../data/questions/grade-7-8/original/index.ts";
import type { Section } from "../../data/questions/types.ts";
import type { TrainingMode } from "../adaptive-training.ts";
import { createClient } from "./client.ts";

export const PENDING_SYNC_KEY = "pendingCloudSync";

export type CompletedAttemptInput = {
  attemptId: string;
  startedAt: string;
  completedAt: string;
  mode: TrainingMode|"official";
  section?: Section|"speaking"|null;
  source?: string;
  grade: number;
  questions: AdaptiveQuestion[];
  answers: Record<string,string>;
  weakSubskill: string | null;
};

export type AttemptSyncResult = { status:"synced"|"pending"; error?:string };
type PendingAttempt = CompletedAttemptInput;
type StorageLike = Pick<Storage,"getItem"|"setItem"|"removeItem">;
type SupabaseClient = ReturnType<typeof createClient>;

const isCorrect=(question:AdaptiveQuestion,answer:string)=>question.acceptedAnswers.includes(answer.trim().toLowerCase());
export const resultFor=(input:CompletedAttemptInput)=>{const correct=input.questions.filter(question=>isCorrect(question,input.answers[question.id]||"")).length,max=input.questions.length;return{correct,incorrect:max-correct,max,percentage:max?Math.round(correct/max*100):0}};

export function buildAttemptPayload(input:CompletedAttemptInput,studentId:string){const result=resultFor(input);return{id:input.attemptId,student_id:studentId,mode:input.mode==="weak"?"adaptive":input.mode,section:input.section??null,source:input.source??"original-olympic-english-lab",started_at:input.startedAt,completed_at:input.completedAt,score:result.correct,max_score:result.max,percentage:result.percentage,total_questions:result.max,correct_answers:result.correct,incorrect_answers:result.incorrect,weak_subskill:input.weakSubskill,metadata:{grade:input.grade,primaryWeakSubskill:input.weakSubskill}}}
export function buildAnswerPayloads(input:CompletedAttemptInput,studentId:string){return input.questions.map(question=>{const correct=isCorrect(question,input.answers[question.id]||"");return{attempt_id:input.attemptId,student_id:studentId,question_id:question.id,section:question.section,skill:question.skill,subskill:question.subskill,answer_text:input.answers[question.id]||"",is_correct:correct,points:correct?question.points:0,max_points:question.points}})}

export function readPending(storage:StorageLike):PendingAttempt[]{try{return JSON.parse(storage.getItem(PENDING_SYNC_KEY)||"[]") as PendingAttempt[]}catch{return[]}}
export function storePending(storage:StorageLike,input:PendingAttempt){const pending=readPending(storage).filter(item=>item.attemptId!==input.attemptId);storage.setItem(PENDING_SYNC_KEY,JSON.stringify([...pending,input]))}
export function removePending(storage:StorageLike,attemptId:string){const pending=readPending(storage).filter(item=>item.attemptId!==attemptId);if(pending.length)storage.setItem(PENDING_SYNC_KEY,JSON.stringify(pending));else storage.removeItem(PENDING_SYNC_KEY)}
export const attemptNeedsAnswerInsert=(existingAnswers:{id:unknown}[]|null|undefined)=>!existingAnswers?.length;

export function aggregateSkillStats(allAnswers:{skill:string|null;subskill:string|null;is_correct:boolean}[],studentId:string){const grouped=new Map<string,{skill:string;subskill:string;attempts:number;correct:number;incorrect:number}>();for(const answer of allAnswers){const skill=answer.skill||"Unknown",subskill=answer.subskill||"Unknown",key=`${skill}\u0000${subskill}`,row=grouped.get(key)||{skill,subskill,attempts:0,correct:0,incorrect:0};row.attempts++;row.correct+=answer.is_correct?1:0;row.incorrect+=answer.is_correct?0:1;grouped.set(key,row)}return[...grouped.values()].map(row=>({student_id:studentId,...row,accuracy:row.attempts?Math.round(row.correct/row.attempts*100):0}))}

async function updateSkillStats(supabase:SupabaseClient,studentId:string){const{data:allAnswers,error:readError}=await supabase.from("attempt_answers").select("skill,subskill,is_correct").eq("student_id",studentId);if(readError)throw readError;const payload=aggregateSkillStats(allAnswers||[],studentId);if(!payload.length)return;const{error}=await supabase.from("skill_stats").upsert(payload,{onConflict:"student_id,skill,subskill"});if(error)throw error}

async function syncOne(input:CompletedAttemptInput,supabase:SupabaseClient,storage:StorageLike){const adaptive=input.mode==="weak",log=(message:string,value?:unknown)=>{if(process.env.NODE_ENV==="development"&&adaptive)console.log(`[Adaptive Sync] ${message}`,value??"")};log("start");log("attemptId:",input.attemptId);log("answers:",input.questions.length);log("subskills:",input.questions.map(question=>question.subskill));const{data:{session},error:sessionError}=await supabase.auth.getSession();if(sessionError)throw sessionError;if(!session)throw new Error("No active Supabase session for the current student");const studentId=session.user.id,result=resultFor(input),attemptPayload=buildAttemptPayload(input,studentId),answerPayloads=buildAnswerPayloads(input,studentId);if(process.env.NODE_ENV==="development"&&!adaptive){console.log("[Attempt Sync] studentId:",studentId.slice(0,8));console.log("[Attempt Sync] attemptId:",input.attemptId.slice(0,8));console.log("[Attempt Sync] payload score:",`${result.correct} / ${result.max}`);console.log("[Attempt Sync] percentage:",result.percentage)}const{error:attemptError}=await supabase.from("attempts").upsert(attemptPayload,{onConflict:"id"});if(attemptError)throw attemptError;log("attempt saved");const{data:existingAnswers,error:answersReadError}=await supabase.from("attempt_answers").select("id").eq("attempt_id",input.attemptId).limit(1);if(answersReadError)throw answersReadError;if(attemptNeedsAnswerInsert(existingAnswers)){const{error:answersError}=await supabase.from("attempt_answers").insert(answerPayloads);if(answersError)throw answersError}log("answers saved");await updateSkillStats(supabase,studentId);log("skill stats updated");removePending(storage,input.attemptId)}

export async function saveCompletedAttempt(input:CompletedAttemptInput,{supabase=createClient(),storage=window.localStorage}:{supabase?:SupabaseClient;storage?:StorageLike}={}):Promise<AttemptSyncResult>{if(process.env.NODE_ENV==="development"&&input.mode!=="weak")console.log("[Attempt Sync] started");try{for(const pending of readPending(storage).filter(item=>item.attemptId!==input.attemptId)){try{await syncOne(pending,supabase,storage)}catch{break}}await syncOne(input,supabase,storage);if(process.env.NODE_ENV==="development"&&input.mode!=="weak")console.log("[Attempt Sync] success");return{status:"synced"}}catch(error){const message=error instanceof Error?error.message:String(error);storePending(storage,input);if(process.env.NODE_ENV==="development")console.error(input.mode==="weak"?"[Adaptive Sync] error:":"[Attempt Sync] error:",message);return{status:"pending",error:message}}}
