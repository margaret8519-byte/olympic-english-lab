"use client";
import FullOlympiadTraining from "@/components/training/FullOlympiadTraining";
import Grade10Challenge from "@/app/training/challenge-10-preview/page";
import {useProfile} from "@/components/ProfileBadge";

// Grade 10 uses the approved complete olympiad-style paper in the MAIN full-training route.
// The genuine past-year questions remain available under /training/official-archive.
export default function FullOlympiadPage(){
 const profile=useProfile();
 return Number(profile.grade)===10?<Grade10Challenge/>:<FullOlympiadTraining/>;
}
