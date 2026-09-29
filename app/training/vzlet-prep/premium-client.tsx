"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Check,
  Film,
  Map,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  Volume2,
  X,
} from "lucide-react";
import { AppHeader } from "@/components/Brand";
import {
  type VzletCard,
  type VzletGradeKey,
  type VzletQuestion,
  type VzletStage,
  vzletPrepData,
} from "@/data/vzlet-prep";
import styles from "./premium.module.css";

type StageFilter = "all" | VzletStage;
type Mode = "idioms" | "film" | "culture" | "mixed" | "mistakes";

type Evidence = {
  code: string;
  title: string;
  kicker: string;
  clues: string[];
  footer: string;
  tone: "violet" | "blue" | "mint" | "amber" | "coral";
};

const gradeOrder: VzletGradeKey[] = ["7-8", "9-10", "11"];

const stageTitle: Record<StageFilter, string> = {
  all: "Все темы",
  school: "Школьный этап",
  municipal: "Муниципальный этап",
};

const advancedQuestions: Record<VzletGradeKey, VzletQuestion[]> = {
  "7-8": [
    { id: "p78-film-1", stage: "school", tag: "Animated films", prompt: "Which clue set points to Coco rather than Soul?", options: ["Jazz pianist · New York · life purpose", "Family memories · music · Land of the Dead", "Sea voyage · island tradition · ocean", "Old man · floating house · balloons"], answer: 1, explanation: "Coco combines music, family memory and the Land of the Dead." },
    { id: "p78-film-2", stage: "school", tag: "Animated films", prompt: "A film combines Paris, cooking and an unlikely tiny expert. Which title fits all three clues?", options: ["Ratatouille", "Luca", "Elemental", "Up"], answer: 0, explanation: "Ratatouille centres on Remy, Paris and professional cooking." },
    { id: "p78-film-3", stage: "school", tag: "Animated films", prompt: "Which pair belongs to the same film world?", options: ["Hiccup — Toothless", "Miguel — Lightning McQueen", "Remy — Shrek", "Riley — Moana"], answer: 0, explanation: "Hiccup and Toothless are central to How to Train Your Dragon." },
    { id: "p78-usa-1", stage: "municipal", tag: "USA", prompt: "Which state — capital — nickname line is completely correct?", options: ["California — Los Angeles — Golden State", "Texas — Austin — Lone Star State", "Florida — Miami — Sunshine State", "Washington — Seattle — Evergreen State"], answer: 1, explanation: "Texas — Austin — Lone Star State is the only fully correct line." },
    { id: "p78-usa-2", stage: "municipal", tag: "USA", prompt: "A student confuses the largest city with the capital. Which correction is right?", options: ["New York State: New York City → Albany", "Illinois: Springfield → Chicago", "Washington: Olympia → Seattle", "Nevada: Carson City → Las Vegas"], answer: 0, explanation: "Albany, not New York City, is the capital of New York State." },
    { id: "p78-usa-3", stage: "municipal", tag: "USA", prompt: "Which two state nicknames are matched correctly?", options: ["Florida — Sunshine State; Texas — Lone Star State", "Alaska — Golden State; Hawaii — Evergreen State", "California — Aloha State; Oregon — Silver State", "Nevada — Peach State; Georgia — Beaver State"], answer: 0, explanation: "Florida is the Sunshine State and Texas is the Lone Star State." },
  ],
  "9-10": [
    { id: "p910-film-1", stage: "school", tag: "Soundtracks", prompt: "Which option contains two films scored by the same composer?", options: ["Interstellar + Inception", "Jurassic Park + The Hobbit", "Dune + Men in Black", "Avatar + Back to the Future"], answer: 0, explanation: "Hans Zimmer composed both Interstellar and Inception." },
    { id: "p910-film-2", stage: "school", tag: "Soundtracks", prompt: "Which composer–film pairing is incorrect?", options: ["John Williams — Jurassic Park", "Howard Shore — The Hobbit: An Unexpected Journey", "Klaus Badelt — Pirates of the Caribbean: The Curse of the Black Pearl", "Danny Elfman — Interstellar"], answer: 3, explanation: "Interstellar was composed by Hans Zimmer, not Danny Elfman." },
    { id: "p910-film-3", stage: "school", tag: "Soundtracks", prompt: "You hear an organ-centred, expansive sci-fi score. Which film is the strongest match?", options: ["Interstellar", "Men in Black", "Back to the Future", "Jurassic Park"], answer: 0, explanation: "Interstellar is strongly associated with Hans Zimmer's organ-centred score." },
    { id: "p910-film-4", stage: "school", tag: "Soundtracks", prompt: "Which sequence correctly matches film → composer?", options: ["Dune → Hans Zimmer; The Hobbit → Howard Shore", "Dune → John Williams; The Hobbit → James Horner", "Inception → Danny Elfman; Avatar → Hans Zimmer", "Jurassic Park → Klaus Badelt; Men in Black → Howard Shore"], answer: 0, explanation: "Dune is by Hans Zimmer; The Hobbit: An Unexpected Journey is by Howard Shore." },
    { id: "p910-gb-1", stage: "municipal", tag: "Great Britain", prompt: "Which statement most accurately distinguishes Great Britain from the United Kingdom?", options: ["Great Britain includes Northern Ireland, while the UK does not", "Great Britain is England, Scotland and Wales; the UK also includes Northern Ireland", "Great Britain and the UK are always exact synonyms", "The UK includes the Republic of Ireland"], answer: 1, explanation: "Great Britain is the island containing England, Scotland and Wales; the UK also includes Northern Ireland." },
    { id: "p910-gb-2", stage: "municipal", tag: "Great Britain", prompt: "Which country — capital — clue line is fully correct?", options: ["Scotland — Edinburgh — northern part of Great Britain", "Wales — Belfast — western part of Great Britain", "Northern Ireland — Cardiff — island of Ireland", "England — Glasgow — largest UK country"], answer: 0, explanation: "Scotland — Edinburgh — northern part of Great Britain is fully correct." },
    { id: "p910-gb-3", stage: "municipal", tag: "Great Britain", prompt: "A traveller goes from Cardiff to Edinburgh. Which two countries are involved?", options: ["England and Scotland", "Wales and Scotland", "Wales and Northern Ireland", "England and Wales"], answer: 1, explanation: "Cardiff is in Wales and Edinburgh is in Scotland." },
    { id: "p910-gb-4", stage: "municipal", tag: "Great Britain", prompt: "Which sentence contains a geographical error?", options: ["Ben Nevis is in Scotland", "The English Channel separates southern England from northern France", "The North Sea lies east of Great Britain", "Belfast is on the island of Great Britain"], answer: 3, explanation: "Belfast is in Northern Ireland, on the island of Ireland, not Great Britain." },
    { id: "p910-gb-5", stage: "municipal", tag: "Great Britain", prompt: "Which route description is correct?", options: ["London → Cardiff means England → Wales", "Edinburgh → Belfast means Wales → Northern Ireland", "Cardiff → London means Scotland → England", "Belfast → Edinburgh means England → Scotland"], answer: 0, explanation: "London is in England; Cardiff is in Wales." },
    { id: "p910-gb-6", stage: "municipal", tag: "Great Britain", prompt: "Which pair contains only UK capitals?", options: ["Edinburgh and Cardiff", "Glasgow and Manchester", "Liverpool and Belfast", "Oxford and London"], answer: 0, explanation: "Edinburgh and Cardiff are national capitals within the UK." },
    { id: "p910-gb-7", stage: "municipal", tag: "Great Britain", prompt: "Which correction best fixes the claim ‘Northern Ireland is part of Great Britain’?", options: ["Northern Ireland is part of the UK but not Great Britain", "Northern Ireland is part of Great Britain but not the UK", "Northern Ireland is part of the Republic of Ireland", "Northern Ireland is an independent state"], answer: 0, explanation: "Northern Ireland belongs to the United Kingdom, but Great Britain refers to England, Scotland and Wales." },
  ],
  "11": [
    { id: "p11-film-1", stage: "school", tag: "Soundtracks", prompt: "Which pair correctly matches a film with its composer?", options: ["The Matrix — Don Davis", "Dune — John Williams", "Avatar — Danny Elfman", "Interstellar — James Horner"], answer: 0, explanation: "Don Davis composed the score for The Matrix." },
    { id: "p11-film-2", stage: "school", tag: "Soundtracks", prompt: "Which two titles are associated with Hans Zimmer?", options: ["Dune and Interstellar", "Avatar and The Matrix", "Men in Black and Spider-Man", "Jurassic Park and The Hobbit"], answer: 0, explanation: "Hans Zimmer composed both Dune and Interstellar." },
    { id: "p11-hist-1", stage: "municipal", tag: "British history", prompt: "Which sequence is in the correct chronological order?", options: ["Magna Carta → Wars of the Roses → Act of Supremacy → Glorious Revolution", "Wars of the Roses → Magna Carta → Restoration → Act of Supremacy", "Act of Supremacy → Norman Conquest → Restoration → Armada", "Glorious Revolution → Restoration → Magna Carta → Norman Conquest"], answer: 0, explanation: "1215 → 1455–1487 → 1534 → 1688 is the correct order." },
    { id: "p11-hist-2", stage: "municipal", tag: "British history", prompt: "Which event is most directly linked with 1215?", options: ["Magna Carta", "The Restoration", "The Spanish Armada", "The Act of Supremacy"], answer: 0, explanation: "Magna Carta was sealed in 1215." },
    { id: "p11-hist-3", stage: "municipal", tag: "British history", prompt: "Which event marks the beginning of Tudor rule?", options: ["Battle of Bosworth and Henry VII's accession", "Execution of Charles I", "The Glorious Revolution", "The Norman Conquest"], answer: 0, explanation: "Henry VII's victory at Bosworth in 1485 began the Tudor dynasty." },
    { id: "p11-hist-4", stage: "municipal", tag: "British history", prompt: "Which pair is correctly linked?", options: ["1534 — Act of Supremacy", "1649 — Restoration", "1660 — Glorious Revolution", "1689 — Norman Conquest"], answer: 0, explanation: "The Act of Supremacy dates to 1534." },
    { id: "p11-hist-5", stage: "municipal", tag: "British history", prompt: "Which statement best explains the significance of 1603?", options: ["James VI of Scotland also became James I of England", "Parliament executed Charles I", "William the Conqueror won at Hastings", "The monarchy was restored"], answer: 0, explanation: "1603 brought the Union of the Crowns under James VI/I." },
    { id: "p11-hist-6", stage: "municipal", tag: "British history", prompt: "Which event followed the execution of Charles I but came before the Glorious Revolution?", options: ["The Restoration", "The Norman Conquest", "Magna Carta", "The Spanish Armada"], answer: 0, explanation: "Charles I was executed in 1649; the Restoration followed in 1660; the Glorious Revolution came in 1688." },
  ],
};

