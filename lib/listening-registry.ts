import type{ListeningGroup}from"./standalone-training.ts";

export type SafeListeningGroup=ListeningGroup&{audioSrc:string;audioMode:"file";script:string;validation:{status:"safe";playback:"source-mp3";transcriptSource:string;taskSource:string;keySource:string;audioSource:string;audioSha256:string}};
export type DisabledListeningGroup={grade:9|10|11;year:2022|2023|2024;reason:"missing-audio"|"missing-key"|"audio-transcript-mismatch";audioSource:string|null};

type ListeningCandidate=ListeningGroup&{validation?:{status?:string;playback?:string;audioSource?:string|null;audioSha256?:string|null}};
const verifiedAudioSources:Readonly<Record<string,string>>={};
export function isStrictlySafeListeningGroup(group:ListeningCandidate):group is SafeListeningGroup{return group.audioMode==="file"&&typeof group.audioSrc==="string"&&group.audioSrc.startsWith("/audio/")&&typeof group.script==="string"&&group.script.trim().length>0&&group.validation?.status==="safe"&&group.validation.playback==="source-mp3"&&typeof group.validation.audioSource==="string"&&group.validation.audioSource.length>0&&typeof group.validation.audioSha256==="string"&&group.validation.audioSha256.length===64&&verifiedAudioSources[group.audioSrc]===group.validation.audioSha256&&group.questions.length>0&&group.questions.every(question=>Number(question.grade)===group.grade&&!question.needsReview&&question.acceptedAnswers.length===1)}

const registry:Record<9|10|11,SafeListeningGroup[]>={
 9:[],
 10:[],
 11:[],
};

export const disabledListeningGroups:DisabledListeningGroup[]=[
 {grade:9,year:2022,reason:"missing-audio",audioSource:null},{grade:9,year:2023,reason:"missing-key",audioSource:"source_materials/grade-9/2023/listening.mp3"},{grade:9,year:2024,reason:"audio-transcript-mismatch",audioSource:"source_materials/grade-9/2024/listening.mp3"},
 {grade:10,year:2022,reason:"missing-audio",audioSource:null},{grade:10,year:2023,reason:"missing-key",audioSource:"source_materials/grade-10/2023/listening.mp3"},{grade:10,year:2024,reason:"audio-transcript-mismatch",audioSource:"public/audio/grade-10/2024/listening.mp3"},
 {grade:11,year:2022,reason:"missing-audio",audioSource:null},{grade:11,year:2023,reason:"missing-key",audioSource:"source_materials/grade-11/2023/11_аудиозапись_для_конкурса_понимания_устной_речи.mp3"},{grade:11,year:2024,reason:"missing-audio",audioSource:null},
];

export function validatedListeningGroupsForGrade(grade:number):SafeListeningGroup[]{return registry[grade as 9|10|11]||[]}
