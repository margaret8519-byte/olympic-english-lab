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
  type VzletGradeKey,
  type VzletQuestion,
  type VzletStage,
  vzletPrepData,
} from "@/data/vzlet-prep";
import styles from "./simple.module.css";

type StageFilter = "all" | VzletStage;
type Mode = "idioms" | "film" | "culture" | "mixed" | "mistakes";
type VisualTone = "violet" | "blue" | "mint" | "coral" | "gold";
type VisualScene = { icons: [string, string, string]; label: string; hint: string; tone: VisualTone };

const gradeOrder: VzletGradeKey[] = ["7-8", "9-10", "11"];

const stageTitle: Record<StageFilter, string> = {
  all: "Все темы",
  school: "Школьный этап",
  municipal: "Муниципальный этап",
};

const visualByQuestion: Record<string, VisualScene> = {
  "78-1": { icons: ["🤝", "👀", "✅"], label: "IDIOM SCENE", hint: "двое полностью согласны", tone: "violet" },
  "78-2": { icons: ["🎸", "👨‍👩‍👧", "🎵"], label: "IDIOM SCENE", hint: "одно качество у всей семьи", tone: "gold" },
  "78-3": { icons: ["🏨", "🛋️", "😊"], label: "IDIOM SCENE", hint: "чужое место ощущается как дом", tone: "mint" },
  "78-4": { icons: ["👂", "💬", "✨"], label: "IDIOM SCENE", hint: "слушаю очень внимательно", tone: "blue" },
  "78-5": { icons: ["👜", "👀", "🎟️"], label: "IDIOM SCENE", hint: "присмотри за вещью", tone: "coral" },
  "78-6": { icons: ["🙈", "⚠️", "➡️"], label: "IDIOM SCENE", hint: "заметил, но решил проигнорировать", tone: "violet" },
  "78-7": { icons: ["🎸", "🌼", "🌙"], label: "FILM CLUE", hint: "музыка • семья • память", tone: "violet" },
  "78-8": { icons: ["👨‍🍳", "🐭", "🗼"], label: "FILM CLUE", hint: "повар • маленький герой • Париж", tone: "coral" },
  "78-9": { icons: ["🧠", "😊", "😰"], label: "FILM CLUE", hint: "разум • эмоции • взросление", tone: "blue" },
  "78-10": { icons: ["🐉", "🛡️", "🌊"], label: "FILM CLUE", hint: "викинг • дружба • дракон", tone: "mint" },
  "78-11": { icons: ["🌿", "🏚️", "🟢"], label: "FILM CLUE", hint: "болото • покой • необычный герой", tone: "mint" },
  "78-12": { icons: ["🏎️", "🏁", "🏜️"], label: "FILM CLUE", hint: "гонка • дорога • важнее победы", tone: "coral" },
  "78-13": { icons: ["🌴", "🎬", "🌉"], label: "USA CLUE", hint: "Pacific coast • cinema • tech", tone: "gold" },
  "78-14": { icons: ["⭐", "🤠", "🌵"], label: "USA CLUE", hint: "Lone Star • South • wide spaces", tone: "coral" },
  "78-15": { icons: ["🍎", "🏙️", "🏛️"], label: "USA CLUE", hint: "famous city ≠ state capital", tone: "violet" },
  "78-16": { icons: ["🌺", "🌋", "🏝️"], label: "USA CLUE", hint: "islands • volcanoes • aloha", tone: "mint" },
  "78-17": { icons: ["☀️", "🐊", "🌴"], label: "USA CLUE", hint: "sunshine • peninsula • warm coast", tone: "gold" },
  "78-18": { icons: ["❄️", "🏔️", "🐻"], label: "USA CLUE", hint: "largest state • northern frontier", tone: "blue" },
  "78-19": { icons: ["⛰️", "🗿", "🌾"], label: "USA CLUE", hint: "Mount Rushmore • Great Plains", tone: "gold" },
  "78-20": { icons: ["🌲", "🏔️", "🌧️"], label: "USA CLUE", hint: "Evergreen State • Pacific Northwest", tone: "mint" },

  "910-1": { icons: ["🏫", "➡️", "🚶"], label: "IDIOM SCENE", hint: "совсем рядом", tone: "mint" },
  "910-2": { icons: ["🎓", "✨", "😊"], label: "IDIOM SCENE", hint: "давняя мечта наконец сбылась", tone: "violet" },
  "910-3": { icons: ["⚖️", "👂", "⏳"], label: "IDIOM SCENE", hint: "не решай, пока не услышал обе стороны", tone: "blue" },
  "910-4": { icons: ["🌧️", "💡", "⬇️"], label: "IDIOM SCENE", hint: "ситуация становится всё хуже", tone: "coral" },
  "910-5": { icons: ["💧", "🌊", "500"], label: "IDIOM SCENE", hint: "слишком мало по сравнению с нужным", tone: "blue" },
  "910-6": { icons: ["🔔", "🧠", "❓"], label: "IDIOM SCENE", hint: "звучит знакомо", tone: "gold" },
  "910-7": { icons: ["📞", "🧠", "💨"], label: "IDIOM SCENE", hint: "совсем вылетело из головы", tone: "violet" },
  "910-8": { icons: ["🧠", "📌", "⏰"], label: "IDIOM SCENE", hint: "держи это в уме", tone: "mint" },
  "910-9": { icons: ["🪐", "⏳", "🎹"], label: "FILM & COMPOSER", hint: "space • time • organ", tone: "blue" },
  "910-10": { icons: ["🪄", "🏰", "✨"], label: "FILM & COMPOSER", hint: "magic • castle • celesta", tone: "violet" },
  "910-11": { icons: ["🏴‍☠️", "⛵", "🧭"], label: "FILM & COMPOSER", hint: "pirates • sea • orchestra", tone: "coral" },
  "910-12": { icons: ["🌌", "🎹", "⏱️"], label: "FILM & COMPOSER", hint: "cosmos • organ • time", tone: "blue" },
  "910-13": { icons: ["💍", "⛰️", "🗺️"], label: "FILM & COMPOSER", hint: "Middle-earth • journey • leitmotifs", tone: "gold" },
  "910-14": { icons: ["🏰", "⛰️", "🐉"], label: "GREAT BRITAIN", hint: "three countries on one island", tone: "mint" },
  "910-15": { icons: ["🧩", "🇬🇧", "☘️"], label: "GREAT BRITAIN", hint: "four parts make the United Kingdom", tone: "blue" },
  "910-16": { icons: ["🏰", "⛰️", "🎻"], label: "GREAT BRITAIN", hint: "Scotland • historic capital", tone: "violet" },
  "910-17": { icons: ["🐉", "🏟️", "🏰"], label: "GREAT BRITAIN", hint: "Wales • red dragon • capital", tone: "coral" },
  "910-18": { icons: ["🏔️", "🥾", "🌧️"], label: "GREAT BRITAIN", hint: "highest point in the UK", tone: "blue" },
  "910-19": { icons: ["🌊", "⛴️", "🇫🇷"], label: "GREAT BRITAIN", hint: "water between England and France", tone: "mint" },
  "910-20": { icons: ["⚓", "☘️", "🏙️"], label: "GREAT BRITAIN", hint: "Northern Ireland • capital", tone: "gold" },

  "11-1": { icons: ["🧑‍💼", "🪢", "✅"], label: "IDIOM SCENE", hint: "осваиваешь, как всё устроено", tone: "blue" },
  "11-2": { icons: ["📦", "💡", "🚀"], label: "IDIOM SCENE", hint: "нужна нестандартная идея", tone: "violet" },
  "11-3": { icons: ["🏗️", "⏱️", "😅"], label: "IDIOM SCENE", hint: "очень трудная задача", tone: "coral" },
  "11-4": { icons: ["🔁", "1️⃣", "🧩"], label: "IDIOM SCENE", hint: "всё снова с самого начала", tone: "gold" },
  "11-5": { icons: ["🎟️", "🤏", "🍀"], label: "IDIOM SCENE", hint: "вероятность очень маленькая", tone: "mint" },
  "11-6": { icons: ["💼", "🪙", "🚀"], label: "IDIOM SCENE", hint: "запуск почти без бюджета", tone: "gold" },
  "11-7": { icons: ["🔍", "❌", "📝"], label: "IDIOM SCENE", hint: "ищет недостатки в каждой мелочи", tone: "coral" },
  "11-8": { icons: ["👏", "🏆", "✅"], label: "IDIOM SCENE", hint: "похвала тому, кто её заслужил", tone: "violet" },
  "11-9": { icons: ["💻", "🟩", "☎️"], label: "FILM & COMPOSER", hint: "code • simulation • 1999", tone: "mint" },
  "11-10": { icons: ["🤖", "🛡️", "⚡"], label: "FILM & COMPOSER", hint: "superheroes • AI villain • two composers", tone: "coral" },
  "11-11": { icons: ["⏱️", "🏜️", "🎼"], label: "FILM & COMPOSER", hint: "time-bending city + desert planet", tone: "gold" },
  "11-12": { icons: ["⚔️", "🛡️", "🏰"], label: "BRITISH HISTORY", hint: "1066 • conquest • Hastings", tone: "coral" },
  "11-13": { icons: ["📜", "👑", "✒️"], label: "BRITISH HISTORY", hint: "1215 • king • charter", tone: "gold" },
  "11-14": { icons: ["🌹", "⚔️", "👑"], label: "BRITISH HISTORY", hint: "1485 • Bosworth • new dynasty", tone: "coral" },
  "11-15": { icons: ["👑", "⛪", "📜"], label: "BRITISH HISTORY", hint: "1534 • Crown • Church", tone: "violet" },
  "11-16": { icons: ["⛵", "🌊", "👑"], label: "BRITISH HISTORY", hint: "1588 • Armada • queen", tone: "blue" },
  "11-17": { icons: ["👑", "🤝", "🏴"], label: "BRITISH HISTORY", hint: "1603 • one monarch • two crowns", tone: "mint" },
  "11-18": { icons: ["⚖️", "👑", "📜"], label: "BRITISH HISTORY", hint: "1649 • Charles I", tone: "coral" },
  "11-19": { icons: ["👑", "🎉", "🏰"], label: "BRITISH HISTORY", hint: "1660 • monarchy returns", tone: "gold" },
  "11-20": { icons: ["🔄", "👑", "📜"], label: "BRITISH HISTORY", hint: "1688–1689 • revolution • rights", tone: "violet" },
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
  if (mode === "idioms") return "Идиомы";
  if (mode === "film") return grade === "7-8" ? "Узнай мультфильм" : "Фильм и композитор";
  if (mode === "culture") return grade === "7-8" ? "Штаты США" : grade === "9-10" ? "Great Britain" : "British History";
  if (mode === "mistakes") return "Мои ошибки";
  return "Смешанный раунд";
}

