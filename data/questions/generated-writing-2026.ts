import type{QuestionBankItem,QuestionSet}from"./types.ts";
type Grade="7-8"|9|10|11;
type Prompt={id:string;text:string;min:number;max:number;requirements:string[];opening?:string};

const shared78:Prompt[]=[
{id:"lost-envelope",text:"Write a story about an envelope you found in an unexpected place. The story must explain who the envelope belonged to, why it mattered and what happened when you tried to return it.",min:120,max:180,requirements:["Give the story a title","Describe where the envelope was found","Include one surprising discovery","End the story clearly"]},
{id:"school-space",text:"Write an article for your school website about one place in your school that could be improved. Explain the problem, suggest two realistic changes and say how students would benefit.",min:120,max:180,requirements:["Give the article a headline","Describe the current problem","Suggest two changes","Explain the benefit for students"]}
];
const shared910:Prompt[]=[
{id:"silent-station",text:"Write a story beginning with the sentence below. Your story must show why the station was unusually quiet, include an important decision and end with a consequence the narrator did not expect.",opening:"The station should have been crowded, but when I stepped off the train, there was nobody there.",min:180,max:250,requirements:["Give the story a title","Use the required opening exactly","Include an important decision","Use at least two phrasal verbs","End with an unexpected consequence"]},
{id:"teen-project",text:"Write an article for an international youth website about a project teenagers could run to improve life in their town or district. Describe the problem, explain the project and show how success could be measured.",min:180,max:250,requirements:["Give the article a headline","Describe a real local problem","Explain the project clearly","Include practical roles for teenagers","Explain how success would be measured"]}
];
const grade11:Prompt[]=[
{id:"borrowed-memory",text:"Write a story beginning with the sentence below. The story must explore a difficult choice connected with memory, include reported speech and end with a clear moral or insight.",opening:"The message on the screen said the memory was not mine, but I recognised every detail.",min:180,max:250,requirements:["Give the story a title","Use the required opening exactly","Include at least two cases of reported speech","Use at least two different phrasal verbs","End with a meaningful insight"]},
{id:"public-space",text:"Write a proposal for your local council suggesting how an underused public space could be redesigned for teenagers without excluding other residents. Explain the need, propose facilities, consider one possible objection and suggest how the project could be evaluated.",min:180,max:250,requirements:["Use a clear proposal structure","Explain the need","Suggest realistic facilities","Address one objection","Explain how success would be evaluated"]}
];

function make(grade:Grade,prompt:Prompt):QuestionSet{
 const id=`generated-${grade}-writing-${prompt.id}`;
 return{id,title:"Writing · New Olympiad",section:"writing",instruction:"Complete the original OLYMPIC ENGLISH LAB writing task.",items:[{
   id:`${id}-01`,grade,year:2026,stage:"training",source:"original-olympic-english-lab",
   sourceLabel:"OLYMPIC ENGLISH LAB · авторская олимпиадная тренировка 2026",platformLabel:"OLYMPIC ENGLISH LAB",
   section:"writing",skill:"Writing",subskill:"competition writing",difficulty:"advanced",type:"writing",
   instruction:"Complete the writing task.",text:prompt.text,options:[],acceptedAnswers:[],points:20,
   explanation:"The response is assessed manually by the teacher.",tags:["original","generated-olympiad","2026","writing"],
   needsReview:true,wordLimit:{min:prompt.min,max:prompt.max},requirements:prompt.requirements,requiredOpening:prompt.opening
 } as QuestionBankItem]};
}
export function generatedWritingSetsForGrade(grade:number):QuestionSet[]{
 if(grade===7||grade===8)return shared78.map(prompt=>make("7-8",prompt));
 if(grade===9)return shared910.map(prompt=>make(9,prompt));
 if(grade===10)return shared910.map(prompt=>make(10,prompt));
 if(grade===11)return grade11.map(prompt=>make(11,prompt));
 return[];
}
