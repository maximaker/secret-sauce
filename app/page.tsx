"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Landing } from "@/components/Landing";
import { Progress } from "@/components/Progress";
import { QuestionScreen } from "@/components/QuestionScreen";
import { Reveal } from "@/components/Reveal";
import { StagePicker } from "@/components/StagePicker";
import {
  ACTS,
  CORE_ACTS,
  CORE_QUESTIONS,
  DEEP_ACTS,
  DEEP_QUESTIONS,
  type ActId,
  type Question,
} from "@/lib/questions";
import { buildResult, emptyAnswers, hasDeep, isComplete, type Answers } from "@/lib/scoring";
import { decodeAnswers, encodeAnswers } from "@/lib/share";
import { STAGES, type StageKey } from "@/lib/stages";

type Phase = "landing" | "stage" | "question" | "reveal";
type Round = "core" | "deep";

const STORE_KEY = "secret-sauce/v2";
const PREFS_KEY = "secret-sauce/prefs";
const HUE_LANDING = 258;
const HUE_REVEAL = 78;
const ADVANCE_MS = 340;

/** The first question of each act carries that act's framing line. */
const FIRST_OF_ACT = new Set(
  Object.values(
    [...CORE_QUESTIONS, ...DEEP_QUESTIONS].reduce<Record<string, string>>((acc, q) => {
      if (!(q.act in acc)) acc[q.act] = q.id;
      return acc;
    }, {}),
  ),
);

