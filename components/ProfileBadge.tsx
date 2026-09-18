"use client";
import {useMemo,useSyncExternalStore} from "react";import {UserRound} from "lucide-react";import {demoProfile,type StudentProfile} from "@/lib/profile";
const fallback=JSON.stringify(demoProfile);
const snapshot=()=>`${localStorage.getItem("studentProfile")||fallback}\u0000${localStorage.getItem("studentClass")||""}`;
const subscribe=(callback:()=>void)=>{window.addEventListener("storage",callback);window.addEventListener("student-profile-change",callback);return()=>{window.removeEventListener("storage",callback);window.removeEventListener("student-profile-change",callback)}};
export function useProfile(){const raw=useSyncExternalStore(subscribe,snapshot,()=>`${fallback}\u0000`);return useMemo(()=>{const[profileRaw]=raw.split("\u0000");let profile:StudentProfile=demoProfile;try{profile=JSON.parse(profileRaw)as StudentProfile}catch{}return profile},[raw])}
export default function ProfileBadge(){const p=useProfile();const sync=useSyncExternalStore(subscribe,()=>localStorage.getItem("studentProfileSync"),()=>null);return <div className="profile"><span className="profile-icon"><UserRound/></span><span><b>{p.firstName} {p.lastName}</b><small>{p.grade} «{p.classLetter}» класс</small>{sync&&<small>{sync==="synced"?"✓ Синхронизация включена":"Сохранено на устройстве"}</small>}</span></div>}