function gradeFromProfile(grade: number): VzletGradeKey {
  if (grade >= 11) return "11";
  if (grade >= 9) return "9-10";
  return "7-8";
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function isFilm(question: VzletQuestion) {
  return question.tag === "Animated films" || question.tag === "Soundtracks";
}

function isCulture(question: VzletQuestion) {
  return question.tag === "USA" || question.tag === "Great Britain" || question.tag === "British history";
}

function modeName(mode: Mode, grade: VzletGradeKey) {
  if (mode === "idioms") return "Idioms Lab";
  if (mode === "film") return grade === "7-8" ? "Film Detective" : "Score & Composer";
  if (mode === "culture") return grade === "7-8" ? "USA Intelligence" : grade === "9-10" ? "Britain Atlas" : "History Timeline";
  if (mode === "mistakes") return "Error Review";
  return "Olympiad Mix";
}

function modeSubtitle(mode: Mode, grade: VzletGradeKey, mistakes: number) {
  if (mode === "idioms") return "context • nuance • distractors";
  if (mode === "film") return grade === "7-8" ? "plot clues • characters • recognition" : "composer • score language • comparison";
  if (mode === "culture") {
    if (grade === "7-8") return "state • capital • nickname • clue";
    if (grade === "9-10") return "countries • capitals • geography • logic";
    return "chronology • cause • event • monarch";
  }
  if (mode === "mistakes") return `${mistakes} saved for targeted review`;
  return "mixed olympiad-style reasoning";
}

function evidenceFor(question: VzletQuestion): Evidence {
  if (question.tag === "Soundtracks") return { code: "SC", title: "Score intelligence", kicker: "Listen with your eyes", clues: question.id.includes("gb") ? ["composer", "motif", "era"] : ["texture", "composer", "film"], footer: "Use musical fingerprints, not title recognition.", tone: "violet" };
  if (question.tag === "Great Britain") return { code: "GB", title: "Atlas evidence", kicker: "Country ≠ island ≠ state", clues: ["place", "capital", "relationship"], footer: "Check the geography before choosing the label.", tone: "blue" };
  if (question.tag === "USA") return { code: "US", title: "State file", kicker: "Three facts must agree", clues: ["state", "capital", "nickname"], footer: "One wrong element makes the whole option false.", tone: "amber" };
  if (question.tag === "British history") return { code: "HX", title: "Timeline evidence", kicker: "Order before detail", clues: ["date", "event", "consequence"], footer: "Anchor the century first, then test the event.", tone: "coral" };
  if (question.tag === "Animated films") return { code: "FD", title: "Film detective", kicker: "Plot, not poster", clues: ["setting", "character", "turning point"], footer: "Match the whole clue set, not one familiar word.", tone: "mint" };
  return { code: "ID", title: "Context evidence", kicker: "Meaning lives in the sentence", clues: ["tone", "grammar", "meaning"], footer: "Eliminate options that fit only literally.", tone: "violet" };
}

function topicName(tag: string) {
  if (tag === "Idioms") return "Idioms";
  if (tag === "Soundtracks") return "Film soundtracks";
  if (tag === "Animated films") return "Animated films";
  if (tag === "USA") return "USA";
  if (tag === "Great Britain") return "Great Britain";
  if (tag === "British history") return "British history";
  return tag;
}

function flashSides(card: VzletCard) {
  const parts = card.front.split(" — ");
  if (parts.length > 1) return { front: parts[0], answer: parts.slice(1).join(" — "), detail: card.back };
  return { front: card.front, answer: card.back, detail: "" };
}

export default function PremiumVzletPrep() {
  const [gradeKey, setGradeKey] = useState<VzletGradeKey>("7-8");
  const [stage, setStage] = useState<StageFilter>("all");
  const [mode, setMode] = useState<Mode>("idioms");
  const [quiz, setQuiz] = useState<VzletQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [mistakes, setMistakes] = useState<string[]>([]);
  const [wrongTags, setWrongTags] = useState<string[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    try {
      const profile = JSON.parse(localStorage.getItem("studentProfile") || "null") as { grade?: string } | null;
      if (profile?.grade) setGradeKey(gradeFromProfile(Number(profile.grade)));
    } catch {}
  }, []);

  useEffect(() => {
    try { setMistakes(JSON.parse(localStorage.getItem(`vzletPrepMistakes2026:${gradeKey}`) || "[]")); }
    catch { setMistakes([]); }
  }, [gradeKey]);

  const group = vzletPrepData[gradeKey];
  const baseByStage = useMemo(() => group.questions.filter((q) => stage === "all" || q.stage === stage), [group, stage]);
  const premiumByStage = useMemo(() => advancedQuestions[gradeKey].filter((q) => stage === "all" || q.stage === stage), [gradeKey, stage]);
  const stageCards = useMemo(() => group.cards.filter((card) => stage === "all" || card.stage === stage), [group, stage]);

  const availableModes = useMemo(() => {
    const items: Mode[] = ["idioms"];
    if (stage === "all" || stage === "school") items.push("film");
    if (stage === "all" || stage === "municipal") items.push("culture");
    if (mistakes.length) items.push("mistakes");
    items.push("mixed");
    return items;
  }, [stage, mistakes.length]);

  const studyCards = useMemo(() => {
    if (mode === "culture") return stageCards.filter((card) => ["USA", "Great Britain", "British history"].includes(card.tag));
    if (mode === "film") return stageCards.filter((card) => card.tag === "Soundtracks");
    if (mode === "idioms") return stageCards.filter((card) => !["USA", "Great Britain", "British history", "Soundtracks"].includes(card.tag));
    return stageCards;
  }, [mode, stageCards]);

  const active = quiz[index];
  const evidence = active ? evidenceFor(active) : null;
  const card = studyCards.length ? studyCards[cardIndex % studyCards.length] : null;
  const cardView = card ? flashSides(card) : null;
  const percent = quiz.length ? Math.round((score / quiz.length) * 100) : 0;
  const progress = quiz.length ? ((index + (selected !== null ? 1 : 0)) / quiz.length) * 100 : 0;
  const repeatTopics = wrongTags.slice(0, 2).map(topicName);

  function saveMistakes(next: string[]) {
    setMistakes(next);
    try { localStorage.setItem(`vzletPrepMistakes2026:${gradeKey}`, JSON.stringify(next)); } catch {}
  }

  function questionsFor(nextMode: Mode) {
    const idioms = baseByStage.filter((q) => q.tag === "Idioms");
    const challenge = premiumByStage.length ? premiumByStage : baseByStage.filter((q) => isFilm(q) || isCulture(q));
    if (nextMode === "idioms") return idioms;
    if (nextMode === "film") return challenge.filter(isFilm);
    if (nextMode === "culture") return challenge.filter(isCulture);
    if (nextMode === "mistakes") return [...baseByStage, ...challenge].filter((q) => mistakes.includes(q.id));
    return [...idioms, ...challenge];
  }

  function start(nextMode: Mode) {
    setMode(nextMode);
    const source = questionsFor(nextMode);
    setQuiz(shuffle(source).slice(0, Math.min(8, source.length)));
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setWrongTags([]);
    setCardIndex(0);
    setShowAnswer(false);
  }

  useEffect(() => {
    const nextMode: Mode = stage === "municipal" && mode === "film" ? "culture" : stage === "school" && mode === "culture" ? "film" : mode;
    start(nextMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradeKey, stage]);

  function choose(optionIndex: number) {
    if (!active || selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === active.answer) {
      setScore((value) => value + 1);
      if (mistakes.includes(active.id)) saveMistakes(mistakes.filter((id) => id !== active.id));
    } else {
      if (!mistakes.includes(active.id)) saveMistakes([...mistakes, active.id]);
      setWrongTags((tags) => tags.includes(active.tag) ? tags : [...tags, active.tag]);
    }
  }

  function nextQuestion() {
    if (index + 1 >= quiz.length) { setFinished(true); return; }
    setIndex((value) => value + 1);
    setSelected(null);
  }

  return (
    <main className={styles.page}>
      <AppHeader />
      <div className={styles.shell}>
        <div className={styles.topbar}>
          <Link href="/dashboard"><ArrowLeft size={17} /> В кабинет</Link>
          <span><Sparkles size={14} /> VZLET PREP · OLYMPIAD MODE</span>
        </div>

        <section className={styles.hero}>
          <div>
            <small>SMART PREP · 2026</small>
            <h1>Олимпиадная подготовка к «Взлёту»</h1>
            <p>Не угадывание по картинке, а работа с признаками: контекст, логика, исключение distractors и точные факты.</p>
          </div>
          <div className={styles.heroPanel}>
            <span>YOUR TRACK</span>
            <b>{group.label}</b>
            <p>{group.subtitle}</p>
            <div><i /> evidence-based practice</div>
          </div>
        </section>

        <section className={styles.controls}>
          <div className={styles.controlBlock}>
            <small>01 · CLASS</small>
            <div>{gradeOrder.map((key) => <button key={key} className={gradeKey === key ? styles.active : ""} onClick={() => setGradeKey(key)}>{vzletPrepData[key].label}</button>)}</div>
          </div>
          <div className={styles.controlBlock}>
            <small>02 · STAGE</small>
            <div>{(["all", "school", "municipal"] as StageFilter[]).map((key) => <button key={key} className={stage === key ? styles.active : ""} onClick={() => setStage(key)}>{stageTitle[key]}</button>)}</div>
          </div>
        </section>

        <section className={styles.modeSection}>
          <div className={styles.sectionTitle}><div><small>03 · TRAINING MODE</small><h2>Выбери, что прокачать</h2></div><p>Каждый режим тренирует отдельный тип олимпиадного мышления.</p></div>
          <div className={styles.modeGrid}>
            {availableModes.map((item, order) => {
              const Icon = item === "idioms" ? Brain : item === "film" ? Film : item === "culture" ? Map : item === "mistakes" ? RotateCcw : Target;
              return <button key={item} className={`${styles.modeCard} ${mode === item ? styles.modeActive : ""}`} onClick={() => start(item)}>
                <div className={styles.modeTop}><span>0{order + 1}</span><Icon /></div>
                <b>{modeName(item, gradeKey)}</b>
                <p>{modeSubtitle(item, gradeKey, mistakes.length)}</p>
                <em>Start round <ArrowRight size={14} /></em>
              </button>;
            })}
          </div>
        </section>

        <section className={styles.workspace}>
          <div className={styles.quizPanel}>
            <div className={styles.quizHeader}>
              <div><small>ACTIVE ROUND</small><h2>{modeName(mode, gradeKey)}</h2></div>
              {!!quiz.length && !finished && <span>{String(index + 1).padStart(2, "0")} / {String(quiz.length).padStart(2, "0")}</span>}
            </div>
            {!!quiz.length && !finished && <div className={styles.progress}><span style={{ width: `${progress}%` }} /></div>}

            {!quiz.length && <div className={styles.empty}><Target /><h3>Для этого режима пока нет вопросов</h3><p>Выбери другой этап или тренировку.</p></div>}

            {!!quiz.length && !finished && active && evidence && <>
              <div className={styles.questionGrid}>
                <div className={`${styles.evidence} ${styles[`tone_${evidence.tone}`]}`}>
                  <div className={styles.evidenceHead}><span>{evidence.code}</span><small>{evidence.kicker}</small></div>
                  <h3>{evidence.title}</h3>
                  <div className={styles.signal}><i/><i/><i/><i/><i/><i/><i/><i/></div>
                  <div className={styles.clues}>{evidence.clues.map((clue, clueIndex) => <div key={clue}><small>0{clueIndex + 1}</small><b>{clue}</b></div>)}</div>
                  <p>{evidence.footer}</p>
                </div>

                <div className={styles.questionBody}>
                  <div className={styles.meta}><span>{active.stage === "school" ? "SCHOOL" : "MUNICIPAL"}</span><b>{topicName(active.tag)}</b><em>reasoning task</em></div>
                  <h3>{active.prompt}</h3>
                  <div className={styles.options}>{active.options.map((option, optionIndex) => {
                    const answered = selected !== null;
                    const correct = optionIndex === active.answer;
                    const chosen = optionIndex === selected;
                    const cls = answered ? (correct ? styles.correct : chosen ? styles.wrong : styles.dimmed) : "";
                    return <button key={`${option}-${optionIndex}`} className={cls} disabled={answered} onClick={() => choose(optionIndex)}><span>{String.fromCharCode(65 + optionIndex)}</span><b>{option}</b>{answered && correct && <Check size={18} />}{answered && chosen && !correct && <X size={18} />}</button>;
                  })}</div>
                </div>
              </div>

              {selected !== null && <div className={styles.feedback}><div><small>WHY</small><b>{selected === active.answer ? "Логика ответа совпала" : "Вот где была ловушка"}</b><p>{active.explanation}</p></div><button onClick={nextQuestion}>{index + 1 === quiz.length ? "Result" : "Next task"}<ArrowRight size={16} /></button></div>}
            </>}

            {finished && <div className={styles.result}>
              <div className={styles.resultScore}><Trophy /><span>{percent}%</span></div>
              <div><small>ROUND COMPLETE</small><h3>{score} из {quiz.length}</h3><p>{percent >= 80 ? "Сильный результат: теперь можно перейти к другому типу заданий." : "Есть смысл пройти короткий targeted review по слабым темам."}</p>{repeatTopics.length ? <div className={styles.focus}><b>Focus next</b>{repeatTopics.map((topic) => <span key={topic}>{topic}</span>)}</div> : <div className={styles.focus}><b>Focus next</b><span>no weak topic detected</span></div>}</div>
              <button onClick={() => start(mode)}><RotateCcw size={16} /> Repeat</button>
            </div>}
          </div>

          <aside className={styles.memoryPanel}>
            <div className={styles.memoryHead}><div><small>MEMORY LAB</small><h2>Recall deck</h2></div><span>{studyCards.length ? cardIndex % studyCards.length + 1 : 0}/{studyCards.length}</span></div>
            {card && cardView ? <>
              <button className={`${styles.flash} ${showAnswer ? styles.flashBack : ""}`} onClick={() => setShowAnswer((v) => !v)}>
                <div><small>{card.tag}</small><em>{showAnswer ? "BACK" : "FRONT"}</em></div>
                <b>{showAnswer ? cardView.answer : cardView.front}</b>
                {showAnswer && cardView.detail && <p>{cardView.detail}</p>}
                <span>{showAnswer ? "tap to return" : "recall first → then reveal"}</span>
              </button>
              <div className={styles.memoryActions}><button onClick={() => { const u = new SpeechSynthesisUtterance(cardView.front); u.lang = "en-GB"; window.speechSynthesis?.speak(u); }}><Volume2 size={15} /> Listen</button><button onClick={() => { setCardIndex((v) => v + 1); setShowAnswer(false); }}>Next <ArrowRight size={15} /></button></div>
            </> : <div className={styles.memoryEmpty}>No recall cards for this mode yet.</div>}
          </aside>
        </section>

        <p className={styles.note}>Темы соответствуют заявленной структуре подготовки «Взлёта». Тренировочные формулировки авторские: они усложнены под олимпиадную логику и не воспроизводят страницы пособий.</p>
      </div>
    </main>
  );
}
