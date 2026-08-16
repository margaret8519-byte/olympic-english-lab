"use client";
import Link from "next/link";import {ArrowLeft,BookOpen} from "lucide-react";import {AppHeader} from "@/components/Brand";import {useProfile} from "@/components/ProfileBadge";import {registryForGrade} from "@/lib/training-grade";
export default function JuniorGradeGuard({children}:{children:React.ReactNode}){const profile=useProfile();if(registryForGrade(profile.grade)==="grade-7-8")return children;return <main className="portal training"><AppHeader blue/><div className="adaptive-shell"><Link href="/dashboard"><ArrowLeft/> Главная</Link><section className="adaptive-empty"><BookOpen/><h1>Тренировочный банк для {profile.grade} класса сейчас подключается.</h1></section></div></main>}

