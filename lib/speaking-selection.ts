import type{SpeakingSet}from"../data/speaking/2022/types.ts";
export type SpeakingHistory=Record<string,{attempts:number;bestPercentage:number|null}>;
export const SPEAKING_HISTORY_KEY="olympic-speaking-task-history-v1";
export const SPEAKING_ACTIVE_KEY="olympic-speaking-active-v1";
export type ActiveSpeakingTask={grade:number;taskId:string;attemptId:string};
export function speakingTasksForGrade(tasks:SpeakingSet[],grade:number){return tasks.filter(task=>task.gradeRange.includes(grade))}
export function rankSpeakingTasks(tasks:SpeakingSet[],grade:number,history:SpeakingHistory={},lastTaskId:string|null=null,random=Math.random){return speakingTasksForGrade(tasks,grade).map((task,index)=>{const record=history[task.id],unseen=!record?.attempts,weak=record?.bestPercentage??101;return{task,index,weak,priority:unseen?0:weak<70?1:2,last:task.id===lastTaskId?1:0,tie:random()}}).sort((a,b)=>a.priority-b.priority||a.last-b.last||(a.priority===1?a.weak-b.weak:a.tie-b.tie)||a.index-b.index).map(row=>row.task)}
export function recordSpeakingAttempt(history:SpeakingHistory,taskId:string,percentage:number|null=null){const old=history[taskId]||{attempts:0,bestPercentage:null};return{...history,[taskId]:{attempts:old.attempts+1,bestPercentage:percentage==null?old.bestPercentage:Math.max(old.bestPercentage??0,percentage)}}}
