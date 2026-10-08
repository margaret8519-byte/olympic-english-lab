"use client";
import FullOlympiadTraining from "@/components/training/FullOlympiadTraining";
import Grade10Challenge from "@/app/training/challenge-10-preview/page";
import {useProfile} from "@/components/ProfileBadge";

// Grade 10's formerly repetitive five-set author mode now opens the approved full format.
export default function Page(){
 const profile=useProfile();
 return Number(profile.grade)===10?<Grade10Challenge/>:<FullOlympiadTraining variant="generated"/>;
}