function modeSubtitle(mode: Mode, grade: VzletGradeKey, mistakes: number) {
  if (mode === "idioms") return "Фразы в контексте";
  if (mode === "film") return grade === "7-8" ? "Сюжет • герой • ключевая деталь" : "Фильм ↔ композитор ↔ музыкальная подсказка";
  if (mode === "culture") {
    if (grade === "7-8") return "Столицы • nicknames • факты";
    if (grade === "9-10") return "Страны UK • столицы • география";
    return "Даты • события • монархи";
  }
  if (mode === "mistakes") return `${mistakes} сохранено для повторения`;
  return "Все темы вперемешку";
}

function visualFor(question: VzletQuestion): VisualScene {
  const exact = visualByQuestion[question.id];
  if (exact) return exact;
  if (question.tag === "Idioms") return { icons: ["💬", "🧠", "✨"], label: "IDIOM SCENE", hint: "контекст → смысл → выражение", tone: "violet" };
  if (question.tag === "Animated films") return { icons: ["🎬", "🧩", "⭐"], label: "FILM CLUE", hint: "сюжет → название", tone: "blue" };
  if (question.tag === "Soundtracks") return { icons: ["🎞️", "🎼", "👤"], label: "FILM & COMPOSER", hint: "фильм ↔ композитор", tone: "violet" };
  if (question.tag === "USA") return { icons: ["🗺️", "🏛️", "⭐"], label: "USA CLUE", hint: "штат ↔ столица ↔ nickname", tone: "gold" };
  if (question.tag === "Great Britain") return { icons: ["🇬🇧", "🗺️", "🏰"], label: "GREAT BRITAIN", hint: "страны UK • столицы • география", tone: "blue" };
  return { icons: ["👑", "📜", "🏰"], label: "BRITISH HISTORY", hint: "дата ↔ событие ↔ монарх", tone: "coral" };
}

