export type AdaptiveDifficulty="easy"|"medium"|"hard";
export type AdaptiveSection="use-of-english"|"reading"|"language-challenge";
export type AdaptiveType="multiple-choice"|"gap-fill"|"word-formation"|"open-cloze"|"matching"|"true-false-not-stated"|"error-spotting"|"odd-one-out";
export type AdaptiveOption={id:string;label:string};
export type AdaptiveQuestion={id:string;grade:[7,8]|9|10|11;source:"original-olympic-english-lab"|"official-vsosh-vzlet";section:AdaptiveSection;skill:string;subskill:string;difficulty:AdaptiveDifficulty;type:AdaptiveType;instruction:string;text:string;options:AdaptiveOption[];acceptedAnswers:string[];points:number;explanation:string;tags:string[];needsReview?:boolean;year?:number|null;groupId?:string;passage?:string};
const ids=(labels:string[])=>labels.map((label,i)=>({id:String.fromCharCode(97+i),label}));
export const q=(value:Omit<AdaptiveQuestion,"grade"|"source"|"points"|"options">&{options?:string[]}):AdaptiveQuestion=>({...value,grade:[7,8],source:"original-olympic-english-lab",points:1,options:ids(value.options||[])});
