import { ARCHETYPES, type Archetype } from "./archetypes";
import { ACT_WEIGHT, QUESTIONS, type Option, type Question } from "./questions";
import {
  SIGNALS,
  SIGNAL_KEYS,
  ZERO_VECTOR,
  type FullVector,
  type SignalKey,
} from "./signals";
import { STAGES, type StageKey } from "./stages";

export type Answers = {
  stage: StageKey | null;
  /** questionId → selected option ids */
  choices: Record<string, string[]>;
  /** The one optional free-text line. */
  line: string;
};

export const emptyAnswers = (): Answers => ({ stage: null, choices: {}, line: "" });

const OPTION_INDEX = new Map<string, { option: Option; question: Question }>();
for (const q of QUESTIONS) {
  if (q.kind === "text") continue;
  for (const option of q.options) OPTION_INDEX.set(option.id, { option, question: q });
}

export const findOption = (id: string) => OPTION_INDEX.get(id)?.option;

/** Sum every selected option's vector, weighted by which act it came from. */
export function rawVector(answers: Answers): FullVector {
  const total = ZERO_VECTOR();
  for (const ids of Object.values(answers.choices)) {
    for (const id of ids) {
      const entry = OPTION_INDEX.get(id);
      if (!entry) continue;
      const weight = ACT_WEIGHT[entry.question.act];
      for (const [key, value] of Object.entries(entry.option.vector)) {
        total[key as SignalKey] += (value ?? 0) * weight;
      }
    }
  }
  return total;
}

const magnitude = (vec: FullVector) =>
  Math.sqrt(SIGNAL_KEYS.reduce((sum, k) => sum + vec[k] * vec[k], 0));

function cosine(a: FullVector, b: FullVector): number {
  const denom = magnitude(a) * magnitude(b);
  if (denom === 0) return 0;
  return SIGNAL_KEYS.reduce((sum, k) => sum + a[k] * b[k], 0) / denom;
}

export type SignalReading = {
  key: SignalKey;
  label: string;
  gloss: string;
  /** 0–100, relative to the user's own strongest signal. */
  strength: number;
};

export type Result = {
  archetype: Archetype;
  /** Second-best match — shown as "you also carry a strong streak of…" */
  runnerUp: Archetype;
  readings: SignalReading[];
  topSignals: SignalKey[];
  sauceSentence: string;
  stage: StageKey;
  moves: string[];
  /** How decisive the match was, 0–1. Used only to pick a hedging phrase. */
  confidence: number;
};

/** Ranked archetype matches, most similar first. Deterministic tie-breaks. */
function rankArchetypes(user: FullVector): { archetype: Archetype; score: number }[] {
  return ARCHETYPES.map((archetype, index) => ({
    archetype,
    index,
    score: cosine(user, archetype.vector),
  }))
    .sort((a, b) => {
      if (Math.abs(b.score - a.score) > 1e-9) return b.score - a.score;
      // Tie-break 1: whoever's primary signal the user scored higher on.
      const byPrimary = user[b.archetype.primary] - user[a.archetype.primary];
      if (Math.abs(byPrimary) > 1e-9) return byPrimary;
      // Tie-break 2: fixed declaration order, so results are reproducible.
      return a.index - b.index;
    })
    .map(({ archetype, score }) => ({ archetype, score }));
}

/** Selected option ids for a question, in the order the bank declares them. */
function phrasesFor(answers: Answers, questionId: string): string[] {
  const question = QUESTIONS.find((q) => q.id === questionId);
  if (!question || question.kind === "text") return [];
  const picked = new Set(answers.choices[questionId] ?? []);
  return question.options.filter((o) => picked.has(o.id) && o.phrase).map((o) => o.phrase!);
}

/** Trim, strip a trailing full stop, and lowercase a leading capital. */
function tidyLine(raw: string): string {
  const text = raw.trim().replace(/[.\s]+$/, "");
  if (!text) return "";
  // Leave acronyms and "I" alone; only downcase an ordinary sentence-initial word.
  const [first, ...rest] = text;
  const looksLikeAcronym = /[A-Z]/.test(text[1] ?? "");
  return looksLikeAcronym ? text : first.toLowerCase() + rest.join("");
}

/**
 * The composed sentence at the centre of the reveal.
 *
 * Built from the user's own selections rather than a template with a name
 * dropped into it — that difference is most of why the result feels earned.
 */
function composeSauce(answers: Answers, archetype: Archetype): string {
  const ease = phrasesFor(answers, "a1")[0] ?? phrasesFor(answers, "a3")[0];
  const edge = phrasesFor(answers, "g1")[0];
  const evidenceFromChoices = phrasesFor(answers, "v1")[0];
  const line = tidyLine(answers.line);

  const parts: string[] = [];

  parts.push(
    ease
      ? `You're the person who ${ease}.`
      : `You're the person who ${SIGNALS[archetype.primary].fragment}.`,
  );

  if (line) {
    parts.push(`People come to you when ${line}.`);
  } else if (evidenceFromChoices) {
    parts.push(`People come to you for ${evidenceFromChoices}.`);
  }

  if (edge) {
    parts.push(`And you ${edge} — that overlap is the rare part, not the skill.`);
  }

  return parts.join(" ");
}

export function buildResult(answers: Answers): Result {
  const stage = answers.stage ?? "early";
  const raw = rawVector(answers);
  const ranked = rankArchetypes(raw);
  const [best, second] = ranked;

  const max = Math.max(...SIGNAL_KEYS.map((k) => raw[k]), 1);
  const readings = SIGNAL_KEYS.map((key) => ({
    key,
    label: SIGNALS[key].label,
    gloss: SIGNALS[key].gloss,
    strength: Math.round((raw[key] / max) * 100),
  })).sort((a, b) => b.strength - a.strength || SIGNAL_KEYS.indexOf(a.key) - SIGNAL_KEYS.indexOf(b.key));

  // Interleave so the four moves don't read as two separate lists.
  const stageMoves = STAGES[stage].moves;
  const moves = [
    best.archetype.moves[0],
    stageMoves[0],
    best.archetype.moves[1],
    stageMoves[1],
  ].filter(Boolean);

  return {
    archetype: best.archetype,
    runnerUp: second.archetype,
    readings,
    topSignals: readings.slice(0, 4).map((r) => r.key),
    sauceSentence: composeSauce(answers, best.archetype),
    stage,
    moves,
    confidence: Math.max(0, Math.min(1, (best.score - second.score) * 12)),
  };
}

/** Have we got enough to score? Every non-text question needs an answer. */
export function isComplete(answers: Answers): boolean {
  if (!answers.stage) return false;
  return QUESTIONS.every(
    (q) => q.kind === "text" || (answers.choices[q.id]?.length ?? 0) > 0,
  );
}
