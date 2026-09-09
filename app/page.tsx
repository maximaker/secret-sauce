"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Landing } from "@/components/Landing";
import { Progress } from "@/components/Progress";
import { QuestionScreen } from "@/components/QuestionScreen";
import { Reveal } from "@/components/Reveal";
import { StagePicker } from "@/components/StagePicker";
import { ACTS, QUESTIONS, type ActId } from "@/lib/questions";
import { buildResult, emptyAnswers, isComplete, type Answers } from "@/lib/scoring";
import { decodeAnswers, encodeAnswers } from "@/lib/share";
import { STAGES, type StageKey } from "@/lib/stages";

type Phase = "landing" | "stage" | "question" | "reveal";

const STORE_KEY = "secret-sauce/v1";
const HUE_LANDING = 258;
const HUE_REVEAL = 78;
const ADVANCE_MS = 340;

/** The first question of each act carries that act's framing line. */
const FIRST_OF_ACT = new Set(
  Object.values(
    QUESTIONS.reduce<Record<string, string>>((acc, q) => {
      if (!(q.act in acc)) acc[q.act] = q.id;
      return acc;
    }, {}),
  ),
);

export default function Page() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [hydrated, setHydrated] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const advanceTimer = useRef<number | null>(null);

  const question = QUESTIONS[index];
  const selected = useMemo(
    () => (question ? (answers.choices[question.id] ?? []) : []),
    [answers.choices, question],
  );

  /* ── Restore: a shared link wins over a local half-finished attempt ─── */
  useEffect(() => {
    const token = new URLSearchParams(window.location.hash.slice(1)).get("r");
    if (token) {
      const shared = decodeAnswers(token);
      if (shared && isComplete(shared)) {
        setAnswers(shared);
        setPhase("reveal");
        setHydrated(true);
        return;
      }
    }

    try {
      const stored = window.localStorage.getItem(STORE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as { answers: Answers; index: number };
        if (parsed?.answers?.stage) {
          setAnswers({ ...emptyAnswers(), ...parsed.answers });
          setIndex(Math.min(Math.max(parsed.index ?? 0, 0), QUESTIONS.length - 1));
          setHasSaved(true);
        }
      }
    } catch {
      /* corrupt or unavailable storage — start clean */
    }
    setHydrated(true);
  }, []);

  /* ── Persist ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!hydrated || phase === "landing") return;
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify({ answers, index }));
    } catch {
      /* private mode / quota — the journey still works, it just won't resume */
    }
  }, [answers, index, phase, hydrated]);

  /* ── The world's colour follows the act ──────────────────────────────── */
  const activeAct: ActId | null =
    phase === "question" && question ? question.act : phase === "stage" ? "calibrate" : null;

  useEffect(() => {
    const hue =
      phase === "reveal" ? HUE_REVEAL : activeAct ? ACTS[activeAct].hue : HUE_LANDING;
    document.documentElement.style.setProperty("--hue", String(hue));
  }, [activeAct, phase]);

  /* ── Navigation ──────────────────────────────────────────────────────── */

  const clearTimer = () => {
    if (advanceTimer.current !== null) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  };

  useEffect(() => clearTimer, []);

  const goNext = useCallback(() => {
    clearTimer();
    setIndex((current) => {
      if (current >= QUESTIONS.length - 1) {
        setPhase("reveal");
        return current;
      }
      return current + 1;
    });
  }, []);

  const goBack = useCallback(() => {
    clearTimer();
    if (phase === "reveal") {
      setPhase("question");
      setIndex(QUESTIONS.length - 1);
      return;
    }
    if (phase === "question") {
      if (index === 0) setPhase("stage");
      else setIndex((n) => n - 1);
      return;
    }
    if (phase === "stage") setPhase("landing");
  }, [index, phase]);

  const pickStage = useCallback((stage: StageKey) => {
    setAnswers((prev) => ({ ...prev, stage }));
    clearTimer();
    advanceTimer.current = window.setTimeout(() => {
      setPhase("question");
      setIndex(0);
    }, ADVANCE_MS);
  }, []);

  const toggle = useCallback(
    (optionId: string) => {
      if (!question || question.kind === "text") return;

      if (question.kind === "multi") {
        setAnswers((prev) => {
          const current = prev.choices[question.id] ?? [];
          const next = current.includes(optionId)
            ? current.filter((id) => id !== optionId)
            : current.length >= question.maxPicks
              ? current
              : [...current, optionId];
          return { ...prev, choices: { ...prev.choices, [question.id]: next } };
        });
        return;
      }

      // Single-select advances on its own: one tap per question, not two.
      setAnswers((prev) => ({
        ...prev,
        choices: { ...prev.choices, [question.id]: [optionId] },
      }));
      clearTimer();
      advanceTimer.current = window.setTimeout(goNext, ADVANCE_MS);
    },
    [goNext, question],
  );

  const canContinue = (() => {
    if (phase === "stage") return Boolean(answers.stage);
    if (phase !== "question" || !question) return false;
    if (question.kind === "text") return true;
    if (question.kind === "multi") return selected.length >= question.minPicks;
    return selected.length > 0;
  })();

  /* ── Keyboard ────────────────────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA";

      if (event.key === "Enter") {
        if (phase === "landing") {
          event.preventDefault();
          setPhase(answers.stage ? "question" : "stage");
          return;
        }
        if (phase === "stage" && answers.stage) {
          event.preventDefault();
          setPhase("question");
          setIndex(0);
          return;
        }
        if (phase === "question" && canContinue) {
          event.preventDefault();
          goNext();
        }
        return;
      }

      if (typing) return;

      if (event.key === "Backspace" || event.key === "ArrowLeft") {
        if (phase !== "landing") {
          event.preventDefault();
          goBack();
        }
        return;
      }

      if (/^[1-8]$/.test(event.key)) {
        const slot = Number(event.key) - 1;
        if (phase === "stage") {
          const keys: StageKey[] = ["teen", "early", "mid", "senior"];
          if (keys[slot]) pickStage(keys[slot]);
          return;
        }
        if (phase === "question" && question && question.kind !== "text") {
          const option = question.options[slot];
          if (option) toggle(option.id);
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answers.stage, canContinue, goBack, goNext, phase, pickStage, question, toggle]);

  /* Bring each new screen into view on small screens. */
  useEffect(() => {
    if (phase === "question" || phase === "reveal") window.scrollTo({ top: 0 });
  }, [index, phase]);

  const answeredByAct = useMemo(() => {
    const counts: Record<ActId, number> = {
      calibrate: answers.stage ? 1 : 0,
      energy: 0,
      ease: 0,
      evidence: 0,
      edge: 0,
    };
    for (const q of QUESTIONS) {
      const done =
        q.kind === "text" ? answers.line.trim().length > 0 || index > QUESTIONS.indexOf(q) : (answers.choices[q.id]?.length ?? 0) > 0;
      if (done) counts[q.act] += 1;
    }
    return counts;
  }, [answers, index]);

  const result = useMemo(
    () => (phase === "reveal" && isComplete(answers) ? buildResult(answers) : null),
    [answers, phase],
  );

  const shareUrl = useMemo(() => {
    if (!result || typeof window === "undefined") return "";
    return `${window.location.origin}${window.location.pathname}#r=${encodeAnswers(answers)}`;
  }, [answers, result]);

  /* Reflect the finished result in the address bar so a refresh keeps it. */
  useEffect(() => {
    if (phase === "reveal" && result) {
      window.history.replaceState(null, "", `#r=${encodeAnswers(answers)}`);
    }
  }, [answers, phase, result]);

  const restart = () => {
    clearTimer();
    try {
      window.localStorage.removeItem(STORE_KEY);
    } catch {
      /* nothing to clear */
    }
    window.history.replaceState(null, "", window.location.pathname);
    setAnswers(emptyAnswers());
    setIndex(0);
    setHasSaved(false);
    setPhase("landing");
  };

  if (!hydrated) return <main className="shell" aria-busy="true" />;

  const inJourney = phase === "stage" || phase === "question";

  return (
    <main className="shell">
      <div className="topbar">
        <span className="wordmark">
          <span className="dot" aria-hidden="true" />
          Secret Sauce
        </span>
        {answers.stage && phase !== "landing" ? (
          <span className="stage-tag">{STAGES[answers.stage].currency}</span>
        ) : null}
      </div>

      {inJourney ? <Progress answeredByAct={answeredByAct} /> : null}

      <div className="main">
        {phase === "landing" ? (
          <Landing
            hasSaved={hasSaved}
            onBegin={() => setPhase(answers.stage ? "question" : "stage")}
          />
        ) : null}

        {phase === "stage" ? <StagePicker value={answers.stage} onPick={pickStage} /> : null}

        {phase === "question" && question ? (
          <QuestionScreen
            question={question}
            selected={selected}
            line={answers.line}
            showActIntro={FIRST_OF_ACT.has(question.id)}
            onToggle={toggle}
            onLineChange={(line) => setAnswers((prev) => ({ ...prev, line }))}
          />
        ) : null}

        {phase === "reveal" && result ? (
          <Reveal result={result} shareUrl={shareUrl} onRestart={restart} />
        ) : null}

        {phase === "reveal" && !result ? (
          <div className="canvas enter">
            <h2 className="display question-title">That link didn&rsquo;t hold up.</h2>
            <p className="hint">
              The result in the address bar is incomplete or from an older version. Four
              minutes and you&rsquo;ll have your own.
            </p>
            <div className="hero-actions" style={{ marginTop: "2rem" }}>
              <button className="btn btn--primary" onClick={restart}>
                Start the journey
              </button>
            </div>
          </div>
        ) : null}

        {inJourney ? (
          <div className="footbar">
            <button className="btn btn--quiet" onClick={goBack}>
              ← Back
            </button>

            {phase === "question" && question ? (
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span className="keyhint">
                  {question.kind === "text" ? (
                    <>
                      <kbd>Enter</kbd> to continue
                    </>
                  ) : (
                    <>
                      <kbd>1</kbd>–<kbd>{question.options.length}</kbd> to choose
                    </>
                  )}
                </span>
                <button
                  className="btn btn--accent"
                  disabled={!canContinue}
                  onClick={goNext}
                >
                  {question.kind === "text" && !answers.line.trim()
                    ? "Skip this one"
                    : index === QUESTIONS.length - 1
                      ? "See your sauce"
                      : "Continue"}
                </button>
              </div>
            ) : (
              <span className="keyhint">
                <kbd>1</kbd>–<kbd>4</kbd> to choose
              </span>
            )}
          </div>
        ) : null}
      </div>
    </main>
  );
}
