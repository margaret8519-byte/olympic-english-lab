export type Section="listening"|"reading"|"use-of-english"|"writing";
export type QuestionType="multiple-choice"|"gap-fill"|"matching"|"true-false"|"open-short-answer"|"writing";
export type Difficulty="medium"|"advanced";
export type QuestionSource="official-vsosh-vzlet"|"original-olympic-english-lab";
export type QuestionStage="municipal"|"training";
export type PlatformLabel="Взлёт"|"OLYMPIC ENGLISH LAB";
export interface QuestionBankItem{id:string;grade:"7-8"|9|10|11;year:2022|2023|2024|2025;stage:QuestionStage;source:QuestionSource;sourceLabel:string;platformLabel:PlatformLabel;section:Section;skill:string;subskill:string;difficulty:Difficulty;type:QuestionType;instruction:string;text:string;options:string[];acceptedAnswers:string[];points:number;explanation:string;tags:string[];needsReview:boolean;groupId?:string;passage?:string;wordLimit?:{min:number;max:number};requiredOpening?:string;requirements?:string[];rule?:string;evidence?:string;feedback?:string}
export interface QuestionSet{id:string;title:string;section:Section;instruction:string;items:QuestionBankItem[];script?:string;audioSrc?:string;audioMode?:"speech"|"file"}
export const officialMeta={grade:"7-8",year:2022,stage:"municipal",source:"official-vsosh-vzlet",sourceLabel:"Всероссийская олимпиада школьников по английскому языку, муниципальный этап, 2022",platformLabel:"Взлёт"} as const;
