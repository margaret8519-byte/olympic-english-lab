import { createClient } from "./client.ts";

export type ConfirmationCandidate={subskill:string;accuracy:number;updatedAt:string};
export type SkillStatRow={subskill:string;attempts:number;accuracy:number;updated_at:string};
export const confirmationCandidatesFromStats=(rows:SkillStatRow[]):ConfirmationCandidate[]=>rows.filter(row=>row.attempts===2&&Number(row.accuracy)<70).sort((a,b)=>Number(a.accuracy)-Number(b.accuracy)||new Date(b.updated_at).getTime()-new Date(a.updated_at).getTime()).map(row=>({subskill:row.subskill,accuracy:Number(row.accuracy),updatedAt:row.updated_at}));

export async function getConfirmationCandidates():Promise<ConfirmationCandidate[]>{
  const supabase=createClient();
  const{data:{session},error:sessionError}=await supabase.auth.getSession();
  if(sessionError)throw sessionError;
  if(!session)return[];
  const{data,error}=await supabase.from("skill_stats").select("subskill,attempts,accuracy,updated_at").eq("student_id",session.user.id).eq("attempts",2).lt("accuracy",70).order("accuracy",{ascending:true}).order("updated_at",{ascending:false});
  if(error)throw error;
  return confirmationCandidatesFromStats((data||[]) as SkillStatRow[]);
}
