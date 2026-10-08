import {challenge10} from "./challenge-10-preview.ts";
import type {QuestionBankItem} from "./questions/types.ts";
import type {ListeningGroup} from "../lib/standalone-training.ts";

/** Group-preserving adaptation of the teacher-approved original B2+ paper. */
const original="original-olympic-english-lab" as const;
const tasks:ReadonlyArray<{title:string;body:string;from:number;to:number}>=[...challenge10.sections[0].tasks,...challenge10.sections[1].tasks,...challenge10.sections[2].tasks,...challenge10.sections[3].tasks];
const taskOf=(n:number)=>tasks.find(t=>t.from<=n&&n<=t.to&&t.from>0);
const plain=(v:string)=>v.replace(/\*\*/g,"").replace(/\*([^*]+)\*/g,"$1").trim();
const roman=["I","II","III","IV","V","VI","VII","VIII"];
const letters=(n:number)=>Array.from({length:n},(_,i)=>String.fromCharCode(65+i));
function choices(n:number,body:string){
 const ids=n<=6?letters(4):n<=13?letters(8):n<=20?[]:n<=27?roman:n<=33?letters(7):n<=40?[]:n<=45?[]:n<=50?letters(8):n<=55?[]:letters(7);
 if(n>=14&&n<=20)return["T True","F False"];
 if(n>=34&&n<=40)return["T True","F False","NG Not given"];
 const start=n<=6?body.indexOf("**"+n+"."):0;
 const fragment=start>=0?body.slice(start):body;
 return ids.map(id=>{
  const line=fragment.split("\n").find(v=>v.startsWith(id+". "));
  return id+" "+plain(line?line.slice(id.length+2):"");
 });
}
function questionText(n:number,body:string){
 if(n>=7&&n<=13)return "Speaker "+(n-6)+". Match the statement (A–H).";
 if(n>=21&&n<=27)return "Paragraph "+String.fromCharCode(65+n-21)+". Match the heading (I–VIII).";
 if(n>=28&&n<=33)return "Choose the sentence for gap "+n+".";
 if(n>=41&&n<=45){const re=new RegExp("\\("+n+"\\)\\s*_+\\s*\\(([^)]+)\\)");return "Gap "+n+": form a word from "+(body.match(re)?.[1]||"the word in brackets")+".";}
 const lines=body.split("\n");let at=lines.findIndex(line=>line.startsWith("**"+n+".")||line.startsWith(n+". "));
 if(at<0)return "Answer question "+n+" using the text above.";
 let result=lines[at].replace(new RegExp("^\\*\\*"+n+"\\.\\*\\*\\s*"),"").replace(new RegExp("^\\*\\*"+n+"\\.\\s*"),"").replace(new RegExp("^"+n+"\\.\\s*"),"");
 if(n>=51&&n<=55)result+=" "+(lines[at+2]||"");
 return plain(result.replace(/_+/g,"____"));
}
function groupId(n:number){
 if(n<=6)return "approved10-audio-interview";
 if(n<=13)return "approved10-audio-voices";
 if(n<=20)return "approved10-audio-map";
 if(n<=27)return "approved10-reading-archive";
 if(n<=40)return "approved10-reading-harton";
 if(n<=45)return "approved10-uoe-wordformation";
 if(n<=50)return "approved10-uoe-idioms";
 if(n<=55)return "approved10-uoe-transformations";
 return "approved10-uoe-heritage";
}
const matching=(n:number)=>n>=7&&n<=13||n>=21&&n<=33||n>=46&&n<=50||n>=56&&n<=60;
function passage(n:number,body:string){
 if(n>=21&&n<=27||n>=28&&n<=33||n>=41&&n<=45)return body;
 if(n>=34&&n<=40)return taskOf(28)?.body||body;
 if(n>=46&&n<=50)return body.split("\n\n**46.")[0];
 if(n>=56&&n<=60)return body.split("\n\n**56.")[0];
 return undefined;
}
function make(n:number):QuestionBankItem{
 const task=taskOf(n);if(!task)throw Error("Missing approved item "+n);
 const body=task.body,section=n<=20?"listening":n<=40?"reading":"use-of-english";
 const labels=choices(n,body);
 const pair=matching(n)?"exclusive-pair:"+groupId(n):"";
 const entry:QuestionBankItem={id:"approved10-"+n,grade:10,year:2026,stage:"training",source:original,
 sourceLabel:"OLYMPIC ENGLISH LAB · авторский вариант 2026",platformLabel:"OLYMPIC ENGLISH LAB",
 section,skill:section==="use-of-english"?"Use of English":section==="reading"?"Reading":"Listening",
 subskill:task.title,difficulty:"advanced",type:labels.length?matching(n)?"matching":"multiple-choice":"gap-fill",
 instruction:plain(body.split("\n\n")[0]),text:questionText(n,body),options:labels,
 acceptedAnswers:[String(challenge10.keys[String(n) as keyof typeof challenge10.keys]).toLowerCase()],
 points:1,explanation:"Сверено с ключом одобренной авторской работы.",
 tags:["original","olympiad","2026",...(pair?[pair]:[])],needsReview:false,groupId:groupId(n)};
 const context=passage(n,body);if(context)entry.passage=plain(context);
 return entry;
}
export const approved10Questions:QuestionBankItem[]=Array.from({length:60},(_,i)=>make(i+1));
export const approved10Listening:ListeningGroup[]=challenge10.scripts.map((script,i)=>{
 const first=i===0?1:i===1?7:14,end=i===0?6:i===1?13:20;
 return{id:groupId(first),grade:10,script:plain(script.text),audioMode:"speech",source:original,year:2026,title:script.title,
 instruction:approved10Questions[first-1].instruction,questions:approved10Questions.slice(first-1,end)};
});
const writing=challenge10.sections[3].tasks[0];
export const approved10Writing:QuestionBankItem={
 id:"approved10-writing",grade:10,year:2026,stage:"training",source:original,sourceLabel:"OLYMPIC ENGLISH LAB · творческий рассказ 2026",
 platformLabel:"OLYMPIC ENGLISH LAB",section:"writing",skill:"Writing",subskill:"competition story",difficulty:"advanced",type:"writing",
 instruction:"Write 180–250 words.",text:plain(writing.body),options:[],acceptedAnswers:[],points:20,
 explanation:"Проверяется учителем.",tags:["original","2026"],needsReview:true,
 wordLimit:{min:180,max:250},requiredOpening:"At first, I thought the letter had been sent to the wrong address.",
 requirements:["Обязательное начало","180–250 слов","2 идиомы и 2 фразовых глагола","Неожиданный поворот в финале"]
};
