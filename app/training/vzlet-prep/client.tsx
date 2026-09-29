"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpenCheck, Brain, Check, Clock3, Film, Flag, RotateCcw, Sparkles, Trophy, Volume2, X, Zap } from "lucide-react";
import { AppHeader } from "@/components/Brand";
import { type VzletGradeKey, type VzletQuestion, type VzletStage, vzletAnimatedFilmList, vzletPrepData, vzletSoundtrackFilmList } from "@/data/vzlet-prep";
import styles from "./page.module.css";

type StageFilter = "all" | VzletStage;
type SavedProgress = Record<string, { best: number; attempts: number }>;
const stageLabel: Record<VzletStage, string> = { school: "Школьный этап", municipal: "Муниципальный этап" };

function gradeGroupFromProfile(grade: number): VzletGradeKey {
  if (grade >= 11) return "11";
  if (grade >= 9) return "9-10";
  return "7-8";
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export default function VzletPrepClient() {
  const [gradeKey, setGradeKey] = useState<VzletGradeKey>("7-8");
  const [stage, setStage] = useState<StageFilter>("all");
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quiz, setQuiz] = useState<VzletQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [progress, setProgress] = useState<SavedProgress>({});

  useEffect(() => {
    try {
      const profile = JSON.parse(localStorage.getItem("studentProfile") || "null") as { grade?: string } | null;
      if (profile?.grade) setGradeKey(gradeGroupFromProfile(Number(profile.grade)));
      setProgress(JSON.parse(localStorage.getItem("vzletPrepProgress2026") || "{}"));
    } catch {
      // Safe defaults are enough if storage cannot be read.
    }
  }, []);

  const group = vzletPrepData[gradeKey];
  const cards = useMemo(() => group.cards.filter((item) => stage === "all" || item.stage === stage), [group, stage]);
  const bank = useMemo(() => group.questions.filter((item) => stage === "all" || item.stage === stage), [group, stage]);
  const card = cards[cardIndex];
  const activeQuestion = quiz[questionIndex];
  const progressKey = `${gradeKey}:${stage}`;
  const saved = progress[progressKey];
  const filmList = gradeKey === "7-8" ? vzletAnimatedFilmList : vzletSoundtrackFilmList;
  const quizPercent = quiz.length ? Math.round((score / quiz.length) * 100) : 0;

  useEffect(() => {
    setCardIndex(0);
    setFlipped(false);
    setQuiz([]);
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }, [gradeKey, stage]);

  function speak(text: string) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-GB";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  function startQuiz() {
    setQuiz(shuffle(bank).slice(0, Math.min(10, bank.length)));
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  function chooseAnswer(index: number) {
    if (selected !== null || !activeQuestion) return;
    setSelected(index);
    if (index === activeQuestion.answer) setScore((value) => value + 1);
  }

  function nextQuestion() {
    if (!quiz.length || !activeQuestion) return;
    if (questionIndex + 1 >= quiz.length) {
      const percentage = Math.round((score / quiz.length) * 100);
      const nextProgress: SavedProgress = {
        ...progress,
        [progressKey]: { best: Math.max(saved?.best || 0, percentage), attempts: (saved?.attempts || 0) + 1 },
      };
      setProgress(nextProgress);
      localStorage.setItem("vzletPrepProgress2026", JSON.stringify(nextProgress));
      setFinished(true);
      return;
    }
    setQuestionIndex((value) => value + 1);
    setSelected(null);
  }

  return (
    <main className={styles.page}>
      <AppHeader />
      <div className={styles.shell}>
        <div className={styles.topline}>
          <Link href="/dashboard" className={styles.back}><ArrowLeft size={18} /> В кабинет</Link>
          <span className={styles.liveBadge}><Sparkles size={15} /> ВЗЛЁТ PREP · 2026</span>
        </div>

        <section className={styles.hero}>
          <div>
            <span className={styles.eyebrow}>ОЛИМПИАДНЫЙ ИНТЕНСИВ</span>
            <h1>Подготовка по темам «Взлёта»</h1>
            <p>Карточки, олимпиадные ловушки, фильмы, страноведение и быстрые квизы по темам школьного и муниципального этапов.</p>
            <div className={styles.heroStats}>
              <span><BookOpenCheck /> {group.requirements.length} блоков</span>
              <span><Brain /> {group.cards.length} карточек</span>
              <span><Zap /> {group.questions.length} заданий</span>
            </div>
          </div>
          <div className={styles.heroMark}><Trophy /></div>
        </section>

        <section className={styles.filters} aria-label="Выбор класса и этапа">
          <div><small>КЛАСС</small><div className={styles.switchRow}>
            {(Object.keys(vzletPrepData) as VzletGradeKey[]).map((key) => <button key={key} className={gradeKey === key ? styles.activeSwitch : ""} onClick={() => setGradeKey(key)}>{vzletPrepData[key].label}</button>)}
          </div></div>
          <div><small>ЭТАП</small><div className={styles.switchRow}>
            {(["all", "school", "municipal"] as StageFilter[]).map((key) => <button key={key} className={stage === key ? styles.activeSwitch : ""} onClick={() => setStage(key)}>{key === "all" ? "Все" : stageLabel[key]}</button>)}
          </div></div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div><span>01</span><div><small>ROADMAP</small><h2>Что именно учить</h2></div></div>
            {saved && <div className={styles.best}><Trophy size={17} /> Лучший квиз: {saved.best}% · попыток {saved.attempts}</div>}
          </div>
          <div className={styles.requirementGrid}>
            {group.requirements.filter((item) => stage === "all" || item.stage === stage).map((item) => <article className={styles.requirement} key={`${item.stage}-${item.title}`}>
              <div className={styles.reqTop}><span className={item.stage === "municipal" ? styles.municipal : styles.school}>{item.stage === "municipal" ? "МУНИЦИПАЛЬНЫЙ" : "ШКОЛЬНЫЙ"}</span><b>{item.area}</b></div>
              <h3>{item.title}</h3><p>{item.details}</p>
            </article>)}
          </div>
        </section>

        <section className={styles.studyGrid}>
          <article className={styles.deckPanel}>
            <div className={styles.panelHeading}><div><small>02 · LEARN</small><h2>Карточки памяти</h2></div><span>{cards.length ? cardIndex + 1 : 0} / {cards.length}</span></div>
            {card ? <>
              <button className={`${styles.flashcard} ${flipped ? styles.flipped : ""}`} onClick={() => setFlipped((value) => !value)}>
                <span className={styles.cardTag}>{card.tag} · {stageLabel[card.stage]}</span>
                <strong>{flipped ? card.back : card.front}</strong>
                <small>{flipped ? "Нажми, чтобы увидеть термин" : "Сначала вспомни значение → нажми"}</small>
              </button>
              <div className={styles.cardActions}>
                <button onClick={() => speak(card.front)}><Volume2 size={18} /> Слушать</button>
                <button onClick={() => { setCardIndex((value) => (value - 1 + cards.length) % cards.length); setFlipped(false); }}><ArrowLeft size={18} /> Назад</button>
                <button onClick={() => { setCardIndex((value) => (value + 1) % cards.length); setFlipped(false); }}>Дальше <ArrowRight size={18} /></button>
              </div>
            </> : <p>Для этого фильтра пока нет карточек.</p>}
          </article>

          <article className={styles.filmPanel}>
            <div className={styles.panelHeading}><div><small>FILM RADAR</small><h2>{gradeKey === "7-8" ? "Animated films" : "Film soundtracks"}</h2></div><Film /></div>
            <p className={styles.muted}>Для 7–8 классов тренируем узнавание фильма по эпизоду; для 9–11 — узнавание саундтрека и композитора.</p>
            <div className={styles.chips}>{filmList.map((film) => <span key={film}>{film}</span>)}</div>
            <div className={styles.tip}><Flag size={17} /> Годы в тренировке не спрашиваем: важнее быстро узнать произведение по характерному признаку.</div>
          </article>
        </section>

        <section className={styles.quizPanel}>
          <div className={styles.sectionHeading}><div><span>03</span><div><small>SPRINT</small><h2>10 вопросов на скорость</h2></div></div><div className={styles.timer}><Clock3 size={17} /> Сначала точность, потом скорость</div></div>

          {!quiz.length && !finished && <div className={styles.quizIntro}><div><Zap /><h3>Olympiad Sprint</h3><p>Система перемешает задания по выбранному классу и этапу.</p></div><button onClick={startQuiz}>Начать квиз <ArrowRight size={18} /></button></div>}

          {!!quiz.length && !finished && activeQuestion && <div className={styles.questionBox}>
            <div className={styles.questionMeta}><span>{questionIndex + 1} / {quiz.length}</span><b>{activeQuestion.tag}</b><em>{stageLabel[activeQuestion.stage]}</em></div>
            <div className={styles.quizBar}><span style={{ width: `${((questionIndex + (selected !== null ? 1 : 0)) / quiz.length) * 100}%` }} /></div>
            <h3>{activeQuestion.prompt}</h3>
            <div className={styles.options}>{activeQuestion.options.map((option, index) => {
              const answered = selected !== null;
              const isCorrect = index === activeQuestion.answer;
              const isSelected = index === selected;
              const className = answered ? (isCorrect ? styles.correct : isSelected ? styles.wrong : styles.dimmed) : "";
              return <button key={option} className={className} onClick={() => chooseAnswer(index)} disabled={answered}><span>{String.fromCharCode(65 + index)}</span>{option}{answered && isCorrect && <Check size={18} />}{answered && isSelected && !isCorrect && <X size={18} />}</button>;
            })}</div>
            {selected !== null && <div className={styles.explanation}><b>{selected === activeQuestion.answer ? "Верно!" : "Разберём ловушку"}</b><p>{activeQuestion.explanation}</p><button onClick={nextQuestion}>{questionIndex + 1 === quiz.length ? "Показать результат" : "Следующий вопрос"} <ArrowRight size={17} /></button></div>}
          </div>}

          {finished && <div className={styles.resultBox}><Trophy /><div><small>РЕЗУЛЬТАТ</small><h3>{score} / {quiz.length} · {quizPercent}%</h3><p>{quizPercent >= 80 ? "Сильный результат. Теперь добей слабые карточки." : quizPercent >= 60 ? "База есть. Пройди карточки и повтори спринт." : "Сначала закрепи карточки, затем повтори спринт."}</p></div><button onClick={startQuiz}><RotateCcw size={18} /> Ещё попытка</button></div>}
        </section>

        <section className={styles.strategy}>
          <div><span>1</span><b>LEARN</b><p>Карточки: термин → значение / факт.</p></div><ArrowRight />
          <div><span>2</span><b>RECALL</b><p>Закрой ответ и проговори его вслух.</p></div><ArrowRight />
          <div><span>3</span><b>SPRINT</b><p>10 перемешанных вопросов без подсказок.</p></div><ArrowRight />
          <div><span>4</span><b>REPEAT</b><p>Повтори ошибки на следующий день.</p></div>
        </section>
      </div>
    </main>
  );
}
