import {createFullSession,isResumableFullSession,FULL_ACTIVE_KEY,type FullHistory,type FullSession,type FullVariant} from './full-olympiad.ts';

type Profile={firstName:string;lastName:string;grade:string;classLetter:string};
type Store=Pick<Storage,'getItem'|'setItem'|'removeItem'>;
// Legacy shared history is deliberately left untouched. It cannot be reliably attributed to one pupil.
export const FULL_ISSUED_KEY='olympic-full-issued-v1';
const read=<T>(store:Store,key:string,fallback:T):T=>{try{return JSON.parse(store.getItem(key)||'') as T}catch{return fallback}};
export function fullProfileKey(profile:Profile){return `${FULL_ACTIVE_KEY}:${JSON.stringify([profile.firstName,profile.lastName,profile.grade,profile.classLetter].map(value=>value.trim().toLowerCase()))}`}
// Profile-scoped keys prevent one pupil's issued questions and errors from affecting another pupil.
export const fullProfileIssuedKey=(profile:Profile)=>fullProfileKey(profile)+':issued-v2';
export const fullProfileHistoryKey=(profile:Profile)=>fullProfileKey(profile)+':history-v2';
export const fullProfileLastIdsKey=(profile:Profile)=>fullProfileKey(profile)+':last-ids-v2';
export function fullSessionIds(session:FullSession){return [session.listeningGroupId,...Object.values(session.questionIds).flat(),session.writingTaskId].filter((id):id is string=>!!id)}
export function recordFullIssue(store:Store,session:FullSession,profile:Profile){
  const key=fullProfileIssuedKey(profile);
  const issued=read<{sessionIds:string[];history:FullHistory}>(store,key,{sessionIds:[],history:{}});
  if(issued.sessionIds.includes(session.id))return;
  for(const id of new Set(fullSessionIds(session))){const old=issued.history[id]||{seen:0,incorrect:0};issued.history[id]={...old,seen:old.seen+1}}
  issued.sessionIds.push(session.id);
  store.setItem(key,JSON.stringify(issued));
  store.setItem(fullProfileLastIdsKey(profile),JSON.stringify(fullSessionIds(session)));
}
// Preserve an unfinished pre-upgrade round under the pupil who was logged in before the profile switch.
export function preserveFullProfileSession(store:Store){
  const old=read<Profile|null>(store,'studentProfile',null);
  const active=store.getItem(FULL_ACTIVE_KEY);
  if(!old||!active)return;
  const session=read<FullSession|null>(store,FULL_ACTIVE_KEY,null);
  if(!isResumableFullSession(session,Number(old.grade),session?.variant))return;
  recordFullIssue(store,session,old);
  store.setItem(fullProfileKey(old),active);
  store.removeItem(FULL_ACTIVE_KEY);
}
export function beginFullTraining(store:Store,grade:number,variant:FullVariant,profile:Profile,random?:()=>number){
  const completed=read<FullHistory>(store,fullProfileHistoryKey(profile),{});
  const issued=read<{history:FullHistory}>(store,fullProfileIssuedKey(profile),{history:{}});
  const history:FullHistory={...completed};
  for(const [id,record] of Object.entries(issued.history))history[id]={seen:Math.max(record.seen,completed[id]?.seen||0),incorrect:completed[id]?.incorrect||0};
  const session=createFullSession(grade,history,read<string[]>(store,fullProfileLastIdsKey(profile),[]),random,undefined,variant);
  recordFullIssue(store,session,profile);
  return session;
}
