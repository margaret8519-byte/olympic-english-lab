"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BookOpenCheck,
  Brain,
  Check,
  Clock3,
  Film,
  Flag,
  Map,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  Volume2,
  X,
  Zap,
} from "lucide-react";
import { AppHeader } from "@/components/Brand";
import {
  type VzletCard,
  type VzletGradeKey,
  type VzletQuestion,
  type VzletStage,
  vzletAnimatedFilmList,
  vzletPrepData,
  vzletSoundtrackFilmList,
} from "@/data/vzlet-prep";
import styles from "./page.module.css";

type StageFilter = "all" | VzletStage;
type QuizMode = "mixed" | "idioms" | "film" | "culture" | "mistakes";
type SavedProgress = Record<string, { best: number; attempts: number }>;

const gradeOrder: VzletGradeKey[] = ["7-8", "9-10", "11"];
const stageLabel: Record<VzletStage, string> = {
  school: "Школьный этап",
  municipal: "Муниципальный этап",
};
const modeLabel: Record<QuizMode, string> = {
  mixed: "Смешанный спринт",
  idioms: "Idioms Sprint",
  film: "Film Challenge",
  culture: "Country Challenge",
  mistakes: "Мои ошибки",
};

function gradeGroupFromProfile(grade: number): VzletGradeKey {
  if (grade >= 11) return "11";
  if (grade >= 9) return "9-10";
  return "7-8";
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function isFilmTag(tag: string) {
  return tag === "Animated films" || tag === "Soundtracks";
}

function isCultureTag(tag: string) {
  return tag === "USA" || tag === "Great Britain" || tag === "British history";
}

function isCultureCard(card: VzletCard) {
  return isCultureTag(card.tag) || card.tag === "Soundtracks";
}

export default function VzletPrepClient() {
  const [gradeKey, setGradeKey] = useState<VzletGradeKey>("7-8");
  const [stage, setStage] = useState<StageFilter>("all");
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quiz, setQuiz] = useState<VzletQuestion[]>([]);
  const [quizMode, setQuizMode] = useState<QuizMode>("mixed");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [progress, setProgress] = useState<SavedProgress>({});
  const [mistakeIds, setMistakeIds] = useState<string[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const profile = JSON.parse(localStorage.getItem("studentProfile") || "null") as { grade?: string } | null;
      if (profile?.grade) setGradeKey(gradeGroupFromProfile(Number(profile.grade)));
      setProgress(JSON.parse(localStorage.getItem("vzletPrepProgress2026") || "{}"));
    } catch {
      // Keep safe defaults if storage is unavailable.
    }
  }, []);

  useEffect(() => {
    try {
      setMistakeIds(JSON.parse(localStorage.getItem(`vzletPrepMistakes2026:${gradeKey}`) || "[]"));
    } catch {
      setMistakeIds([]);
    }
  }, [gradeKey]);

  const group = vzletPrepData[gradeKey];
  const requirements = useMemo(
    () => group.requirements.filter((item) => stage === "all" || item.stage === stage),
    [group, stage],
  );
  const cards = useMemo(
    () => group.cards.filter((item) => stage === "all" || item.stage === stage),
    [group, stage],
  );
  const bank = useMemo(
    () => group.questions.filter((item) => stage === "all" || item.stage === stage),
    [group, stage],
  );
  const idiomCards = useMemo(() => cards.filter((item) => !isCultureCard(item)), [cards]);
  const cultureCards = useMemo(() => cards.filter((item) => isCultureTag(item.tag)), [cards]);
  const historyCards = useMemo(() => group.cards.filter((item) => item.tag === "British history"), [group.cards]);
  const card = cards[cardIndex];
  const activeQuestion = quiz[questionIndex];
  const progressKey = `${gradeKey}:${stage}`;
  const saved = progress[progressKey];
  const filmList = gradeKey === "7-8" ? vzletAnimatedFilmList : vzletSoundtrackFilmList;
  const quizPercent = quiz.length ? Math.round((score / quiz.length) * 100) : 0;
  const mistakesInCurrentBank = bank.filter((item) => mistakeIds.includes(item.id));
  const dailyIdiom = useMemo(() => {
    if (!idiomCards.length) return null;
    const today = new Date();
    const seed = today.getDate() + (today.getMonth() + 1) * 31 + today.getFullYear();
    return idiomCards[seed % idiomCards.length];
  }, [idiomCards]);

  useEffect(() => {
    setCardIndex(0);
    setFlipped(false);
    setQuiz([]);
    setQuizMode("mixed");
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setNotice("");
  }, [gradeKey, stage]);

  function speak(text: string) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-GB";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  function saveMistakes(next: string[]) {
    setMistakeIds(next);
    localStorage.setItem(`vzletPrepMistakes2026:${gradeKey}`, JSON.stringify(next));
  }

  function getModeBank(mode: QuizMode) {
    if (mode === "idioms") return bank.filter((item) => item.tag === "Idioms");
    if (mode === "film") return bank.filter((item) => isFilmTag(item.tag));
    if (mode === "culture") return bank.filter((item) => isCultureTag(item.tag));
    if (mode === "mistakes") return mistakesInCurrentBank;
    return bank;
  }

  function startQuiz(mode: QuizMode = "mixed") {
    const source = getModeBank(mode);
    if (!source.length) {
      setNotice(mode === "mistakes" ? "Здесь пока нет сохранённых ошибок — отличный знак. Пройди любой раунд, и сложные вопросы появятся здесь автоматически." : "Для выбранного этапа пока нет вопросов этого типа. Переключи этап на «Все темы». ");
      return;
    }
    setNotice("");
    setQuizMode(mode);
    setQuiz(shuffle(source).slice(0, Math.min(10, source.length)));
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    window.setTimeout(() => document.getElementById("vzlet-sprint")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function chooseAnswer(index: number) {
    if (selected !== null || !activeQuestion) return;
    setSelected(index);
    if (index === activeQuestion.answer) {
      setScore((value) => value + 1);
      if (mistakeIds.includes(activeQuestion.id)) saveMistakes(mistakeIds.filter((id) => id !== activeQuestion.id));
    } else if (!mistakeIds.includes(activeQuestion.id)) {
      saveMistakes([...mistakeIds, activeQuestion.id]);
    }
  }

  function nextQuestion() {
    if (!quiz.length || !activeQuestion) return;
    if (questionIndex + 1 >= quiz.length) {
      const percentage = Math.round((score / quiz.length) * 100);
      const nextProgress: SavedProgress = {
        ...progress,
        [progressKey]: {
          best: Math.max(saved?.best || 0, percentage),
          attempts: (saved?.attempts || 0) + 1,
        },
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
          <span className={styles.liveBadge}><Sparkles size={15} /> VZLET PREP · 2026</span>
        </div>

        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>ОЛИМПИАДА · БЕЗ ХАОСА</span>
            <h1>Темы «Взлёта» — в понятной системе подготовки</h1>
            <p>Сначала запоминаем ключевые выражения и факты, затем узнаём их в контексте и закрепляем в коротких тематических раундах.</p>
            <div className={styles.heroStats}>
              <span><BookOpenCheck /> {requirements.length} тем</span>
              <span><Brain /> {cards.length} карточек</span>
              <span><Zap /> {bank.length} заданий</span>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroGlowOne} />
            <div className={styles.heroGlowTwo} />
            <small>ТВОЙ МАРШРУТ</small>
            <strong>{group.label}</strong>
            <p>{group.subtitle}</p>
            <div className={styles.miniRoute}>
              <span><Brain /> Idioms</span>
              <span><Map /> Country studies</span>
              <span><Target /> Sprint</span>
            </div>
          </div>
        </section>

        <section className={styles.controls} aria-label="Выбор класса и этапа">
          <div className={styles.controlBlock}>
            <small>ВЫБЕРИ КЛАСС</small>
            <div className={styles.gradeSwitch}>
              {gradeOrder.map((key) => (
                <button key={key} className={gradeKey === key ? styles.activeGrade : ""} onClick={() => setGradeKey(key)}>
                  <b>{vzletPrepData[key].label}</b>
                  <span>{vzletPrepData[key].subtitle}</span>
                </button>
              ))}
            </div>
          </div>
          <div className={styles.controlBlock}>
            <small>ЭТАП ПОДГОТОВКИ</small>
            <div className={styles.stageSwitch}>
              {(["all", "school", "municipal"] as StageFilter[]).map((key) => (
                <button key={key} className={stage === key ? styles.activeStage : ""} onClick={() => setStage(key)}>
                  {key === "all" ? "Все темы" : stageLabel[key]}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.focusStrip}>
          <article className={styles.focusViolet}><Brain /><div><small>01 · ЗАПОМНИ</small><b>Идиомы</b><span>{idiomCards.length} карточек</span></div></article>
          <article className={styles.focusBlue}><Map /><div><small>02 · УЗНАЙ</small><b>Страноведение</b><span>{gradeKey === "7-8" ? "USA + animated films" : gradeKey === "9-10" ? "Great Britain + soundtracks" : "British history + soundtracks"}</span></div></article>
          <article className={styles.focusCoral}><Target /><div><small>03 · ПРОВЕРЬ</small><b>Olympiad Sprint</b><span>тематические и смешанные раунды</span></div></article>
        </section>

        <section className={styles.launcher}>
          <div className={styles.launcherHeading}>
            <div><small>QUICK START</small><h2>Выбери режим</h2></div>
            <span>{mistakesInCurrentBank.length} вопросов ждут повторения</span>
          </div>
          <div className={styles.modeGrid}>
            <button className={styles.modeIdiom} onClick={() => startQuiz("idioms")}>
              <Brain />
              <small>5–10 ВОПРОСОВ</small>
              <b>Idioms Sprint</b>
              <span>Только выражения из выбранного этапа.</span>
              <em>Начать <ArrowRight size={16} /></em>
            </button>
            <button className={styles.modeFilm} onClick={() => startQuiz("film")}>
              <Film />
              <small>{gradeKey === "7-8" ? "ANIMATED FILMS" : "FILM SOUNDTRACKS"}</small>
              <b>{gradeKey === "7-8" ? "Узнай мультфильм" : "Soundtrack Challenge"}</b>
              <span>{gradeKey === "7-8" ? "Сюжет, герой, ключевая деталь — без названия." : "Фильм, композитор и характер звучания."}</span>
              <em>Играть <ArrowRight size={16} /></em>
            </button>
            <button className={styles.modeCulture} onClick={() => startQuiz("culture")}>
              <Map />
              <small>COUNTRY STUDIES</small>
              <b>{gradeKey === "7-8" ? "Штаты США" : gradeKey === "9-10" ? "Great Britain" : "British History"}</b>
              <span>{gradeKey === "7-8" ? "Столицы, nicknames и характерные факты." : gradeKey === "9-10" ? "Страны, столицы и география Великобритании." : "Ключевые события XI–XVII веков."}</span>
              <em>Тренировать <ArrowRight size={16} /></em>
            </button>
            <button className={styles.modeMistakes} onClick={() => startQuiz("mistakes")}>
              <RotateCcw />
              <small>SMART REPEAT</small>
              <b>Мои ошибки</b>
              <span>{mistakesInCurrentBank.length ? `Сейчас сохранено: ${mistakesInCurrentBank.length}` : "Появятся автоматически после неверных ответов."}</span>
              <em>Повторить <ArrowRight size={16} /></em>
            </button>
            <button className={styles.modeMixed} onClick={() => startQuiz("mixed")}>
              <Target />
              <small>EXAM MIX</small>
              <b>Смешанный раунд</b>
              <span>Идиомы + страноведение + фильмы в одном спринте.</span>
              <em>Старт <ArrowRight size={16} /></em>
            </button>
          </div>
          {notice && <div className={styles.notice}>{notice}</div>}
        </section>

        {dailyIdiom && <section className={styles.dailyCard}>
          <div className={styles.dailyIcon}><Sparkles /></div>
          <div className={styles.dailyCopy}>
            <small>IDIOM OF THE DAY</small>
            <h2>{dailyIdiom.front}</h2>
            <p>{dailyIdiom.back}</p>
          </div>
          <div className={styles.dailyActions}>
            <button onClick={() => speak(dailyIdiom.front)}><Volume2 size={17} /> Слушать</button>
            <span>{dailyIdiom.tag}</span>
          </div>
        </section>}

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div><span>01</span><div><small>ROADMAP</small><h2>Что нужно знать</h2></div></div>
            {saved && <div className={styles.best}><Trophy size={17} /> Лучший результат: {saved.best}% · попыток {saved.attempts}</div>}
          </div>
          <div className={styles.requirementGrid}>
            {requirements.map((item) => (
              <article className={`${styles.requirement} ${item.area === "Idioms" ? styles.idiomReq : styles.cultureReq}`} key={`${item.stage}-${item.title}`}>
                <div className={styles.reqTop}>
                  <span className={item.stage === "municipal" ? styles.municipal : styles.school}>{item.stage === "municipal" ? "МУНИЦИПАЛЬНЫЙ" : "ШКОЛЬНЫЙ"}</span>
                  <b>{item.area}</b>
                </div>
                <h3>{item.title}</h3>
                <p>{item.details}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.studyGrid}>
          <article className={styles.deckPanel}>
            <div className={styles.panelHeading}>
              <div><small>02 · MEMORY DECK</small><h2>Карточки для запоминания</h2></div>
              <span>{cards.length ? cardIndex + 1 : 0} / {cards.length}</span>
            </div>
            {card ? <>
              <button className={`${styles.flashcard} ${flipped ? styles.flipped : ""}`} onClick={() => setFlipped((value) => !value)}>
                <div className={styles.cardTop}><span className={styles.cardTag}>{card.tag}</span><em>{stageLabel[card.stage]}</em></div>
                <strong>{flipped ? card.back : card.front}</strong>
                <small>{flipped ? "Нажми ещё раз, чтобы вернуться к термину" : "Вспомни значение сам → потом открой ответ"}</small>
              </button>
              <div className={styles.cardActions}>
                <button onClick={() => speak(card.front)}><Volume2 size={18} /> Произношение</button>
                <button onClick={() => { setCardIndex((value) => (value - 1 + cards.length) % cards.length); setFlipped(false); }}><ArrowLeft size={18} /> Назад</button>
                <button className={styles.nextCard} onClick={() => { setCardIndex((value) => (value + 1) % cards.length); setFlipped(false); }}>Следующая <ArrowRight size={18} /></button>
              </div>
            </> : <p>Для выбранного фильтра карточек пока нет.</p>}
          </article>

          <article className={styles.filmPanel}>
            <div className={styles.panelHeading}>
              <div><small>VISUAL MEMORY</small><h2>{gradeKey === "7-8" ? "Animated films" : "Film soundtracks"}</h2></div>
              <Film />
            </div>
            <p className={styles.muted}>{gradeKey === "7-8" ? "Учимся узнавать мультфильм по герою, ситуации и ключевой детали сюжета." : "Связываем фильм, композитора и характер звучания — так саундтреки запоминаются быстрее."}</p>
            <div className={styles.chips}>{filmList.map((film, index) => <span key={film}><i>{String(index + 1).padStart(2, "0")}</i>{film}</span>)}</div>
            <div className={styles.tip}><Flag size={17} /> Это авторская тренировка по заявленным темам «Взлёта»: задания не копируют упражнения из пособий.</div>
          </article>
        </section>

        <section id="culture-lab" className={styles.cultureLab}>
          <div className={styles.sectionHeading}>
            <div><span>03</span><div><small>COUNTRY LAB</small><h2>{gradeKey === "7-8" ? "USA State Wall" : gradeKey === "9-10" ? "Great Britain Quick Facts" : "British History Timeline"}</h2></div></div>
            <button className={styles.cultureStart} onClick={() => startQuiz("culture")}>Проверить себя <ArrowRight size={16} /></button>
          </div>
          {gradeKey === "11" ? (
            <div className={styles.timeline}>
              {historyCards.map((item) => (
                <article key={item.front}><span>{item.front.split("—")[0].trim()}</span><div><b>{item.front.split("—").slice(1).join("—").trim()}</b><p>{item.back}</p></div></article>
              ))}
            </div>
          ) : (
            <div className={styles.factGrid}>
              {cultureCards.slice(0, gradeKey === "7-8" ? 12 : 10).map((item) => (
                <article key={`${item.front}-${item.tag}`}><small>{item.tag}</small><b>{item.front}</b><p>{item.back}</p></article>
              ))}
            </div>
          )}
        </section>

        <section id="vzlet-sprint" className={styles.quizPanel}>
          <div className={styles.sectionHeading}>
            <div><span>04</span><div><small>OLYMPIAD SPRINT</small><h2>{modeLabel[quizMode]}</h2></div></div>
            <div className={styles.timer}><Clock3 size={17} /> до 10 вопросов · сразу разбираем ошибку</div>
          </div>

          {!quiz.length && !finished && <div className={styles.quizIntro}>
            <div className={styles.quizIntroIcon}><Zap /></div>
            <div><small>ГОТОВ К СПРИНТУ?</small><h3>Смешанный раунд по выбранным темам</h3><p>Вопросы перемешиваются, а после ответа появляется короткое объяснение.</p></div>
            <button onClick={() => startQuiz("mixed")}>Начать <ArrowRight size={18} /></button>
          </div>}

          {!!quiz.length && !finished && activeQuestion && <div className={styles.questionBox}>
            <div className={styles.questionMeta}><span>{questionIndex + 1} / {quiz.length}</span><b>{activeQuestion.tag}</b><em>{stageLabel[activeQuestion.stage]}</em><strong>{modeLabel[quizMode]}</strong></div>
            <div className={styles.quizBar}><span style={{ width: `${((questionIndex + (selected !== null ? 1 : 0)) / quiz.length) * 100}%` }} /></div>
            <h3>{activeQuestion.prompt}</h3>
            <div className={styles.options}>{activeQuestion.options.map((option, index) => {
              const answered = selected !== null;
              const isCorrect = index === activeQuestion.answer;
              const isSelected = index === selected;
              const className = answered ? (isCorrect ? styles.correct : isSelected ? styles.wrong : styles.dimmed) : "";
              return <button key={option} className={className} onClick={() => chooseAnswer(index)} disabled={answered}><span>{String.fromCharCode(65 + index)}</span>{option}{answered && isCorrect && <Check size={18} />}{answered && isSelected && !isCorrect && <X size={18} />}</button>;
            })}</div>
            {selected !== null && <div className={styles.explanation}><div><b>{selected === activeQuestion.answer ? "Верно — так держать" : "Вот где была ловушка"}</b><p>{activeQuestion.explanation}</p>{selected !== activeQuestion.answer && <small>Вопрос автоматически добавлен в «Мои ошибки».</small>}</div><button onClick={nextQuestion}>{questionIndex + 1 === quiz.length ? "Результат" : "Дальше"} <ArrowRight size={17} /></button></div>}
          </div>}

          {finished && <div className={styles.resultBox}><div className={styles.resultIcon}><Trophy /></div><div><small>РАУНД ЗАВЕРШЁН · {modeLabel[quizMode]}</small><h3>{score} / {quiz.length} · {quizPercent}%</h3><p>{quizPercent >= 80 ? "Сильный результат. Теперь можно пройти «Мои ошибки» или сменить тему." : quizPercent >= 60 ? "Хорошая база. Повтори ошибочные вопросы и пройди раунд ещё раз." : "Вернись к карточкам, затем запусти тематический раунд ещё раз."}</p></div><button onClick={() => startQuiz(quizMode)}><RotateCcw size={18} /> Ещё раз</button></div>}
        </section>

        <section className={styles.strategy}>
          <div className={styles.stepViolet}><span>1</span><BookOpen /><b>Изучи</b><p>Посмотри темы и пойми, что именно проверяют.</p></div>
          <div className={styles.stepBlue}><span>2</span><Brain /><b>Вспомни</b><p>Работай с карточками без подсматривания.</p></div>
          <div className={styles.stepPink}><span>3</span><Target /><b>Проверь</b><p>Выбери тематический или смешанный раунд.</p></div>
          <div className={styles.stepCoral}><span>4</span><RotateCcw /><b>Повтори</b><p>Режим «Мои ошибки» собирает слабые места сам.</p></div>
        </section>
      </div>
    </main>
  );
}
