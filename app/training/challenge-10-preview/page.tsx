"use client";
/* eslint-disable react-hooks/set-state-in-effect -- restore local draft only after hydration */

import Link from "next/link";
import {useEffect,useMemo,useRef,useState} from "react";
import {ArrowLeft,ArrowRight,BookOpen,CheckCircle2,Headphones,Pause,Play,RefreshCcw,Trophy,FileText} from "lucide-react";
import {useProfile} from "@/components/ProfileBadge";
import {challenge10} from "@/data/challenge-10-preview";
import styles from "./preview.module.css";

type SavedState={answers:Record<string,string>;title:string;story:string;section:number;completed:boolean};
const initial:SavedState={answers:{},title:"",story:"",section:0,completed:false};
const sections=["Listening","Reading","Use of English","Writing"] as const;
const norm=(v:string)=>v.trim().toLocaleLowerCase("en").replace(/[’‘]/g,"'").replace(/\s+/g," ").replace(/[.!?]+$/g,"");
const wordCount=(v:string)=>v.trim()?v.trim().split(/\s+/).length:0;
const oneUse=(a:number,b:number)=>[[7,13],[21,27],[28,33],[46,50],[56,60]].some(([x,y])=>a===x&&b===y);
function choices(n:number):string[]{
  if(n<=6)return ["A","B","C","D"];
  if(n<=13)return ["A","B","C","D","E","F","G","H"];
  if(n<=20)return ["T","F"];
  if(n<=27)return ["I","II","III","IV","V","VI","VII","VIII"];
  if(n<=33)return ["A","B","C","D","E","F","G"];
  if(n<=40)return ["T","F","NG"];
  if(n<=45)return [];
  if(n<=50)return ["A","B","C","D","E","F","G","H"];
  if(n<=55)return [];
  return ["A","B","C","D","E","F","G"];
}
function Rich({body}:{body:string}){
  const blocks=body.trim().split(/\n\s*\n/).filter(Boolean);
  return <div className={styles.rich}>{blocks.map((block,bi)=><div key={bi} className={styles.richBlock}>{block.split("\n").map((line,li)=><div key={li} className={/^([A-H]|[IVX]+)\.\s/.test(line)?styles.choiceLine:undefined}>{line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part,i)=>part.startsWith("**")&&part.endsWith("**")?<strong key={i}>{part.slice(2,-2)}</strong>:part.startsWith("*")&&part.endsWith("*")?<em key={i}>{part.slice(1,-1)}</em>:part)}</div>)}</div>)}</div>
}
function AudioDemo({index}:{index:number}){
  const [playing,setPlaying]=useState(false);
  const [available,setAvailable]=useState(true);
  const [reveal,setReveal]=useState(false);
  const token=useRef(0);
  const script=challenge10.scripts[index];
  useEffect(()=>()=>{token.current++;if(typeof window!=="undefined")window.speechSynthesis?.cancel()},[]);
  function stop(){token.current++;window.speechSynthesis?.cancel();setPlaying(false)}
  function play(){
    if(!("speechSynthesis" in window)){setAvailable(false);return}
    stop(); const run=++token.current; const voices=window.speechSynthesis.getVoices();
    const preferred=voices.filter(v=>v.lang.toLowerCase().startsWith("en-gb"));
    const fallback=voices.filter(v=>v.lang.toLowerCase().startsWith("en"));
    const pool=preferred.length?preferred:fallback;
    const paragraphs=script.text.replace(/\*\*/g,"").split(/\n\s*\n/).filter(Boolean);
    const speech:{value:string;voice:number}[]=[];
    for(const paragraph of paragraphs){
      if(paragraph.startsWith("CAST:"))continue;
      const voice=/^(MAYA|SPEAKER [2-7]):/.test(paragraph)?1:0;
      const sentences=paragraph.split(/(?<=[.!?])\s+(?=[A-Z"'“])/);
      let buffer="";
      for(const sentence of sentences){
        if(buffer.length+sentence.length>185&&buffer){speech.push({value:buffer,voice});buffer=""}
        buffer+=(buffer?" ":"")+sentence;
      }
      if(buffer)speech.push({value:buffer,voice});
    }
    let at=0;setPlaying(true);
    function next(){
      if(run!==token.current)return;
      if(at>=speech.length){setPlaying(false);return}
      const item=speech[at++];
      const utter=new SpeechSynthesisUtterance(item.value);
      utter.lang="en-GB";utter.rate=0.92;utter.pitch=item.voice?1.08:0.97;
      if(pool.length)utter.voice=pool[item.voice%pool.length];
      utter.onend=next;utter.onerror=()=>{if(run===token.current){setPlaying(false)}};
      window.speechSynthesis.speak(utter);
    }
    next();
  }
  return <div className={styles.audio}>
    <div className={styles.audioTop}><Headphones size={19}/><div><b>Recording {index+1}</b><small>Демо-озвучка браузера · запись прослушивается по нажатию</small></div></div>
    <div className={styles.audioActions}>
      <button type="button" onClick={playing?stop:play}>{playing?<><Pause size={17}/> Остановить</>:<><Play size={17}/> Прослушать</>}</button>
      <button type="button" onClick={()=>setReveal(!reveal)}><FileText size={16}/>{reveal?"Скрыть скрипт":"Показать скрипт"}</button>
    </div>
    {!available&&<p className={styles.alert}>В этом браузере недоступна встроенная озвучка. Откройте скрипт для ознакомления.</p>}
    {reveal&&<div className={styles.transcript}><Rich body={script.text}/></div>}
  </div>;
}
function AnswerControls({from,to,answers,onAnswer}:{from:number;to:number;answers:Record<string,string>;onAnswer:(n:number,v:string)=>void}){
  const values=Array.from({length:to-from+1},(_,i)=>from+i);
  const restrict=oneUse(from,to);
  return <div className={styles.answerControls}>{values.map(n=>{
    const options=choices(n),value=answers[n]||"";
    return <label className={styles.answerRow} key={n}>
      <span className={styles.answerNum}>{n}</span>
      {options.length?<select value={value} aria-label={"Ответ на вопрос "+n} onChange={e=>onAnswer(n,e.target.value)}>
        <option value="">— Выбрать —</option>
        {options.map(option=><option key={option} value={option} disabled={restrict&&values.some(other=>other!==n&&answers[other]===option)}>{option}</option>)}
      </select>:<input value={value} aria-label={"Ответ на вопрос "+n} placeholder={n>=51?"2–5 words":"One word"} onChange={e=>onAnswer(n,e.target.value)}/>}
    </label>;
  })}</div>
}
export default function Grade10Preview(){
 const profile=useProfile();
 const identity=[profile.firstName,profile.lastName,profile.grade,profile.classLetter].map(x=>String(x||"").trim().toLowerCase()).join("|");
 const storageKey="olympic-preview-challenge10-v1:"+identity;
 const [state,setState]=useState<SavedState>(initial);
 const [loadedKey,setLoadedKey]=useState("");
 useEffect(()=>{let current=initial;try{const json=localStorage.getItem(storageKey);if(json){const saved=JSON.parse(json) as Partial<SavedState>;current={answers:saved.answers||{},title:saved.title||"",story:saved.story||"",section:Math.min(3,Math.max(0,saved.section||0)),completed:!!saved.completed}}}catch{}setState(current);setLoadedKey(storageKey)},[storageKey]);
 useEffect(()=>{if(loadedKey===storageKey){try{localStorage.setItem(storageKey,JSON.stringify(state))}catch{}}},[loadedKey,storageKey,state]);
 const answered=Object.keys(state.answers).filter(key=>Number(key)>=1&&Number(key)<=60&&!!String(state.answers[key]).trim()).length;
 const count=wordCount(state.title)+wordCount(state.story);
 const section=state.section;
 const rows=challenge10.sections[section].tasks;
 const score=useMemo(()=>Array.from({length:60},(_,i)=>i+1).reduce((sum,n)=>sum+(norm(state.answers[n]||"")===norm(String(challenge10.keys[String(n) as keyof typeof challenge10.keys]))?1:0),0),[state.answers]);
 const categoryScore=(start:number)=>Array.from({length:20},(_,i)=>i+start).reduce((sum,n)=>sum+(norm(state.answers[n]||"")===norm(String(challenge10.keys[String(n) as keyof typeof challenge10.keys]))?1:0),0);
 function answer(n:number,value:string){setState(s=>({...s,answers:{...s.answers,[n]:value}}))}
 function changeSection(next:number){setState(s=>({...s,section:next}));window.scrollTo({top:0,behavior:"smooth"})}
 function restart(){if(window.confirm("Начать этот же демонстрационный вариант сначала? Сохранённые ответы будут очищены.")){setState(initial);window.scrollTo({top:0})}}
 if(loadedKey!==storageKey)return <main className={styles.preview}>Загружаем тренировку…</main>;
 return <main className={styles.preview}>
  <div className={styles.back}><Link href="/dashboard"><ArrowLeft size={17}/> В кабинет</Link><span>OLYMPIC ENGLISH LAB / DEMO</span></div>
  <header className={styles.hero}>
    <div className={styles.heroCopy}><span className={styles.kicker}>GRADE 10 • MUNICIPAL-STAGE STYLE • B2–B2+</span><h1>The Stories<br/><em>We Leave Behind</em></h1><p>Полноценный авторский олимпиадный вариант: 60 заданий, три скрипта аудирования и творческое Writing. Это не официальная работа «Взлёта».</p><div className={styles.pills}><span>120 минут</span><span>60 заданий</span><span>Writing: +20 баллов</span><span>Черновик для проверки</span></div></div>
    <div className={styles.heroStat}><Trophy size={35}/><strong>{answered}<span>/60</span></strong><small>ответов заполнено</small><div className={styles.track}><div style={{width:answered/60*100+"%"}}/></div></div>
  </header>
  <div className={styles.notice}><CheckCircle2 size={19}/> Это один фиксированный пробный вариант, а не бесконечный генератор. Ответы сохраняются в текущем браузере отдельно для каждого профиля. В Listening используется синтез речи браузера; полноценные аудиозаписи будут добавлены позже.</div>
  <div className={styles.tabs}>{sections.map((name,i)=><button key={name} className={section===i?styles.tabActive:""} onClick={()=>changeSection(i)}><span>0{i+1}</span>{name}<small>{i===3?count+" слов":Object.keys(state.answers).filter(k=>+k>=i*20+1&&+k<=i*20+20&&state.answers[k]?.trim()).length+"/20"}</small></button>)}</div>
  {state.completed?<section className={styles.results}>
    <Trophy size={37}/><h2>Результат тренировочного варианта</h2><p className={styles.score}>{score}<span> / 60</span></p><p>Это автоматический результат по Listening, Reading и Use of English. Writing оценивает учитель отдельно (до 20 баллов). Максимум всей работы — 80 баллов.</p>
    <div className={styles.resultGrid}>{(["Listening","Reading","Use of English"] as const).map((name,i)=><div key={name}><small>{name}</small><strong>{categoryScore(i*20+1)} / 20</strong></div>)}</div>
    <details className={styles.keyDetails}><summary>Посмотреть ответы и сравнить с ключом</summary><div className={styles.checkGrid}>{Array.from({length:60},(_,i)=>{const n=i+1,correct=String(challenge10.keys[String(n) as keyof typeof challenge10.keys]),given=state.answers[n]||"";return <div key={n} className={norm(given)===norm(correct)?styles.correct:styles.incorrect}><b>{n}.</b> {given||"—"} <span>→ {correct}</span></div>})}</div></details>
    <div className={styles.navButtons}><button onClick={()=>setState(s=>({...s,completed:false,section:3}))}>Вернуться к Writing</button><button onClick={restart}><RefreshCcw size={16}/> Пройти этот вариант заново</button></div>
  </section>:<div className={styles.mainGrid}>
    <article className={styles.tasks}>
      <div className={styles.sectionTitle}><span>SECTION 0{section+1}</span><h2>{sections[section]}</h2><p>{section===0?"Listen to each recording twice and answer the questions.":section===1?"Read closely. Some questions require inference and distinguishing facts from missing information.":section===2?"Pay attention to meaning, word formation, grammar and British cultural heritage.":"Write an original competition story with all compulsory features."}</p></div>
      {!!challenge10.sections[section].intro&&<Rich body={challenge10.sections[section].intro}/>}
      {rows.map((task,i)=><section className={styles.taskCard} key={task.title}>
        <div className={styles.taskHead}><span>TASK {i+1}</span><h3>{task.title.replace(/\s*\(Questions.*\)/,"")}</h3></div>
        {section===0&&<AudioDemo index={i}/>}
        <Rich body={task.body}/>
        {task.from>0&&<div className={styles.inlineAnswers}><h4>Ваши ответы · {task.from}–{task.to}</h4><AnswerControls from={task.from} to={task.to} answers={state.answers} onAnswer={answer}/></div>}
        {section===3&&<div className={styles.writing}>
          <label>Title<input value={state.title} onChange={e=>setState(s=>({...s,title:e.target.value}))} placeholder="Your story title"/></label>
          <label>Your story<textarea rows={16} value={state.story} onChange={e=>setState(s=>({...s,story:e.target.value}))} placeholder="At first, I thought the letter had been sent to the wrong address."/></label>
          <div className={count>=180&&count<=250?styles.wordGood:styles.wordWarning}><b>{count} words</b> · Требуется 180–250 слов, включая заголовок. Идиомы и фразовые глаголы выделяйте подчёркиванием с помощью _..._.</div>
        </div>}
      </section>)}
      <div className={styles.navButtons}>
        <button onClick={()=>changeSection(Math.max(0,section-1))} disabled={section===0}><ArrowLeft size={16}/> Назад</button>
        {section<3?<button className={styles.next} onClick={()=>changeSection(section+1)}>Следующий раздел <ArrowRight size={16}/></button>:<button className={styles.next} onClick={()=>{setState(s=>({...s,completed:true}));window.scrollTo({top:0})}}>Посмотреть результат <Trophy size={16}/></button>}
      </div>
    </article>
    <aside className={styles.sidebar}><div className={styles.sideCard}><h3><BookOpen size={17}/> Навигация</h3><p>Ответы сохраняются автоматически. Можно возвращаться к разделам и исправлять их до просмотра результата.</p><div className={styles.progressBig}>{answered}/60 <span>вопросов заполнено</span></div><div className={styles.track}><div style={{width:answered/60*100+"%"}}/></div>{sections.map((s,i)=><button className={section===i?styles.sideSelected:""} key={s} onClick={()=>changeSection(i)}>{s}<ArrowRight size={15}/></button>)}</div><div className={styles.sideNote}><b>Writing</b><p>Текст сохраняется только на этом устройстве. Автоматическая проверка не заменяет оценку учителя.</p></div></aside>
  </div>}
  <footer className={styles.footer}>OLYMPIC ENGLISH LAB · Original training material · Not an official Vzlyot examination · Demo 01</footer>
 </main>;
}
