"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Film, Map, RotateCcw, Shuffle, Sparkles, Trophy, X } from "lucide-react";
import { type VzletGradeKey, type VzletQuestion, vzletPrepData } from "@/data/vzlet-prep";
import styles from "./visual-challenge.module.css";

type VisualMode = "film" | "culture";
type VisualSpec = {
  mode: VisualMode;
  icons: [string, string, string];
  hint: string;
  tone: "violet" | "blue" | "mint" | "coral" | "gold";
};

const gradeOrder: VzletGradeKey[] = ["7-8", "9-10", "11"];

const visualSpecs: Record<string, VisualSpec> = {
  "78-7": { mode: "film", icons: ["🎸", "🌼", "🌙"], hint: "music • family • memory", tone: "violet" },
  "78-8": { mode: "film", icons: ["👨‍🍳", "🐭", "🗼"], hint: "chef • tiny hero • Paris", tone: "coral" },
  "78-9": { mode: "film", icons: ["🧠", "😊", "😰"], hint: "mind • emotions • growing up", tone: "blue" },
  "78-10": { mode: "film", icons: ["🐉", "🛡️", "🌊"], hint: "Viking world • friendship • dragon", tone: "mint" },
  "78-11": { mode: "film", icons: ["🌿", "🏚️", "🟢"], hint: "swamp • privacy • unusual hero", tone: "mint" },
  "78-12": { mode: "film", icons: ["🏎️", "🏁", "🏜️"], hint: "race • road • winning isn't everything", tone: "coral" },
  "78-13": { mode: "culture", icons: ["🌴", "🎬", "🌉"], hint: "Pacific coast • cinema • tech", tone: "gold" },
  "78-14": { mode: "culture", icons: ["⭐", "🤠", "🌵"], hint: "one star • wide open spaces • South", tone: "coral" },
  "78-15": { mode: "culture", icons: ["🍎", "🏙️", "🏛️"], hint: "famous city ≠ state capital", tone: "violet" },
  "78-16": { mode: "culture", icons: ["🌺", "🌋", "🏝️"], hint: "Pacific islands • volcanoes • aloha", tone: "mint" },
  "78-17": { mode: "culture", icons: ["☀️", "🐊", "🌴"], hint: "sunshine • peninsula • warm coast", tone: "gold" },
  "78-18": { mode: "culture", icons: ["❄️", "🏔️", "🐻"], hint: "largest state • northern frontier", tone: "blue" },
  "78-19": { mode: "culture", icons: ["⛰️", "🗿", "🌾"], hint: "famous mountain memorial • Great Plains", tone: "gold" },
  "78-20": { mode: "culture", icons: ["🌲", "🏔️", "🌧️"], hint: "Evergreen State • Pacific Northwest", tone: "mint" },

  "910-9": { mode: "film", icons: ["🪐", "⏳", "🎹"], hint: "space • time • organ", tone: "blue" },
  "910-10": { mode: "film", icons: ["🪄", "🏰", "✨"], hint: "magic • castle • celesta", tone: "violet" },
  "910-11": { mode: "film", icons: ["🏴‍☠️", "⛵", "🧭"], hint: "sea adventure • pirates • orchestra", tone: "coral" },
  "910-12": { mode: "film", icons: ["🌌", "🎹", "⏱️"], hint: "cosmos • organ • time", tone: "blue" },
  "910-13": { mode: "film", icons: ["💍", "⛰️", "🗺️"], hint: "Middle-earth • journey • leitmotifs", tone: "gold" },
  "910-14": { mode: "culture", icons: ["🏰", "⛰️", "🐉"], hint: "three countries on one island", tone: "mint" },
  "910-15": { mode: "culture", icons: ["🧩", "🇬🇧", "☘️"], hint: "four parts make the United Kingdom", tone: "blue" },
  "910-16": { mode: "culture", icons: ["🏰", "⛰️", "🎻"], hint: "Scotland • historic capital", tone: "violet" },
  "910-17": { mode: "culture", icons: ["🐉", "🏟️", "🏰"], hint: "Wales • red dragon • capital", tone: "coral" },
  "910-18": { mode: "culture", icons: ["🏔️", "🥾", "🌧️"], hint: "highest point in the UK", tone: "blue" },
  "910-19": { mode: "culture", icons: ["🌊", "⛴️", "🇫🇷"], hint: "water between England and France", tone: "mint" },
  "910-20": { mode: "culture", icons: ["⚓", "☘️", "🏙️"], hint: "Northern Ireland • capital city", tone: "gold" },

  "11-9": { mode: "film", icons: ["💻", "🟩", "☎️"], hint: "code • simulation • 1999", tone: "mint" },
  "11-10": { mode: "film", icons: ["🤖", "🛡️", "⚡"], hint: "superheroes • AI villain • two composers", tone: "coral" },
  "11-11": { mode: "film", icons: ["⏱️", "🏜️", "🎼"], hint: "time-bending city + desert planet", tone: "gold" },
  "11-12": { mode: "culture", icons: ["⚔️", "🛡️", "🏰"], hint: "1066 • conquest • Hastings", tone: "coral" },
  "11-13": { mode: "culture", icons: ["📜", "👑", "✒️"], hint: "1215 • king • charter", tone: "gold" },
  "11-14": { mode: "culture", icons: ["🌹", "⚔️", "👑"], hint: "1485 • Bosworth • new dynasty", tone: "coral" },
  "11-15": { mode: "culture", icons: ["👑", "⛪", "📜"], hint: "1534 • Crown • Church", tone: "violet" },
  "11-16": { mode: "culture", icons: ["⛵", "🌊", "👑"], hint: "1588 • Armada • queen", tone: "blue" },
  "11-17": { mode: "culture", icons: ["👑", "🤝", "🏴"], hint: "1603 • one monarch • two crowns", tone: "mint" },
  "11-18": { mode: "culture", icons: ["⚖️", "👑", "📜"], hint: "1649 • Charles I", tone: "coral" },
  "11-19": { mode: "culture", icons: ["👑", "🎉", "🏰"], hint: "1660 • monarchy returns", tone: "gold" },
  "11-20": { mode: "culture", icons: ["🔄", "👑", "📜"], hint: "1688–1689 • revolution • rights", tone: "violet" },
};

