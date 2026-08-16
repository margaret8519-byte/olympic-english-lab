"use client";
import {useCallback,useEffect,useRef,useState} from "react";

type SpeechState="idle"|"playing"|"paused"|"ended";
type Options={text:string;maxPlays:number;lang:string;rate:number};

function splitIntoSpeechChunks(text:string,maxLength=220){
 const sentences=text.replace(/\s+/g," ").trim().match(/[^.!?]+[.!?]+|[^.!?]+$/g)??[text];
 const chunks:string[]=[];let current="";
 for(const sentenceValue of sentences){const sentence=sentenceValue.trim();if(!sentence)continue;if(sentence.length<=maxLength){if(current&&current.length+sentence.length+1>maxLength){chunks.push(current);current=sentence}else current=current?`${current} ${sentence}`:sentence;continue}if(current){chunks.push(current);current=""}let part="";for(const word of sentence.split(" ")){if(part&&part.length+word.length+1>maxLength){chunks.push(part);part=word}else part=part?`${part} ${word}`:word}if(part)chunks.push(part)}
 if(current)chunks.push(current);return chunks;
}

function chooseEnglishVoice(voices:SpeechSynthesisVoice[]){
 const label=(voice:SpeechSynthesisVoice)=>`${voice.name} ${voice.lang}`.toLowerCase();
 return voices.find(v=>v.lang.toLowerCase()==="en-gb")
  ??voices.find(v=>label(v).includes("english uk")||label(v).includes("uk english"))
  ??voices.find(v=>v.lang.toLowerCase()==="en-us")
  ??voices.find(v=>v.lang.toLowerCase().startsWith("en")||label(v).includes("english"))
  ??null;
}

export function useSpeechAudio({text,maxPlays,lang,rate}:Options){
 const [state,setState]=useState<SpeechState>("idle");const [playsUsed,setPlaysUsed]=useState(0);
 const stateRef=useRef<SpeechState>("idle");const playsRef=useRef(0);const chunkIndexRef=useRef(0);const chunksRef=useRef<string[]>([]);const voiceRef=useRef<SpeechSynthesisVoice|null>(null);const utteranceRef=useRef<SpeechSynthesisUtterance|null>(null);const runRef=useRef(0);const activeRef=useRef(false);const pendingNextRef=useRef(false);
 const supported=typeof window==="undefined"||"speechSynthesis" in window;
 const updateState=(next:SpeechState)=>{stateRef.current=next;setState(next)};
 const loadVoices=useCallback(()=>{if(typeof window!=="undefined"&&"speechSynthesis" in window)voiceRef.current=chooseEnglishVoice(window.speechSynthesis.getVoices())},[]);

 function speakCurrentChunk(runId:number){
  if(typeof window==="undefined"||!("speechSynthesis" in window)||!activeRef.current||runRef.current!==runId)return;
  const chunk=chunksRef.current[chunkIndexRef.current];if(!chunk){activeRef.current=false;updateState("ended");return}
  const speech=new SpeechSynthesisUtterance(chunk);const voice=voiceRef.current;speech.voice=voice;speech.lang=voice?.lang||lang;speech.rate=rate;speech.pitch=1;speech.volume=1;
  speech.onend=()=>{if(!activeRef.current||runRef.current!==runId)return;chunkIndexRef.current+=1;if(chunkIndexRef.current>=chunksRef.current.length){activeRef.current=false;updateState("ended");return}if(stateRef.current==="paused"){pendingNextRef.current=true;return}speakCurrentChunk(runId)};
  speech.onerror=event=>{if(!activeRef.current||runRef.current!==runId||event.error==="canceled"||event.error==="interrupted")return;activeRef.current=false;updateState("idle");console.error("[Listening] speech error:",event.error)};
  utteranceRef.current=speech;window.speechSynthesis.speak(speech);
 }

 function startFromBeginning(){
  if(typeof window==="undefined"||!("speechSynthesis" in window)||playsRef.current>=maxPlays)return;
  const synth=window.speechSynthesis;loadVoices();activeRef.current=false;runRef.current+=1;synth.cancel();chunksRef.current=splitIntoSpeechChunks(text);chunkIndexRef.current=0;pendingNextRef.current=false;playsRef.current+=1;setPlaysUsed(playsRef.current);activeRef.current=true;updateState("playing");speakCurrentChunk(runRef.current);
 }

 function toggle(){
  if(typeof window==="undefined"||!("speechSynthesis" in window))return;const synth=window.speechSynthesis;
  if(stateRef.current==="playing"){synth.pause();updateState("paused");return}
  if(stateRef.current==="paused"){updateState("playing");if(pendingNextRef.current||!synth.speaking){pendingNextRef.current=false;speakCurrentChunk(runRef.current)}else synth.resume();return}
  startFromBeginning();
 }

 function restart(){startFromBeginning()}
 useEffect(()=>{if(typeof window==="undefined"||!("speechSynthesis" in window))return;const synth=window.speechSynthesis;loadVoices();synth.addEventListener("voiceschanged",loadVoices);return()=>{activeRef.current=false;runRef.current+=1;synth.removeEventListener("voiceschanged",loadVoices);synth.cancel();utteranceRef.current=null}},[loadVoices]);
 return{state,remaining:Math.max(0,maxPlays-playsUsed),supported,toggle,restart};
}
