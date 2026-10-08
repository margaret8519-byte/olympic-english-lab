import {createFullSession,isResumableFullSession,FULL_ACTIVE_KEY,type FullHistory,type FullSession,type FullVariant} from './full-olympiad.ts';

type Profile={firstName:string;lastName:string;grade:string;classLetter:string};
type Store=Pick<Storage,'getItem'|'setItem'|'removeItem'>;
type IssueLedger={sessionIds:string[];history:FullHistory};

// The v1 ledger was shared across all profiles. Keep its previously issued questions
// as a starting point, but do not confuse those records with any pupil's scores.
export const FULL_ISSUED_KEY='olympic-full-issued-v1';
const read=<T>(store:Store,key:string,fallback:T):T=>{try{return JSON.parse(store.getItem(key)||'') as T}catch{return fallback}};
export function fullProfileKey(profile:Profile){return `${FULL_ACTIVE_KEY}:${JSON.stringify([profile.firstName,profile.lastName,profile.grade,profile.classLetter].map(value=>value.trim().toLowerCase()))}`}
export const fullProfileIssuedKey=(profile:Profile)=>fullProfileKey(profile)+':issued-v2';
export const fullProfileHistoryKey=(profile:Profile)=>fullProfileKey(profile)+':history-v2';
export const fullProfileLastIdsKey=(profile:Profile)=>fullProfileKey(profile)+':last-ids-v2';
export const fullGlobalIssuedKey=(grade:number,variant:FullVariant)=>`olympic-full-shared-issued-v3:${grade}:${variant}`;
export function fullSessionIds(session:FullSession){return [session.listeningGroupId,...Object.values(session.questionIds).flat(),session.writingTaskId].filter((id):id is string=>!!id)}
function readSharedLedger(store:Store,grade:number,variant:FullVariant):IssueLedger{
  const sharedKey=fullGlobalIssuedKey(grade,variant);
  const legacy=read<IssueLedger>(store,FULL_ISSUED_KEY,{sessionIds:[],history:{}});
  if(store.getItem(sharedKey))return read<IssueLedger>(store,sharedKey,{sessionIds:[],history:{}});
  // Migrate already-issued rounds from the prior release. Their per-pupil ledgers
  // exist in this browser, but the shared v1 ledger stopped being updated in that release.
  const history:FullHistory={...(legacy.history||{})};
  const enumerable=store as Store&{length?:number;key?:(index:number)=>string|null};
  if(typeof enumerable.key==='function'&&typeof enumerable.length==='number'){
    for(let index=0;index<enumerable.length;index++){
      const key=enumerable.key(index);
      if(!key?.startsWith(FULL_ACTIVE_KEY+':')||!key.endsWith(':issued-v2'))continue;
      try{
        const identity=JSON.parse(key.slice((FULL_ACTIVE_KEY+':').length,-':issued-v2'.length)) as string[];
        if(Number(identity[2])!==grade)continue;
        const prior=read<IssueLedger>(store,key,{sessionIds:[],history:{}});
        for(const [id,record] of Object.entries(prior.history||{})){
          const old=history[id]||{seen:0,incorrect:0};
          history[id]={seen:Math.max(old.seen,record.seen),incorrect:0};
        }
      }catch{/* Ignore stale storage entries with invalid profiles. */}
    }
  }
  return{sessionIds:[],history};
}
function appendIssue(ledger:IssueLedger,session:FullSession):IssueLedger{
  if(ledger.sessionIds.includes(session.id))return ledger;
  const history={...ledger.history};
  for(const id of new Set(fullSessionIds(session))){
    const old=history[id]||{seen:0,incorrect:0};
    history[id]={...old,seen:old.seen+1};
  }
  return{sessionIds:[...ledger.sessionIds,session.id],history};
}
export function recordFullIssue(store:Store,session:FullSession,profile:Profile){
  const pupilKey=fullProfileIssuedKey(profile),sharedKey=fullGlobalIssuedKey(session.grade,session.variant||'official');
  const pupil=read<IssueLedger>(store,pupilKey,{sessionIds:[],history:{}});
  const updatedPupil=appendIssue(pupil,session);
  if(updatedPupil!==pupil){
    store.setItem(pupilKey,JSON.stringify(updatedPupil));
    store.setItem(fullProfileLastIdsKey(profile),JSON.stringify(fullSessionIds(session)));
  }
  const shared=readSharedLedger(store,session.grade,session.variant||'official');
  const updatedShared=appendIssue(shared,session);
  if(updatedShared!==shared)store.setItem(sharedKey,JSON.stringify(updatedShared));
}
// An unfinished pre-upgrade round belongs to the pupil logged in when it was started.
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
  const issued=read<IssueLedger>(store,fullProfileIssuedKey(profile),{sessionIds:[],history:{}});
  const history:FullHistory={...completed};
  for(const [id,record] of Object.entries(issued.history))
    history[id]={seen:Math.max(record.seen,completed[id]?.seen||0),incorrect:completed[id]?.incorrect||0};
  const shared=readSharedLedger(store,grade,variant).history;
  const session=createFullSession(grade,history,read<string[]>(store,fullProfileLastIdsKey(profile),[]),random,undefined,variant,shared);
  recordFullIssue(store,session,profile);
  return session;
}
