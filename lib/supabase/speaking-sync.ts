import type{SpeakingSet}from"@/data/speaking/2022/types";
import{createClient}from"./client";

export const SPEAKING_BUCKET="speaking-recordings";
export const SPEAKING_MARKER_KEY="olympic-speaking-submission";
export type SpeakingSubmissionMarker={attemptId:string;taskId:string;taskTitle:string;submittedAt:string;durationSeconds:number;reviewStatus:"pending"|"reviewed";score?:number|null;maxScore?:number|null;teacherComment?:string|null;storagePath?:string};
export type SpeakingSubmissionInput={attemptId:string;blob:Blob;startedAt:string;durationSeconds:number;grade:number;task:SpeakingSet};
const extensionFor=(mime:string)=>mime.includes("mp4")?"mp4":mime.includes("ogg")?"ogg":"webm";

export async function submitSpeakingRecording(input:SpeakingSubmissionInput){
  const supabase=createClient(),{data:{session},error:sessionError}=await supabase.auth.getSession();
  if(sessionError||!session)throw sessionError||new Error("No active student session");
  const studentId=session.user.id,submittedAt=new Date().toISOString();
  const{data:existing,error:existingError}=await supabase.from("speaking_submissions").select("attempt_id,storage_path,status,score,max_score,teacher_comment").eq("attempt_id",input.attemptId).maybeSingle();
  if(existingError)throw existingError;
  if(existing){const marker:SpeakingSubmissionMarker={attemptId:input.attemptId,taskId:input.task.id,taskTitle:input.task.location,submittedAt,durationSeconds:input.durationSeconds,reviewStatus:existing.status,score:existing.score,maxScore:existing.max_score,teacherComment:existing.teacher_comment,storagePath:existing.storage_path};localStorage.setItem(SPEAKING_MARKER_KEY,JSON.stringify(marker));return marker}
  const storagePath=`${studentId}/${input.attemptId}/${crypto.randomUUID()}.${extensionFor(input.blob.type)}`;
  const{error:attemptError}=await supabase.from("attempts").upsert({id:input.attemptId,student_id:studentId,mode:"official",section:"speaking",source:input.task.source,started_at:input.startedAt,completed_at:submittedAt,score:null,max_score:null,percentage:null,total_questions:1,correct_answers:null,incorrect_answers:null,weak_subskill:null,metadata:{grade:input.grade,taskId:input.task.id,taskTitle:input.task.location,year:input.task.year,skill:input.task.skill||"Speaking",subskill:input.task.subskill||input.task.topic||input.task.location,durationSeconds:input.durationSeconds,reviewStatus:"pending"}},{onConflict:"id"});
  if(attemptError)throw attemptError;
  const{error:uploadError}=await supabase.storage.from(SPEAKING_BUCKET).upload(storagePath,input.blob,{contentType:input.blob.type||"audio/webm",upsert:false});
  if(uploadError)throw uploadError;
  const{error:submissionError}=await supabase.from("speaking_submissions").insert({attempt_id:input.attemptId,student_id:studentId,storage_path:storagePath,mime_type:input.blob.type||null,duration_seconds:input.durationSeconds,task_id:input.task.id,task_title:input.task.location});
  if(submissionError){await supabase.storage.from(SPEAKING_BUCKET).remove([storagePath]);throw submissionError}
  const marker:SpeakingSubmissionMarker={attemptId:input.attemptId,taskId:input.task.id,taskTitle:input.task.location,submittedAt,durationSeconds:input.durationSeconds,reviewStatus:"pending",storagePath};
  localStorage.setItem(SPEAKING_MARKER_KEY,JSON.stringify(marker));window.dispatchEvent(new Event("training-progress"));return marker;
}

export async function refreshSpeakingMarker(){
  const raw=localStorage.getItem(SPEAKING_MARKER_KEY);if(!raw)return null;
  const marker=JSON.parse(raw)as SpeakingSubmissionMarker,{data,error}=await createClient().from("speaking_submissions").select("status,score,max_score,teacher_comment,storage_path").eq("attempt_id",marker.attemptId).maybeSingle();
  if(error||!data)return marker;
  const next={...marker,reviewStatus:data.status as"pending"|"reviewed",score:data.score,maxScore:data.max_score,teacherComment:data.teacher_comment,storagePath:data.storage_path};localStorage.setItem(SPEAKING_MARKER_KEY,JSON.stringify(next));window.dispatchEvent(new Event("training-progress"));return next;
}
