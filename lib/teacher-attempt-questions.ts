import {originalQuestionBank} from "../data/questions/grade-7-8/original/index.ts";
import {grade782022Sets} from "../data/questions/grade-7-8/2022/index.ts";
import {grade782025Sets} from "../data/questions/grade-7-8/2025/index.ts";
import {grade9OriginalQuestionBank} from "../data/questions/grade-9/original/index.ts";
import {grade9OfficialRegistry} from "../data/questions/grade-9/official/index.ts";
import {official2025ForGrade} from "../data/questions/grade-9-10/official-2025.ts";
import {grade10Listening2022,grade10WritingSets,grade11Listening2022,grade11WritingSets,objectiveBankForSeniorGrade} from "../data/questions/grade-10-11/index.ts";
import {grade10Reading2022Verified,grade11Reading2022Verified} from "../data/questions/grade-10-11/official-2022-reading.ts";
import {grade10UseOfEnglish2022Verified,grade11UseOfEnglish2022Verified} from "../data/questions/grade-10-11/official-2022.ts";
import {grade10Reading2023Verified,grade10UseOfEnglish2023Verified} from "../data/questions/grade-10-11/official-2023-grade10.ts";
import {grade11Official2025} from "../data/questions/grade-11/official-2025.ts";
import {originalWritingSets} from "../data/questions/writing-original.ts";
import {grade78Writing2019,grade9Writing2019,grade10Writing2019,grade11Writing2019} from "../data/questions/writing-official-2019.ts";
import {grade78Writing2020,grade9Writing2020,grade10Writing2020,grade11Writing2020} from "../data/questions/writing-official-2020.ts";
import {grade78Writing2025,grade9Writing2025,grade10Writing2025,grade11Writing2025} from "../data/questions/writing-official-2025.ts";
import {generatedListeningSetsForGrade} from "../data/questions/generated-listening-2026.ts";
import {generatedWritingSetsForGrade} from "../data/questions/generated-writing-2026.ts";

type Option={id:string;label:string};
export type TeacherQuestion={id:string;text:string;skill:string;subskill:string;type:string;options:Option[];acceptedAnswers:string[];explanation:string};
type BankQuestion={id:string;text:string;skill:string;subskill:string;type:string;options:readonly(string|Option)[];acceptedAnswers:string[];explanation?:string;feedback?:string;rule?:string};

function parsedOption(value:string,index:number):Option{
  const trimmed=value.trim();
  const letter=trimmed.match(/^([A-Ia-i])(?:[.)]|\s+)\s*(.*)$/);
  if(letter)return{id:letter[1].toLowerCase(),label:letter[2].trim()||letter[1].toUpperCase()};
  const number=trimmed.match(/^(\d+)(?:[.)]|\s+)?\s*(.*)$/);
  if(number)return{id:number[1],label:number[2].trim()||number[1]};
  if(/^(T|F|NS)$/i.test(trimmed))return{id:trimmed.toLowerCase(),label:trimmed.toUpperCase()};
  return{id:String.fromCharCode(97+index),label:trimmed};
}
const normalizeQuestion=(question:BankQuestion):TeacherQuestion=>({
  id:question.id,text:question.text,skill:question.skill,subskill:question.subskill,type:question.type,
  options:question.options.map((option,index)=>typeof option==="string"?parsedOption(option,index):option),
  acceptedAnswers:question.acceptedAnswers,
  explanation:(question.explanation||question.rule||question.feedback||"").trim()
});
const officialItems=(registry:Record<string,Record<string,{items:readonly BankQuestion[]}>>)=>Object.values(registry).flatMap(year=>Object.values(year).flatMap(set=>set.items));
const setItems=(...sets:{items:readonly BankQuestion[]}[])=>sets.flatMap(set=>set.items);
const writingOfficial=[grade78Writing2019,grade9Writing2019,grade10Writing2019,grade11Writing2019,grade78Writing2020,grade9Writing2020,grade10Writing2020,grade11Writing2020,grade78Writing2025,grade9Writing2025,grade10Writing2025,grade11Writing2025];
const allQuestions:BankQuestion[]=[
  ...originalQuestionBank as BankQuestion[],
  ...setItems(...Object.values(grade782022Sets) as unknown as {items:readonly BankQuestion[]}[]),
  ...setItems(...Object.values(grade782025Sets) as unknown as {items:readonly BankQuestion[]}[]),
  ...grade9OriginalQuestionBank as BankQuestion[],
  ...officialItems(grade9OfficialRegistry as unknown as Record<string,Record<string,{items:readonly BankQuestion[]}>>),
  ...setItems(official2025ForGrade(9).listening,official2025ForGrade(9).reading,official2025ForGrade(9)["use-of-english"]),
  ...setItems(official2025ForGrade(10).listening,official2025ForGrade(10).reading,official2025ForGrade(10)["use-of-english"]),
  ...grade10Listening2022.items as BankQuestion[],
  ...grade11Listening2022.items as BankQuestion[],
  ...grade10Reading2022Verified.items as BankQuestion[],
  ...grade10UseOfEnglish2022Verified.items as BankQuestion[],
  ...grade11Reading2022Verified.items as BankQuestion[],
  ...grade11UseOfEnglish2022Verified.items as BankQuestion[],
  ...grade10Reading2023Verified.items as BankQuestion[],
  ...grade10UseOfEnglish2023Verified.items as BankQuestion[],
  ...objectiveBankForSeniorGrade(10) as BankQuestion[],
  ...objectiveBankForSeniorGrade(11) as BankQuestion[],
  ...setItems(grade11Official2025.listening,grade11Official2025.reading,grade11Official2025["use-of-english"]),
  ...grade10WritingSets.flatMap(set=>set.items) as BankQuestion[],
  ...grade11WritingSets.flatMap(set=>set.items) as BankQuestion[],
  ...writingOfficial.flatMap(set=>set.items) as BankQuestion[],
  ...[9,10,11].flatMap(grade=>originalWritingSets(grade as 9|10|11).flatMap(set=>set.items)) as BankQuestion[],
  ...[7,9,10,11].flatMap(grade=>generatedListeningSetsForGrade(grade).flatMap(set=>set.items)) as BankQuestion[],
  ...[7,9,10,11].flatMap(grade=>generatedWritingSetsForGrade(grade).flatMap(set=>set.items)) as BankQuestion[]
];
const questionById=new Map(allQuestions.map(question=>[question.id,normalizeQuestion(question)]));
const normalized=(value:string)=>value.trim().toLowerCase();
const optionAnswer=(question:TeacherQuestion,answer:string)=>{const option=question.options.find(item=>normalized(item.id)===normalized(answer));return option?`${option.id.toUpperCase()} — ${option.label}`:answer};

export function findTeacherQuestion(questionId:string){return questionById.get(questionId)}
export function displayTeacherAnswer(question:TeacherQuestion|undefined,answer:string){if(!question)return answer;const shown=optionAnswer(question,answer),isCorrect=question.acceptedAnswers.some(value=>normalized(value)===normalized(answer));const explanation=question.explanation&&!/ответ подтверждён|official task:/i.test(question.explanation)?question.explanation:"";return !isCorrect&&explanation?`${shown}. Почему ошибка: ${explanation}`:shown}
export function displayCorrectAnswer(question:TeacherQuestion|undefined){if(!question)return null;return question.acceptedAnswers.map(answer=>optionAnswer(question,answer)).filter(Boolean).join(" / ")||null}
