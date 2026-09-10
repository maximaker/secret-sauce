import { ARCHETYPES, type Archetype } from "./archetypes";
import {
  ACT_WEIGHT,
  ACTS,
  CONDITION_AXES,
  CORE_QUESTIONS,
  DEEP_QUESTIONS,
  QUESTIONS,
  channelOf,
  type Channel,
  type Option,
  type Question,
} from "./questions";
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

/**
 * Sum selected option vectors, weighted by act.
 *
 * `channels` restricts which measurement channels count, which is what lets us
 * score self-report and external evidence separately as well as together.
 */
export function rawVector(answers: Answers, channels?: Channel[]): FullVector {
  const total = ZERO_VECTOR();
  for (const ids of Object.values(answers.choices)) {
    for (const id of ids) {
      const entry = OPTION_INDEX.get(id);
      if (!entry) continue;
      if (channels && !channels.includes(channelOf(entry.question))) continue;
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

/** Signals strongest-first. Ties break on declaration order, so it's stable. */
const orderSignals = (vec: FullVector): SignalKey[] =>
  [...SIGNAL_KEYS].sort(
    (a, b) => vec[b] - vec[a] || SIGNAL_KEYS.indexOf(a) - SIGNAL_KEYS.indexOf(b),
  );

export type SignalReading = {
  key: SignalKey;
  label: string;
  gloss: string;
  /** 0–100, relative to the user's own strongest signal. */
  strength: number;
};

export type ConditionReading = {
  id: string;
  label: string;
  left: string;
  right: string;
  /** -2 … +2 */
  position: number;
  reading: string;
};

/**
 * How well what you say is easy for you lines up with what people actually
 * come to you for. A wide gap is not an error — it is usually the single most
 * useful thing the assessment can tell someone.
 */
export type Alignment = {
  agreement: number;
  selfTop: SignalKey;
  evidenceTop: SignalKey;
  verdict: "aligned" | "tilted" | "split";
  headline: string;
  body: string;
};

/** A block of text written to be copied straight out and used somewhere. */
export type Artifact = {
  id: string;
  label: string;
  note: string;
  text: string;
};

export type Result = {
  archetype: Archetype;
  runnerUp: Archetype;
  readings: SignalReading[];
  topSignals: SignalKey[];
  sauceSentence: string;
  stage: StageKey;
  moves: string[];
  /** How decisive the archetype match was, 0–1. */
  separation: number;
  confidence: { label: string; note: string };
  alignment: Alignment;
  depth: "core" | "deep";
  conditions: ConditionReading[] | null;
  drains: string[] | null;
  misuse: string | null;
  artifacts: Artifact[];
};

function rankArchetypes(user: FullVector): { archetype: Archetype; score: number }[] {
  return ARCHETYPES.map((archetype, index) => ({
    archetype,
    index,
    score: cosine(user, archetype.vector),
  }))
    .sort((a, b) => {
      if (Math.abs(b.score - a.score) > 1e-9) return b.score - a.score;
      const byPrimary = user[b.archetype.primary] - user[a.archetype.primary];
      if (Math.abs(byPrimary) > 1e-9) return byPrimary;
      return a.index - b.index;
    })
    .map(({ archetype, score }) => ({ archetype, score }));
}

function phrasesFor(answers: Answers, questionId: string): string[] {
  const question = QUESTIONS.find((q) => q.id === questionId);
  if (!question || question.kind === "text") return [];
  const picked = new Set(answers.choices[questionId] ?? []);
  return question.options.filter((o) => picked.has(o.id) && o.phrase).map((o) => o.phrase!);
}

function tidyLine(raw: string): string {
  const text = raw.trim().replace(/[.\s]+$/, "");
  if (!text) return "";
  const [first, ...rest] = text;
  const looksLikeAcronym = /[A-Z]/.test(text[1] ?? "");
  return looksLikeAcronym ? text : first.toLowerCase() + rest.join("");
}

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
  if (line) parts.push(`People come to you when ${line}.`);
  else if (evidenceFromChoices) parts.push(`People come to you for ${evidenceFromChoices}.`);
  if (edge) parts.push(`And you ${edge} — that overlap is the rare part, not the skill.`);
  return parts.join(" ");
}

function buildAlignment(answers: Answers): Alignment {
  const self = rawVector(answers, ["self"]);
  const evidence = rawVector(answers, ["external"]);
  const agreement = cosine(self, evidence);

  const selfOrder = orderSignals(self);
  const evidenceOrder = orderSignals(evidence);
  const selfTop = selfOrder[0];
  const evidenceTop = evidenceOrder[0];
  const name = (k: SignalKey) => SIGNALS[k].label.toLowerCase();
  const gloss = (k: SignalKey) => SIGNALS[k].gloss.toLowerCase();

  if (agreement >= 0.82) {
    return {
      agreement,
      selfTop,
      evidenceTop,
      verdict: "aligned",
      headline: "What you think you're good at and what people come to you for are the same thing.",
      body: `That is rarer than it sounds, and it means you can trust this result. Most people are quietly wrong about their own strongest suit. You aren't — your own read and the evidence from other people both land on ${name(selfTop)}. Stop second-guessing it and start spending it.`,
    };
  }

  // Both channels can lead on the same signal and still disagree underneath.
  // Saying "you lead with drive, people come to you for drive" would read as a
  // bug, so compare what sits in second place instead.
  if (selfTop === evidenceTop) {
    const mine = selfOrder.find((k) => k !== selfTop)!;
    const theirs = evidenceOrder.find((k) => k !== evidenceTop)!;
    const sameSecond = mine === theirs;
    return {
      agreement,
      selfTop,
      evidenceTop,
      verdict: agreement >= 0.62 ? "tilted" : "split",
      headline: `Both sides agree your lead is ${name(selfTop)}. What sits behind it doesn't match.`,
      body: sameSecond
        ? `You and the people around you name the same two strengths, but weight the rest of the picture differently. That's a mild difference and not worth agonising over — the headline is that ${name(selfTop)} is real, corroborated, and the thing to build on.`
        : `You back your ${name(selfTop)} with ${name(mine)} — ${gloss(mine)} Other people experience it paired with ${name(theirs)} — ${gloss(theirs)} That second half is the part you're not accounting for, and it's usually what makes the difference between being good at something and being the person people call about it.`,
    };
  }

  if (agreement >= 0.62) {
    return {
      agreement,
      selfTop,
      evidenceTop,
      verdict: "tilted",
      headline: `You lead with ${name(selfTop)}. People come to you for ${name(evidenceTop)}.`,
      body: `Close, but not the same, and the difference is worth money. The part you value in yourself is ${gloss(selfTop)} The part other people reach for is ${gloss(evidenceTop)} When you describe yourself, you're probably leading with the first. Try leading with the second — it's the one that's already been validated by someone other than you.`,
    };
  }

  return {
    agreement,
    selfTop,
    evidenceTop,
    verdict: "split",
    headline: "There's a real gap between what feels easy to you and what people actually want from you.",
    body: `You rate yourself on ${name(selfTop)} — ${gloss(selfTop)} But the demand you actually get is for ${name(evidenceTop)} — ${gloss(evidenceTop)} That gap usually means one of two things: either you're undervaluing something that comes so easily you don't count it as a skill, or you're being pulled into work that isn't your best. Both are worth an hour of honest thought, and neither resolves itself.`,
  };
}

/**
 * Thresholds are set against the measured distribution of `separation` rather
 * than a round number: the median run separates by ~0.37, so a 0.5 cut would
 * label most people provisional and quietly undermine their own result.
 */
const DECISIVE = 0.35;

function buildConfidence(separation: number, depth: "core" | "deep", agreement: number) {
  if (depth === "core") {
    return separation > DECISIVE
      ? { label: "Solid", note: "Your answers pointed clearly in one direction across all four parts." }
      : {
          label: "Between two",
          note: "Your answers landed between two shapes rather than on one. That is often real rather than indecisive — but the deeper round is what tells the difference.",
        };
  }
  if (separation > DECISIVE && agreement > 0.7) {
    return {
      label: "High",
      note: "Twenty-four answers across seven parts, and the cross-check agreed with the main round. This one holds.",
    };
  }
  if (separation > DECISIVE || agreement > 0.7) {
    return {
      label: "Good",
      note: "The full round mostly converged. Where it didn't is written up in the gap below — that's the interesting part.",
    };
  }
  return {
    label: "Genuinely mixed",
    note: "Your answers didn't converge on one shape, and the cross-check didn't resolve it. That's a real finding, not a failure: you're either between two modes or you're in a phase where the answer is changing.",
  };
}

function buildConditions(answers: Answers): ConditionReading[] | null {
  const readings: ConditionReading[] = [];
  for (const axis of CONDITION_AXES) {
    const picked = answers.choices[axis.questionId]?.[0];
    if (!picked) continue;
    const option = findOption(picked);
    if (!option || option.pos === undefined) continue;
    readings.push({
      id: axis.id,
      label: axis.label,
      left: axis.left,
      right: axis.right,
      position: option.pos,
      reading: axis.reading[String(option.pos)] ?? "",
    });
  }
  return readings.length ? readings : null;
}

/**
 * The result's job doesn't end at insight — it ends when the insight is
 * somewhere useful. These are written to survive a copy-paste with no editing.
 *
 * Ease phrases are third person ("spots the flaw"), Evidence phrases are noun
 * phrases, and Edge phrases are base-form verbs. Each frame below is built so
 * its ingredient reads grammatically in first person without any conjugating.
 */
function buildArtifacts(
  answers: Answers,
  archetype: Archetype,
  stage: StageKey,
  conditions: ConditionReading[] | null,
  drains: string[] | null,
): Artifact[] {
  const frames = STAGES[stage].artifacts;
  const ease = phrasesFor(answers, "a1")[0] ?? phrasesFor(answers, "a3")[0];
  const edge = phrasesFor(answers, "g1")[0];
  const evidence = phrasesFor(answers, "v1")[0];
  const line = tidyLine(answers.line);
  const demand = line ? `when ${line}` : evidence ? `for ${evidence}` : null;

  const out: Artifact[] = [
    {
      id: "headline",
      label: frames.headline,
      note: "One line. Use it where you only get one.",
      text: archetype.headline,
    },
    {
      id: "spoken",
      label: frames.spoken,
      note: "About fifteen seconds out loud. Say it, don't read it.",
      text: [
        archetype.pitch,
        edge && demand
          ? `I ${edge}, and people come to me ${demand}.`
          : edge
            ? `I ${edge}.`
            : demand
              ? `People come to me ${demand}.`
              : null,
      ]
        .filter(Boolean)
        .join(" "),
    },
    {
      id: "written",
      label: frames.written,
      note: "Two sentences you can build a paragraph on.",
      text: [
        ease ? `I'm the person who ${ease}.` : archetype.pitch,
        demand ? `People come to me ${demand}.` : null,
        frames.close,
      ]
        .filter(Boolean)
        .join(" "),
    },
  ];

  if (conditions && conditions.length) {
    const asks = conditions
      .map((c) => CONDITION_AXES.find((a) => a.id === c.id)?.ask[String(c.position)])
      .filter(Boolean) as string[];
    if (asks.length) {
      const list =
        asks.length > 1 ? `${asks.slice(0, -1).join(", ")} and ${asks[asks.length - 1]}` : asks[0];
      out.push({
        id: "conditions",
        label: "What to ask for",
        note: "For a new role, a project brief, or a conversation with your manager.",
        text:
          `I do my best work with ${list}.` +
          (drains && drains.length ? ` What wastes me is ${drains[0]}.` : ""),
      });
    }
  }

  return out;
}

export function buildResult(answers: Answers): Result {
  const stage = answers.stage ?? "early";
  const depth: "core" | "deep" = hasDeep(answers) ? "deep" : "core";

  const raw = rawVector(answers, ["self", "external", "drain"]);
  const ranked = rankArchetypes(raw);
  const [best, second] = ranked;

  const max = Math.max(...SIGNAL_KEYS.map((k) => raw[k]), 1);
  const readings = SIGNAL_KEYS.map((key) => ({
    key,
    label: SIGNALS[key].label,
    gloss: SIGNALS[key].gloss,
    strength: Math.max(0, Math.round((raw[key] / max) * 100)),
  })).sort(
    (a, b) => b.strength - a.strength || SIGNAL_KEYS.indexOf(a.key) - SIGNAL_KEYS.indexOf(b.key),
  );

  const stageMoves = STAGES[stage].moves;
  const moves = [
    best.archetype.moves[0],
    stageMoves[0],
    best.archetype.moves[1],
    stageMoves[1],
  ].filter(Boolean);

  const separation = Math.max(0, Math.min(1, (best.score - second.score) * 12));
  const alignment = buildAlignment(answers);

  const drainPhrases = phrasesFor(answers, "d1");
  const misuse = phrasesFor(answers, "d2")[0] ?? null;

  const conditions = buildConditions(answers);
  const drains = drainPhrases.length ? drainPhrases : null;

  return {
    archetype: best.archetype,
    runnerUp: second.archetype,
    readings,
    topSignals: readings.slice(0, 4).map((r) => r.key),
    sauceSentence: composeSauce(answers, best.archetype),
    stage,
    moves,
    separation,
    confidence: buildConfidence(separation, depth, alignment.agreement),
    alignment,
    depth,
    conditions,
    drains,
    misuse,
    artifacts: buildArtifacts(answers, best.archetype, stage, conditions, drains),
  };
}

const answered = (answers: Answers, q: Question) =>
  q.kind === "text" ? true : (answers.choices[q.id]?.length ?? 0) > 0;

/** Enough to produce a core result. */
export function isComplete(answers: Answers): boolean {
  if (!answers.stage) return false;
  return CORE_QUESTIONS.every((q) => answered(answers, q));
}

/** Has the optional second round been finished? */
export function hasDeep(answers: Answers): boolean {
  return DEEP_QUESTIONS.every((q) => answered(answers, q));
}

export const actTitle = (id: keyof typeof ACTS) => ACTS[id].title;
