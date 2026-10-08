import {createFullSession,isResumableFullSession,FULL_ACTIVE_KEY,FULL_HISTORY_KEY,FULL_LAST_IDS_KEY,type FullHistory,type FullSession,type FullVariant} from './full-olympiad.ts';

type Profile={firstName:string;lastName:string;grade:string;classLetter:string};
type Store=Pick<Storage,'getItem'|'setItem'|'removeItem'>;
export const FULL_ISSUED_KEY='olympic-full-issued-v1';
const read=<T>(store:Store,key:string,fallback:T):T=>{try{return JSON.parse(store.getItem(key)||'') as T}catch{return fallback}};
export function fullProfileKey(profile:Profile){return `${FULL_ACTIVE_KEY}:${JSON.stringify([profile.firstName,profile.lastName,profile.grade,profile.classLetter].map(value=>value.trim().toLowerCase()))}`}
// Preserve a legacy round under its original pupil before replacing the profile.
export function preserveFullProfileSession(store:Store){const old=read<Profile|null>(store,'studentProfile',null),active=store.getItem(FULL_ACTIVE_KEY);if(old&&active){const session=read<FullSession|null>(store,FULL_ACTIVE_KEY,null);if(isResumableFullSession(session,Number(old.grade),session?.variant))recordFullIssue(store,session);store.setItem(fullProfileKey(old),active);store.removeItem(FULL_ACTIVE_KEY)}}
export function fullSessionIds(session:FullSession){return [session.listeningGroupId,...Object.values(session.questionIds).flat(),session.writingTaskId].filter((id):id is string=>!!id)}
export function recordFullIssue(store:Store,session:FullSession){
  const issued=read<{sessionIds:string[];history:FullHistory}>(store,FULL_ISSUED_KEY,{sessionIds:[],history:{}});
  if(issued.sessionIds.includes(session.id))return;
  for(const id of fullSessionIds(session)){const old=issued.history[id]||{seen:0,incorrect:0};issued.history[id]={...old,seen:old.seen+1}}
  issued.sessionIds.push(session.id);
  store.setItem(FULL_ISSUED_KEY,JSON.stringify(issued));
  store.setItem(FULL_LAST_IDS_KEY,JSON.stringify(fullSessionIds(session)));
}
export function beginFullTraining(store:Store,grade:number,variant:FullVariant,random?:()=>number){
  const completed=read<FullHistory>(store,FULL_HISTORY_KEY,{}),issued=read<{history:FullHistory}>(store,FULL_ISSUED_KEY,{history:{}}),history={...completed};
  for(const [id,record] of Object.entries(issued.history))history[id]={seen:Math.max(record.seen,completed[id]?.seen||0),incorrect:completed[id]?.incorrect||0};
  const session=createFullSession(grade,history,read<string[]>(store,FULL_LAST_IDS_KEY,[]),random,undefined,variant);
  recordFullIssue(store,session);
  return session;
}