function visualToneClass(tone: VisualTone) {
  if (tone === "blue") return styles.visualBlue;
  if (tone === "mint") return styles.visualMint;
  if (tone === "coral") return styles.visualCoral;
  if (tone === "gold") return styles.visualGold;
  return styles.visualViolet;
}

export default function SimpleVzletPrep() {
  const [gradeKey, setGradeKey] = useState<VzletGradeKey>("7-8");
  const [stage, setStage] = useState<StageFilter>("all");
  const [mode, setMode] = useState<Mode>("idioms");
  const [quiz, setQuiz] = useState<VzletQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [mistakes, setMistakes] = useState<string[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    try {
      const profile = JSON.parse(localStorage.getItem("studentProfile") || "null") as { grade?: string } | null;
      if (profile?.grade) setGradeKey(gradeFromProfile(Number(profile.grade)));
    } catch {
      // Use safe defaults.
    }
  }, []);

  useEffect(() => {
    try {
      setMistakes(JSON.parse(localStorage.getItem(`vzletPrepMistakes2026:${gradeKey}`) || "[]"));
    } catch {
      setMistakes([]);
    }
  }, [gradeKey]);

  const group = vzletPrepData[gradeKey];
  const stageQuestions = useMemo(
    () => group.questions.filter((question) => stage === "all" || question.stage === stage),
    [group, stage],
  );
  const stageCards = useMemo(
    () => group.cards.filter((card) => stage === "all" || card.stage === stage),
    [group, stage],
  );

  const availableModes = useMemo(() => {
    const modes: Mode[] = ["idioms"];
    if (stage === "all" || stage === "school") modes.push("film");
    if (stage === "all" || stage === "municipal") modes.push("culture");
    if (mistakes.length) modes.push("mistakes");
    modes.push("mixed");
    return modes;
  }, [stage, mistakes.length]);

  const studyCards = useMemo(() => {
    if (mode === "culture") return stageCards.filter((card) => ["USA", "Great Britain", "British history"].includes(card.tag));
    if (mode === "film") return stageCards.filter((card) => card.tag === "Soundtracks");
    if (mode === "idioms") return stageCards.filter((card) => !["USA", "Great Britain", "British history", "Soundtracks"].includes(card.tag));
    return stageCards;
  }, [mode, stageCards]);

  const active = quiz[index];
  const visual = active ? visualFor(active) : null;
  const card = studyCards.length ? studyCards[cardIndex % studyCards.length] : null;

  function saveMistakes(next: string[]) {
    setMistakes(next);
    try {
      localStorage.setItem(`vzletPrepMistakes2026:${gradeKey}`, JSON.stringify(next));
    } catch {
      // Ignore storage restrictions.
    }
  }

  function questionsFor(nextMode: Mode) {
    if (nextMode === "idioms") return stageQuestions.filter((question) => question.tag === "Idioms");
    if (nextMode === "film") return group.questions.filter((question) => isFilm(question) && (stage === "all" || question.stage === stage));
    if (nextMode === "culture") return group.questions.filter((question) => isCulture(question) && (stage === "all" || question.stage === stage));
    if (nextMode === "mistakes") return group.questions.filter((question) => mistakes.includes(question.id));
    return stageQuestions;
  }

  function start(nextMode: Mode) {
    setMode(nextMode);
    const source = questionsFor(nextMode);
    setQuiz(shuffle(source).slice(0, Math.min(10, source.length)));
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
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
    } else if (!mistakes.includes(active.id)) {
      saveMistakes([...mistakes, active.id]);
    }
  }

  function nextQuestion() {
    if (!active) return;
    if (index + 1 >= quiz.length) {
      setFinished(true);
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
  }

  const percent = quiz.length ? Math.round((score / quiz.length) * 100) : 0;

  return (
    <main className={styles.page}>
      <AppHeader />
      <div className={styles.shell}>
        <div className={styles.topbar}>
          <Link href="/dashboard"><ArrowLeft size={18} /> В кабинет</Link>
          <span><Sparkles size={15} /> VZLET PREP · 2026</span>
        </div>

        <section className={styles.hero}>
          <div>
            <small>ПОДГОТОВКА БЕЗ ЛИШНЕГО</small>
            <h1>Выбери класс → этап → тренировку</h1>
            <p>Одна тема, один короткий раунд и визуальная подсказка перед каждым вопросом.</p>
          </div>
          <div className={styles.heroBadge}><Target /><b>{group.label}</b><span>{group.subtitle}</span></div>
        </section>

        <section className={styles.steps}>
          <div className={styles.stepBlock}>
            <div className={styles.stepTitle}><span>1</span><b>Класс</b></div>
            <div className={styles.segment}>
              {gradeOrder.map((key) => <button key={key} className={gradeKey === key ? styles.active : ""} onClick={() => setGradeKey(key)}>{vzletPrepData[key].label}</button>)}
            </div>
          </div>
          <div className={styles.stepBlock}>
            <div className={styles.stepTitle}><span>2</span><b>Этап</b></div>
            <div className={styles.segment}>
              {(["all", "school", "municipal"] as StageFilter[]).map((key) => <button key={key} className={stage === key ? styles.active : ""} onClick={() => setStage(key)}>{stageTitle[key]}</button>)}
            </div>
          </div>
        </section>

        <section className={styles.training}>
          <div className={styles.trainingHead}>
            <div className={styles.stepTitle}><span>3</span><b>Что тренируем?</b></div>
            <p>{stage === "school" ? "Здесь только темы школьного этапа." : stage === "municipal" ? "Здесь только темы муниципального этапа." : "Можно тренировать все заявленные темы."}</p>
          </div>
          <div className={styles.modeGrid}>
            {availableModes.map((item) => {
              const Icon = item === "idioms" ? Brain : item === "film" ? Film : item === "culture" ? Map : item === "mistakes" ? RotateCcw : Target;
              return <button key={item} className={`${styles.modeCard} ${mode === item ? styles.selectedMode : ""}`} onClick={() => start(item)}><Icon /><b>{modeName(item, gradeKey)}</b><span>{modeSubtitle(item, gradeKey, mistakes.length)}</span><em>Открыть <ArrowRight size={15} /></em></button>;
            })}
          </div>
        </section>

        <section className={styles.workArea}>
          <div className={styles.quizCard}>
            <div className={styles.quizTop}>
              <div><small>ТРЕНИРОВКА</small><h2>{modeName(mode, gradeKey)}</h2></div>
              {!!quiz.length && !finished && <span>{index + 1} / {quiz.length}</span>}
            </div>

            {!quiz.length && <div className={styles.empty}><Target /><h3>Для этой комбинации пока нет вопросов</h3><p>Выбери «Все темы» или другую тренировку выше.</p></div>}

            {!!quiz.length && !finished && active && visual && <>
              <div className={styles.questionLayout}>
                <div className={`${styles.visualCue} ${visualToneClass(visual.tone)}`}>
                  <div className={styles.visualTop}><small>{visual.label}</small><span>LOOK → THINK → ANSWER</span></div>
                  <div className={styles.sceneIcons} aria-hidden="true">
                    {visual.icons.map((icon, visualIndex) => <span key={`${icon}-${visualIndex}`}>{icon}</span>)}
                  </div>
                  <p>{visual.hint}</p>
                </div>
                <div className={styles.questionBody}>
                  <div className={styles.meta}><span>{active.stage === "school" ? "Школьный" : "Муниципальный"}</span><b>{active.tag}</b></div>
                  <h3>{active.prompt}</h3>
                  <div className={styles.options}>{active.options.map((option, optionIndex) => {
                    const answered = selected !== null;
                    const correct = optionIndex === active.answer;
                    const chosen = optionIndex === selected;
                    const cls = answered ? (correct ? styles.correct : chosen ? styles.wrong : styles.dimmed) : "";
                    return <button key={option} className={cls} disabled={answered} onClick={() => choose(optionIndex)}><span>{String.fromCharCode(65 + optionIndex)}</span>{option}{answered && correct && <Check size={18} />}{answered && chosen && !correct && <X size={18} />}</button>;
                  })}</div>
                </div>
              </div>
              {selected !== null && <div className={styles.feedback}><div><b>{selected === active.answer ? "Верно — визуальная ассоциация сработала" : "Запомни связку картинки и факта"}</b><p>{active.explanation}</p></div><button onClick={nextQuestion}>{index + 1 === quiz.length ? "Показать результат" : "Следующий вопрос"}<ArrowRight size={17} /></button></div>}
            </>}

            {finished && <div className={styles.result}><Trophy /><div><small>ГОТОВО</small><h3>{score} / {quiz.length} · {percent}%</h3><p>{percent >= 80 ? "Отлично. Можно переходить к другой теме." : "Пройди раунд ещё раз — ошибки уже сохранены для повторения."}</p></div><button onClick={() => start(mode)}><RotateCcw size={17} /> Ещё раз</button></div>}
          </div>

          <aside className={styles.studyCard}>
            <div className={styles.studyHead}><div><small>ПЕРЕД ТЕСТОМ</small><h2>Быстро повторить</h2></div><span>{studyCards.length ? cardIndex % studyCards.length + 1 : 0}/{studyCards.length}</span></div>
            {card ? <>
              <button className={`${styles.flash} ${showAnswer ? styles.flashAnswer : ""}`} onClick={() => setShowAnswer((value) => !value)}>
                <div className={styles.flashMeta}><small>{card.tag}</small><em>{showAnswer ? "ЗНАЧЕНИЕ" : "ТЕРМИН"}</em></div>
                <b>{showAnswer ? card.back : card.front}</b>
                <span>{showAnswer ? "Нажми, чтобы снова увидеть термин" : "Сначала вспомни сам → затем открой значение"}</span>
              </button>
              <div className={styles.studyActions}><button onClick={() => { const utterance = new SpeechSynthesisUtterance(card.front); utterance.lang = "en-GB"; window.speechSynthesis?.speak(utterance); }}><Volume2 size={16} /> Слушать</button><button onClick={() => { setCardIndex((value) => value + 1); setShowAnswer(false); }}>Дальше <ArrowRight size={16} /></button></div>
            </> : <div className={styles.emptySmall}>Для этой темы карточек нет — сразу переходи к тесту.</div>}
          </aside>
        </section>

        <p className={styles.note}>Темы соответствуют заявленной структуре подготовки «Взлёта». Визуальные подсказки и тренировочные задания авторские и не воспроизводят страницы пособий.</p>
      </div>
    </main>
  );
}
