import { speakingCriteria } from "./criteria.ts";
import { moscowZooFactFile } from "./moscow-zoo.ts";
import type { SpeakingSet } from "./types.ts";
import {originalSpeakingSets} from "../original.ts";

const aspects=["General information and history","Areas and attractions","Educational and research work","Notable animals","Ways of getting to the zoo"];
const base={year:2022,gradeRange:[9,10,11],preparationTime:600,monologueMinTime:180,monologueMaxTime:240,qaTime:"2–3 minutes",requiredAspects:aspects,criteria:speakingCriteria};
export const zooSpeakingSets:SpeakingSet[]=[
 {...base,id:"moscow-zoo",title:"Set 1 — Moscow Zoo",location:"Moscow Zoo",source:"card_52_1668950470.pdf; file_52_1668950768.pdf",instructions:"Imagine you are a guide telling a tourist about the Moscow Zoo.",factFile:moscowZooFactFile,needsFactFile:false},
 {...base,id:"london-zoo",title:"Set 2 — London Zoo",location:"London Zoo",source:"card_52_1668950482.pdf",instructions:"Imagine you are a guide telling a tourist about London Zoo.",factFile:null,needsFactFile:true},
 {...base,id:"san-diego-zoo",title:"Set 3 — San Diego Zoo",location:"San Diego Zoo",source:"card_52_1668950501.pdf",instructions:"Imagine you are a guide telling a tourist about the San Diego Zoo.",factFile:null,needsFactFile:true},
 {...base,id:"singapore-zoo",title:"Set 4 — Singapore Zoo",location:"Singapore Zoo",source:"card_52_1668950513.pdf",instructions:"Imagine you are a guide telling a tourist about the Singapore Zoo.",factFile:null,needsFactFile:true},
];
export const speakingSets:SpeakingSet[]=[...zooSpeakingSets,...originalSpeakingSets];
