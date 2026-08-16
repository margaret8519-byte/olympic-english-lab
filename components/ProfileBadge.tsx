"use client";
import {useMemo,useSyncExternalStore} from "react";import {UserRound} from "lucide-react";import {demoProfile,type StudentProfile} from "@/lib/profile";
const fallback=JSON.stringify(demoProfile);
export function useProfile(){const raw=useSyncExternalStore(()=>()=>{},()=>localStorage.getItem("studentProfile")||fallback,()=>fallback);return useMemo(()=>{try{return JSON.parse(raw) as StudentProfile}catch{return demoProfile}},[raw])}
export default function ProfileBadge(){const p=useProfile();const sync=useSyncExternalStore(()=>()=>{},()=>localStorage.getItem("studentProfileSync"),()=>null);return <div className="profile"><span className="profile-icon"><UserRound/></span><span><b>{p.firstName} {p.lastName}</b><small>{p.grade} «{p.classLetter}» класс</small>{sync&&<small>{sync==="synced"?"✓ Синхронизация включена":"Сохранено на устройстве"}</small>}</span></div>}
