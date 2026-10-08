"use client";
import FullOlympiadTraining from "@/components/training/FullOlympiadTraining";
import {useProfile} from "@/components/ProfileBadge";
export default function FullOlympiadPage(){const profile=useProfile();return <FullOlympiadTraining variant={Number(profile.grade)===10?"mixed":"official"}/>;}