export default function Page() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [round, setRound] = useState<Round>("core");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [hydrated, setHydrated] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  /**
   * Timed navigation suits most people and halves the taps, but it is hostile
   * to anyone who needs longer than a third of a second to register that they
   * answered — screen reader and switch users especially. It stays the default
   * and stays switchable.
   */
  const [autoAdvance, setAutoAdvance] = useState(true);
  const advanceTimer = useRef<number | null>(null);
  /** The question visible right now, read by the auto-advance timer. */
  const currentQid = useRef<string | undefined>(undefined);
  const autoAdvanceRef = useRef(true);
  autoAdvanceRef.current = autoAdvance;

  const deck: Question[] = round === "core" ? CORE_QUESTIONS : DEEP_QUESTIONS;
  const question = deck[index];
  currentQid.current = question?.id;
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
      if (window.localStorage.getItem(PREFS_KEY) === "manual") setAutoAdvance(false);
    } catch {
      /* storage unavailable — the default stands */
    }

    try {
      const stored = window.localStorage.getItem(STORE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as { answers: Answers; index: number; round?: Round };
        if (parsed?.answers?.stage) {
          const restoredRound: Round = parsed.round === "deep" ? "deep" : "core";
          const size = (restoredRound === "core" ? CORE_QUESTIONS : DEEP_QUESTIONS).length;
          setAnswers({ ...emptyAnswers(), ...parsed.answers });
          setRound(restoredRound);
          setIndex(Math.min(Math.max(parsed.index ?? 0, 0), size - 1));
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
      window.localStorage.setItem(STORE_KEY, JSON.stringify({ answers, index, round }));
    } catch {
      /* private mode / quota — the journey still works, it just won't resume */
    }
  }, [answers, index, round, phase, hydrated]);

  /* ── The world's colour follows the act ──────────────────────────────── */
  const activeAct: ActId | null =
    phase === "question" && question ? question.act : phase === "stage" ? "calibrate" : null;

  useEffect(() => {
    const hue = phase === "reveal" ? HUE_REVEAL : activeAct ? ACTS[activeAct].hue : HUE_LANDING;
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

  /**
   * Arm the auto-advance, tagged with the question it belongs to. A timer that
   * outlives its own screen — a fast double tap, a re-render landing between
   * arm and fire — must not push the deck forward a second time and skip the
   * next question entirely.
   */
  const armAdvance = useCallback(
    (forQuestionId: string) => {
      clearTimer();
      if (!autoAdvanceRef.current) return;
      advanceTimer.current = window.setTimeout(() => {
        if (currentQid.current !== forQuestionId) return;
        goNextRef.current();
      }, ADVANCE_MS);
    },
    [],
  );

  const goNextRef = useRef<() => void>(() => {});

  const goNext = useCallback(() => {
    clearTimer();
    setIndex((current) => {
      if (current >= deck.length - 1) {
        setPhase("reveal");
        return current;
      }
      return current + 1;
    });
  }, [deck.length]);

  goNextRef.current = goNext;

  const goBack = useCallback(() => {
    clearTimer();
    if (phase === "reveal") {
      setPhase("question");
      setIndex(deck.length - 1);
      return;
    }
    if (phase === "question") {
      if (index > 0) setIndex((n) => n - 1);
      else if (round === "deep") setPhase("reveal");
      else setPhase("stage");
      return;
    }
    if (phase === "stage") setPhase("landing");
  }, [deck.length, index, phase, round]);

  const beginCore = useCallback(() => {
    setRound("core");
    setPhase("question");
    setIndex(0);
  }, []);

  const pickStage = useCallback(
    (stage: StageKey) => {
      setAnswers((prev) => ({ ...prev, stage }));
      clearTimer();
      if (!autoAdvanceRef.current) return;
      advanceTimer.current = window.setTimeout(beginCore, ADVANCE_MS);
    },
    [beginCore],
  );

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
      armAdvance(question.id);
    },
    [armAdvance, question],
  );

  const startDeep = useCallback(() => {
    clearTimer();
    setRound("deep");
    setIndex(0);
    setPhase("question");
  }, []);

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
          if (answers.stage) beginCore();
          else setPhase("stage");
          return;
        }
        if (phase === "stage" && answers.stage) {
          event.preventDefault();
          beginCore();
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
  }, [answers.stage, beginCore, canContinue, goBack, goNext, phase, pickStage, question, toggle]);

  useEffect(() => {
    if (phase === "question" || phase === "reveal") window.scrollTo({ top: 0 });
  }, [index, phase, round]);

  const answeredByAct = useMemo(() => {
    const counts = {} as Record<ActId, number>;
    for (const id of Object.keys(ACTS) as ActId[]) counts[id] = 0;
    counts.calibrate = answers.stage ? 1 : 0;
    deck.forEach((q, i) => {
      const done =
        q.kind === "text"
          ? answers.line.trim().length > 0 || index > i
          : (answers.choices[q.id]?.length ?? 0) > 0;
      if (done) counts[q.act] += 1;
    });
    return counts;
  }, [answers, deck, index]);

  const result = useMemo(
    () => (phase === "reveal" && isComplete(answers) ? buildResult(answers) : null),
    [answers, phase],
  );

  const shareUrl = useMemo(() => {
    if (!result || typeof window === "undefined") return "";
    return `${window.location.origin}${window.location.pathname}#r=${encodeAnswers(answers)}`;
  }, [answers, result]);

  useEffect(() => {
    if (phase === "reveal" && result) {
      window.history.replaceState(null, "", `#r=${encodeAnswers(answers)}`);
    }
  }, [answers, phase, result]);

  const flipAutoAdvance = () => {
    clearTimer();
    setAutoAdvance((on) => {
      const next = !on;
      try {
        window.localStorage.setItem(PREFS_KEY, next ? "auto" : "manual");
      } catch {
        /* preference just won't persist */
      }
      return next;
    });
  };

  const restart = () => {
    clearTimer();
    try {
      window.localStorage.removeItem(STORE_KEY);
    } catch {
      /* nothing to clear */
    }
    window.history.replaceState(null, "", window.location.pathname);
    setAnswers(emptyAnswers());
    setRound("core");
    setIndex(0);
    setHasSaved(false);
    setPhase("landing");
  };

  if (!hydrated) return <main className="shell" aria-busy="true" />;

  const inJourney = phase === "stage" || phase === "question";
  const lastOfDeck = index === deck.length - 1;

  return (
    <main className="shell">
      <div className="topbar">
        <span className="wordmark">
          <span className="dot" aria-hidden="true" />
          Secret Sauce
        </span>
        {answers.stage && phase !== "landing" ? (
          <span className="stage-tag">
            {round === "deep" && phase === "question"
              ? "Going deeper"
              : STAGES[answers.stage].currency}
          </span>
        ) : null}
      </div>

      {inJourney ? (
        <Progress acts={round === "core" ? CORE_ACTS : DEEP_ACTS} answeredByAct={answeredByAct} />
      ) : null}

      <div className="main">
        {phase === "landing" ? (
          <Landing
            hasSaved={hasSaved}
            onBegin={() => (answers.stage ? beginCore() : setPhase("stage"))}
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
          <Reveal
            result={result}
            shareUrl={shareUrl}
            onRestart={restart}
            onDeepen={hasDeep(answers) ? null : startDeep}
            deepCount={DEEP_QUESTIONS.length}
          />
        ) : null}

        {phase === "reveal" && !result ? (
          <div className="canvas enter">
            <h2 className="display question-title">That link didn&rsquo;t hold up.</h2>
            <p className="hint">
              The result in the address bar is incomplete or from an older version. Five
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
            <div className="footbar-actions">
              <button className="btn btn--quiet" onClick={goBack}>
                ← Back
              </button>
              <button
                className="btn btn--quiet pref-toggle"
                onClick={flipAutoAdvance}
                aria-pressed={autoAdvance}
                title="When on, choosing an answer moves you to the next question automatically."
              >
                Auto-advance {autoAdvance ? "on" : "off"}
              </button>
            </div>

            {phase === "question" && question ? (
              <div className="footbar-actions">
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
                <button className="btn btn--accent" disabled={!canContinue} onClick={goNext}>
                  {question.kind === "text" && !answers.line.trim()
                    ? "Skip this one"
                    : lastOfDeck
                      ? round === "deep"
                        ? "See the full picture"
                        : "See your sauce"
                      : "Continue"}
                </button>
              </div>
            ) : (
              <div className="footbar-actions">
                <span className="keyhint">
                  <kbd>1</kbd>–<kbd>4</kbd> to choose
                </span>
                {!autoAdvance ? (
                  <button
                    className="btn btn--accent"
                    disabled={!canContinue}
                    onClick={beginCore}
                  >
                    Continue
                  </button>
                ) : null}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </main>
  );
}
