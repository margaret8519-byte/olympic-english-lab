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

const gradeOrder: VzletGradeKey[] = ["7-8", "9-10", "11"];

const stageTitle: Record<StageFilter, string> = {
  all: "Все темы",
  school: "Школьный этап",
  municipal: "Муниципальный этап",
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
  if (mode === "film") return grade === "7-8" ? "Узнай мультфильм" : "Саундтреки";
  if (mode === "culture") return grade === "7-8" ? "Штаты США" : grade === "9-10" ? "Great Britain" : "British History";
  if (mode === "mistakes") return "Мои ошибки";
  return "Смешанный раунд";
}

function visualFor(question: VzletQuestion) {
  if (question.tag === "Idioms") return { icon: "💬", label: "IDIOMS", hint: "Прочитай контекст и выбери выражение" };
  if (question.tag === "Animated films") return { icon: "🎬", label: "FILM CLUE", hint: "Сюжетная подсказка → название" };
  if (question.tag === "Soundtracks") return { icon: "🎧", label: "SOUNDTRACK", hint: "Фильм ↔ композитор ↔ звучание" };
  if (question.tag === "USA") return { icon: "🇺🇸", label: "USA", hint: "Штат ↔ столица ↔ nickname" };
  if (question.tag === "Great Britain") return { icon: "🇬🇧", label: "GREAT BRITAIN", hint: "География и страны Великобритании" };
  return { icon: "👑", label: "BRITISH HISTORY", hint: "Дата ↔ событие ↔ правитель" };
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
            <p>Никаких длинных списков: одна тема, один раунд, объяснение сразу после ответа.</p>
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
            <p>{stage === "school" ? "На школьном этапе показываем только школьные темы." : stage === "municipal" ? "На муниципальном этапе — только нужные для него темы." : "Можно тренировать все заявленные темы."}</p>
          </div>
          <div className={styles.modeGrid}>
            {availableModes.map((item) => {
              const Icon = item === "idioms" ? Brain : item === "film" ? Film : item === "culture" ? Map : item === "mistakes" ? RotateCcw : Target;
              return <button key={item} className={`${styles.modeCard} ${mode === item ? styles.selectedMode : ""}`} onClick={() => start(item)}><Icon /><b>{modeName(item, gradeKey)}</b><span>{item === "idioms" ? "Фразы в контексте" : item === "film" ? "Сюжет или композитор" : item === "culture" ? "Страны, штаты, история" : item === "mistakes" ? `${mistakes.length} сохранено` : "Всё вперемешку"}</span><em>Открыть <ArrowRight size={15} /></em></button>;
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
                <div className={styles.visualCue}><span>{visual.icon}</span><small>{visual.label}</small><p>{visual.hint}</p></div>
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
              {selected !== null && <div className={styles.feedback}><div><b>{selected === active.answer ? "Верно" : "Запомни эту ловушку"}</b><p>{active.explanation}</p></div><button onClick={nextQuestion}>{index + 1 === quiz.length ? "Показать результат" : "Следующий вопрос"}<ArrowRight size={17} /></button></div>}
            </>}

            {finished && <div className={styles.result}><Trophy /><div><small>ГОТОВО</small><h3>{score} / {quiz.length} · {percent}%</h3><p>{percent >= 80 ? "Отлично. Можно переходить к другой теме." : "Пройди раунд ещё раз — ошибки уже сохранены для повторения."}</p></div><button onClick={() => start(mode)}><RotateCcw size={17} /> Ещё раз</button></div>}
          </div>

          <aside className={styles.studyCard}>
            <div className={styles.studyHead}><div><small>ПЕРЕД ТЕСТОМ</small><h2>Быстро повторить</h2></div><span>{studyCards.length ? cardIndex % studyCards.length + 1 : 0}/{studyCards.length}</span></div>
            {card ? <>
              <button className={styles.flash} onClick={() => setShowAnswer((value) => !value)}><small>{card.tag}</small><b>{showAnswer ? card.back : card.front}</b><span>{showAnswer ? "Нажми, чтобы вернуть термин" : "Нажми, чтобы увидеть ответ"}</span></button>
              <div className={styles.studyActions}><button onClick={() => { const utterance = new SpeechSynthesisUtterance(card.front); utterance.lang = "en-GB"; window.speechSynthesis?.speak(utterance); }}><Volume2 size={16} /> Слушать</button><button onClick={() => { setCardIndex((value) => value + 1); setShowAnswer(false); }}>Дальше <ArrowRight size={16} /></button></div>
            </> : <div className={styles.emptySmall}>Для этой темы карточек нет — сразу переходи к тесту.</div>}
          </aside>
        </section>

        <p className={styles.note}>Темы соответствуют заявленной структуре подготовки «Взлёта». Тренировочные задания авторские и не воспроизводят страницы пособий.</p>
      </div>
    </main>
  );
}
