"use client";
import {useMemo,useSyncExternalStore} from "react";
import {accuracyRows,weakAreas,type QuestionHistory,type TrainingAttempt} from "@/lib/adaptive-training";
import type {WritingSubmissionMarker} from "@/lib/supabase/writing-sync";
import type{SpeakingSubmissionMarker}from"@/lib/supabase/speaking-sync";
const subscribe=(callback:()=>void)=>{window.addEventListener("storage",callback);window.addEventListener("training-progress",callback);return()=>{window.removeEventListener("storage",callback);window.removeEventListener("training-progress",callback)}};
const snapshot=()=>JSON.stringify({history:localStorage.getItem("questionHistory")||"{}",attempts:localStorage.getItem("trainingAttempts")||"[]",writing:localStorage.getItem("olympic-writing-submission-9-2024")||"null",speaking:localStorage.getItem("olympic-speaking-submission")||"null"});
const server=()=>JSON.stringify({history:"{}",attempts:"[]",writing:"null",speaking:"null"});
export function useTrainingStats(){const raw=useSyncExternalStore(subscribe,snapshot,server);return useMemo(()=>{const stored=JSON.parse(raw) as{history:string;attempts:string;writing:string;speaking:string},history=JSON.parse(stored.history) as QuestionHistory,attempts=JSON.parse(stored.attempts) as TrainingAttempt[],writingSubmission=JSON.parse(stored.writing) as WritingSubmissionMarker|null,speakingSubmission=JSON.parse(stored.speaking) as SpeakingSubmissionMarker|null;return{history,attempts,writingSubmission,speakingSubmission,skills:accuracyRows(history,"skill"),subskills:accuracyRows(history,"subskill"),weak:weakAreas(history)}},[raw])}