function gradeFromProfile(value: number): VzletGradeKey {
  if (value >= 11) return "11";
  if (value >= 9) return "9-10";
  return "7-8";
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function Poster({ spec }: { spec: VisualSpec }) {
  return (
    <div className={`${styles.poster} ${styles[`tone_${spec.tone}`]}`}>
      <div className={styles.orbOne} />
      <div className={styles.orbTwo} />
      <span className={styles.posterLabel}>VISUAL CLUE</span>
      <div className={styles.iconStage} aria-hidden="true">
        <span>{spec.icons[0]}</span>
        <span>{spec.icons[1]}</span>
        <span>{spec.icons[2]}</span>
      </div>
      <p>{spec.hint}</p>
    </div>
  );
}

export default function VisualChallenge() {
  const [gradeKey, setGradeKey] = useState<VzletGradeKey>("7-8");
  const [mode, setMode] = useState<VisualMode>("film");
  const [round, setRound] = useState<VzletQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [best, setBest] = useState(0);

  useEffect(() => {
    try {
      const profile = JSON.parse(localStorage.getItem("studentProfile") || "null") as { grade?: string } | null;
      if (profile?.grade) setGradeKey(gradeFromProfile(Number(profile.grade)));
    } catch {
      // Safe default stays 7–8.
    }
  }, []);

  const available = useMemo(
    () => vzletPrepData[gradeKey].questions.filter((question) => visualSpecs[question.id]?.mode === mode),
    [gradeKey, mode],
  );

  const active = round[index];
  const spec = active ? visualSpecs[active.id] : null;

  function loadBest(nextGrade = gradeKey, nextMode = mode) {
    try {
      setBest(Number(localStorage.getItem(`vzletVisualBest:${nextGrade}:${nextMode}`) || 0));
    } catch {
      setBest(0);
    }
  }

  function start(nextMode = mode) {
    setMode(nextMode);
    const source = vzletPrepData[gradeKey].questions.filter((question) => visualSpecs[question.id]?.mode === nextMode);
    setRound(shuffle(source));
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    loadBest(gradeKey, nextMode);
  }

  useEffect(() => {
    start(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradeKey]);

  function choose(answerIndex: number) {
    if (!active || selected !== null) return;
    setSelected(answerIndex);
    if (answerIndex === active.answer) setScore((value) => value + 1);
  }

  function next() {
    if (!active || selected === null) return;
    if (index + 1 < round.length) {
      setIndex((value) => value + 1);
      setSelected(null);
      return;
    }
    const finalScore = score;
    const percent = round.length ? Math.round((finalScore / round.length) * 100) : 0;
    const nextBest = Math.max(best, percent);
    setBest(nextBest);
    try {
      localStorage.setItem(`vzletVisualBest:${gradeKey}:${mode}`, String(nextBest));
    } catch {
      // Ignore storage restrictions.
    }
    setFinished(true);
  }

  const percent = round.length ? Math.round((score / round.length) * 100) : 0;

  return (
    <section className={styles.pageBand}>
      <div className={styles.shell}>
        <div className={styles.heading}>
          <div>
            <span><Sparkles size={15} /> NEW · VISUAL MEMORY</span>
            <h2>Смотри на картинку — вспоминай факт</h2>
            <p>Визуальные подсказки помогают быстро связать сюжет, страну, событие или саундтрек с правильным ответом.</p>
          </div>
          <div className={styles.best}><Trophy size={18} /> лучший результат: {best}%</div>
        </div>

        <div className={styles.controls}>
          <div className={styles.gradeSwitch}>
            {gradeOrder.map((key) => (
              <button key={key} className={gradeKey === key ? styles.active : ""} onClick={() => setGradeKey(key)}>
                {vzletPrepData[key].label}
              </button>
            ))}
          </div>
          <div className={styles.modeSwitch}>
            <button className={mode === "film" ? styles.activeMode : ""} onClick={() => start("film")}><Film size={17} /> {gradeKey === "7-8" ? "Мультфильмы" : "Саундтреки"}</button>
            <button className={mode === "culture" ? styles.activeMode : ""} onClick={() => start("culture")}><Map size={17} /> {gradeKey === "7-8" ? "USA" : gradeKey === "9-10" ? "Great Britain" : "British History"}</button>
          </div>
        </div>

        {!finished && active && spec && (
          <div className={styles.gameGrid}>
            <Poster spec={spec} />
            <div className={styles.questionCard}>
              <div className={styles.meta}>
                <span>{index + 1} / {round.length}</span>
                <b>{active.tag}</b>
                <button onClick={() => start(mode)} title="Перемешать"><Shuffle size={16} /> Перемешать</button>
              </div>
              <div className={styles.progress}><span style={{ width: `${((index + (selected !== null ? 1 : 0)) / round.length) * 100}%` }} /></div>
              <h3>{active.prompt}</h3>
              <div className={styles.options}>
                {active.options.map((option, optionIndex) => {
                  const answered = selected !== null;
                  const isCorrect = optionIndex === active.answer;
                  const isSelected = optionIndex === selected;
                  const stateClass = answered ? (isCorrect ? styles.correct : isSelected ? styles.wrong : styles.dimmed) : "";
                  return (
                    <button key={option} className={stateClass} disabled={answered} onClick={() => choose(optionIndex)}>
                      <span>{String.fromCharCode(65 + optionIndex)}</span>
                      {option}
                      {answered && isCorrect && <Check size={18} />}
                      {answered && isSelected && !isCorrect && <X size={18} />}
                    </button>
                  );
                })}
              </div>
              {selected !== null && (
                <div className={styles.feedback}>
                  <div>
                    <b>{selected === active.answer ? "Точно! Визуальная ассоциация сработала." : "Запомни связку картинки и факта."}</b>
                    <p>{active.explanation}</p>
                  </div>
                  <button onClick={next}>{index + 1 === round.length ? "Результат" : "Следующая"} <ArrowRight size={17} /></button>
                </div>
              )}
            </div>
          </div>
        )}

        {finished && (
          <div className={styles.result}>
            <div className={styles.resultIcon}><Trophy /></div>
            <div>
              <small>VISUAL ROUND COMPLETE</small>
              <h3>{score} / {round.length} · {percent}%</h3>
              <p>{percent >= 80 ? "Визуальные ассоциации уже закрепились очень хорошо." : percent >= 60 ? "Хорошая база — повтори ещё раз, чтобы картинки начали вспоминаться автоматически." : "Пройди раунд ещё раз: на втором круге связи запоминаются заметно быстрее."}</p>
            </div>
            <button onClick={() => start(mode)}><RotateCcw size={17} /> Ещё раз</button>
          </div>
        )}

        <div className={styles.miniGallery}>
          {available.slice(0, 6).map((question) => {
            const preview = visualSpecs[question.id];
            return <div key={question.id} className={`${styles.miniPoster} ${styles[`tone_${preview.tone}`]}`}><span>{preview.icons.join("  ")}</span><small>{preview.hint}</small></div>;
          })}
        </div>
      </div>
    </section>
  );
}
