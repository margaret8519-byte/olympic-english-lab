"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Signature, Vzlet } from "@/components/Brand";
import { getClassJoinErrorMessage, syncStudentProfile } from "@/lib/supabase/student-profile";

export default function Start(){
  const router=useRouter(),[errors,setErrors]=useState<Record<string,boolean>>({}),[saving,setSaving]=useState(false),[joinError,setJoinError]=useState("");
  async function handleSubmit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();const fd=new FormData(event.currentTarget),joinCode=String(fd.get("joinCode")||"").trim(),p={firstName:String(fd.get("firstName")||"").trim(),lastName:String(fd.get("lastName")||"").trim(),grade:String(fd.get("grade")||""),classLetter:String(fd.get("classLetter")||"")},validation={firstName:!p.firstName,lastName:!p.lastName,grade:!p.grade};
    setErrors(validation);setJoinError("");if(Object.values(validation).some(Boolean))return;setSaving(true);
    try{const{joinedClass}=await syncStudentProfile(p,joinCode);localStorage.setItem("studentProfile",JSON.stringify(p));localStorage.setItem("studentProfileSync","synced");if(joinedClass)localStorage.setItem("studentClass",JSON.stringify(joinedClass));else localStorage.removeItem("studentClass");router.push("/dashboard")}
    catch(error){if(joinCode){if(process.env.NODE_ENV==="development")console.error("[Class Join Error]",error);setJoinError(getClassJoinErrorMessage(error));setSaving(false);return}localStorage.removeItem("studentClass");localStorage.setItem("studentProfile",JSON.stringify(p));localStorage.setItem("studentProfileSync","local");if(process.env.NODE_ENV==="development")console.error("[Supabase profile sync error]",error);router.push("/dashboard")}
  }
  return <main className="start-page"><header className="landing-header"><Vzlet/><Signature/></header><div className="start-glow red-orb"/><section className="start-card"><Link href="/" className="back"><ArrowLeft/> На главную</Link><div className="start-icon"><Sparkles/></div><div><span className="eyebrow">ДОБРО ПОЖАЛОВАТЬ</span><h1>Давайте познакомимся</h1><p>Введите данные, чтобы мы сохранили ваш прогресс</p></div><form onSubmit={handleSubmit} noValidate><label>Имя<input name="firstName" placeholder="Анна" aria-invalid={errors.firstName}/>{errors.firstName&&<small>Введите имя</small>}</label><label>Фамилия<input name="lastName" placeholder="Петрова" aria-invalid={errors.lastName}/>{errors.lastName&&<small>Введите фамилию</small>}</label><label>Класс<select name="grade" defaultValue=""><option value="" disabled>Выберите</option>{[7,8,9,10,11].map(x=><option key={x}>{x}</option>)}</select>{errors.grade&&<small>Выберите класс</small>}</label><label>Буква класса<select name="classLetter" defaultValue="А">{["А","Б","В","Г","Д","Другая"].map(x=><option key={x}>{x}</option>)}</select></label><label>Код учителя / класса<input name="joinCode" placeholder="Например: MARG9A" autoCapitalize="characters"/><small>Если учитель дал вам код класса, введите его здесь.</small>{joinError&&<small className="teacher-error">{joinError}</small>}</label><button className="primary blue" type="submit" disabled={saving}>{saving?"Сохраняем…":"Войти в тренажёр"}<ArrowRight/></button></form></section></main>
}
