"use client";
import FullOlympiadTraining from "@/components/training/FullOlympiadTraining";
import {useProfile} from "@/components/ProfileBadge";
export default function Page(){const profile=useProfile();return <FullOlympiadTraining variant={[7,8,9,10,11].includes(Number(profile.grade))?"mixed":"generated"}/>;}
