import {officialMeta,type QuestionBankItem,type Section} from "../../types.ts";
export function item(section:Section,data:Omit<QuestionBankItem,keyof typeof officialMeta|"section">):QuestionBankItem{return{...officialMeta,section,...data}}
export const neutralExplanation="Ответ подтверждён официальным ключом.";
