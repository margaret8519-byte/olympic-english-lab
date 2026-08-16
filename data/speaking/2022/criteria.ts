import type { SpeakingCriterion } from "./types";

export const speakingCriteria: SpeakingCriterion[] = [
  {id:"monologue",title:"MONOLOGUE / коммуникативная задача",maxScore:6,description:"Пять аспектов задания и свободная речь без чтения записей."},
  {id:"dialogue",title:"DIALOGUE / взаимодействие",maxScore:5,description:"Два вопроса, два логичных фактически верных ответа и нормы вежливости."},
  {id:"organisation",title:"ORGANISATION",maxScore:3,description:"Логичность, вступление и заключение, правильные средства связи."},
  {id:"vocabulary",title:"VOCABULARY",maxScore:2,description:"1–2 ошибки — 2; 3–4 — 1; 5 и более — 0."},
  {id:"grammar",title:"GRAMMAR",maxScore:2,description:"1–2 ошибки — 2; 3–4 — 1; 5 и более — 0."},
  {id:"pronunciation",title:"PRONUNCIATION / PHONETICS",maxScore:2,description:"1–2 ошибки — 2; 3–4 — 1; 5 и более — 0."},
];
