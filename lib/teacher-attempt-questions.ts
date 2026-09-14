import {originalQuestionBank} from "../data/questions/grade-7-8/original/index.ts";
import {grade9OriginalQuestionBank} from "../data/questions/grade-9/original/index.ts";
import {grade9OfficialRegistry} from "../data/questions/grade-9/official/index.ts";
import {grade10WritingSets,grade11WritingSets,objectiveBankForSeniorGrade} from "../data/questions/grade-10-11/index.ts";
import {originalWritingSets} from "../data/questions/writing-original.ts";

type Option={id:string;label:string};
export type TeacherQuestion={id:string;text:string;skill:string;subskill:string;type:string;options:Option[];acceptedAnswers:string[]};
type BankQuestion={id:string;text:string;skill:string;subskill:string;type:string;options:readonly(string|Option)[];acceptedAnswers:string[]};
const optionText=(value:string)=>value.replace(/^[A-Z]\s+(?=\S)/,"");
const normalizeQuestion=(question:BankQuestion):TeacherQuestion=>({id:question.id,text:question.text,skill:question.skill,subskill:question.subskill,type:question.type,options:question.options.map((option,index)=>typeof option==="string"?{id:String.fromCharCode(97+index),label:optionText(option)}:option),acceptedAnswers:question.acceptedAnswers});
const officialItems=(registry:Record<string,Record<string,{items:readonly BankQuestion[]}>>)=>Object.values(registry).flatMap(year=>Object.values(year).flatMap(set=>set.items));
const allQuestions:BankQuestion[]=[...originalQuestionBank as BankQuestion[],...grade9OriginalQuestionBank as BankQuestion[],...officialItems(grade9OfficialRegistry as unknown as Record<string,Record<string,{items:readonly BankQuestion[]}>>),...objectiveBankForSeniorGrade(10)as BankQuestion[],...objectiveBankForSeniorGrade(11)as BankQuestion[],...grade10WritingSets.flatMap(set=>set.items)as BankQuestion[],...grade11WritingSets.flatMap(set=>set.items)as BankQuestion[],...[9,10,11].flatMap(grade=>originalWritingSets(grade as 9|10|11).flatMap(set=>set.items))as BankQuestion[]];
const questionById=new Map(allQuestions.map(question=>[question.id,normalizeQuestion(question)]));

export function findTeacherQuestion(questionId:string){return questionById.get(questionId)}
export function displayTeacherAnswer(question:TeacherQuestion|undefined,answer:string){if(!question)return answer;return question.options.find(option=>option.id.toLowerCase()===answer.trim().toLowerCase())?.label||answer}
export function displayCorrectAnswer(question:TeacherQuestion|undefined){if(!question)return null;return question.acceptedAnswers.map(answer=>displayTeacherAnswer(question,answer)).filter(Boolean).join(" / ")||null}
