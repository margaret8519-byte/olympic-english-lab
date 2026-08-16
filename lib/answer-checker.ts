import type {QuestionBankItem} from "@/data/questions/types";
export type UserAnswer=string|Record<string,string>;
export function normalizeAnswer(value:string){return value.trim().replace(/\s+/g," ").toLocaleLowerCase("en")}
export function checkTextAnswer(answer:string,acceptedAnswers:string[]){const normalized=normalizeAnswer(answer);return acceptedAnswers.some(value=>normalizeAnswer(value)===normalized)}
export function checkAnswer(question:Pick<QuestionBankItem,"type"|"acceptedAnswers">,answer:UserAnswer){if(question.type==="writing")return null;if(question.type==="matching"){if(typeof answer==="string")return checkTextAnswer(answer,question.acceptedAnswers);return Object.entries(answer).every(([key,value])=>question.acceptedAnswers.some(item=>normalizeAnswer(item)===normalizeAnswer(`${key}:${value}`)))}return typeof answer==="string"&&checkTextAnswer(answer,question.acceptedAnswers)}
