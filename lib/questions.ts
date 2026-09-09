import type { SignalVector } from "./signals";

/**
 * The question bank.
 *
 * Deliberate constraint: every question is written to be answerable, honestly
 * and without translation, by a sixteen-year-old and by someone thirty years
 * into a career. "A room full of people who disagree" is a classroom or a
 * board. No question is age-segmented — the *result* is where the language
 * adapts. See PRD §4.1.
 */

export type ActId = "calibrate" | "energy" | "ease" | "evidence" | "edge";

export type Act = {
  id: ActId;
  /** Roman-numeral-ish marker shown above the question. */
  marker: string;
  title: string;
  /** One line shown when the act opens. Sets the emotional frame. */
  intro: string;
  hue: number;
};

export const ACTS: Record<ActId, Act> = {
  calibrate: {
    id: "calibrate",
    marker: "Before we start",
    title: "Calibrate",
    intro: "One tap. This only changes the language of your result, nothing else.",
    hue: 258,
  },
  energy: {
    id: "energy",
    marker: "Part one",
    title: "Energy",
    intro: "What charges you. A strength you resent is a liability, not a gift.",
    hue: 34,
  },
  ease: {
    id: "ease",
    marker: "Part two",
    title: "Ease",
    intro: "What's suspiciously easy for you. You can't see your own advantage — it feels like nothing.",
    hue: 172,
  },
  evidence: {
    id: "evidence",
    marker: "Part three",
    title: "Evidence",
    intro: "What other people already know about you. This is the part you can't argue with.",
    hue: 344,
  },
  edge: {
    id: "edge",
    marker: "Part four",
    title: "Edge",
    intro: "The combination. Value doesn't live in the skill — it lives in the overlap.",
    hue: 268,
  },
};

export type Option = {
  id: string;
  label: string;
  /** Optional quieter second line. */
  sub?: string;
  vector: SignalVector;
  /**
   * A second-person fragment used to build the composed "sauce sentence" on
   * the reveal. Only present on Ease / Evidence / Edge options, which are the
   * ones that describe something concrete about the person.
   */
  phrase?: string;
};

export type Question =
  | {
      id: string;
      act: ActId;
      kind: "binary" | "choice";
      prompt: string;
      hint?: string;
      options: Option[];
    }
  | {
      id: string;
      act: ActId;
      kind: "multi";
      prompt: string;
      hint?: string;
      minPicks: number;
      maxPicks: number;
      options: Option[];
    }
  | {
      id: string;
      act: ActId;
      kind: "text";
      prompt: string;
      hint?: string;
      placeholder: string;
      prefix: string;
    };

export const QUESTIONS: Question[] = [
  /* ── Act 2 · Energy ─────────────────────────────────────────────── */
  {
    id: "e1",
    act: "energy",
    kind: "binary",
    prompt: "Two free Saturdays, same weather. Which one leaves you charged rather than flat?",
    options: [
      {
        id: "e1a",
        label: "Deep in one thing, alone",
        sub: "Hours disappear and you don't notice",
        vector: { insight: 2, craft: 1, pattern: 1 },
      },
      {
        id: "e1b",
        label: "Out among people, plans forming",
        sub: "You leave with three new things happening",
        vector: { people: 2, drive: 1, signal: 1 },
      },
    ],
  },
  {
    id: "e2",
    act: "energy",
    kind: "binary",
    prompt: "Something you'd planned just fell apart. Underneath the annoyance, what's the first real feeling?",
    options: [
      {
        id: "e2a",
        label: "Good — now we get to find something better",
        vector: { play: 2, drive: 1 },
      },
      {
        id: "e2b",
        label: "Right — what's the actual damage, and who needs to know",
        vector: { care: 2, signal: 1 },
      },
    ],
  },
  {
    id: "e3",
    act: "energy",
    kind: "choice",
    prompt: "Which of these would you do for free, badly, forever?",
    hint: "Not what you're best at. What you'd keep doing anyway.",
    options: [
      {
        id: "e3a",
        label: "Take something messy and make it make sense",
        vector: { pattern: 2, insight: 1 },
      },
      {
        id: "e3b",
        label: "Take something rough and make it good",
        vector: { craft: 2, care: 1 },
      },
      {
        id: "e3c",
        label: "Take something stuck and get it moving",
        vector: { drive: 2, people: 1 },
      },
      {
        id: "e3d",
        label: "Take something dull and make it land",
        vector: { signal: 2, play: 1 },
      },
    ],
  },

  /* ── Act 3 · Ease ───────────────────────────────────────────────── */
  {
    id: "a1",
    act: "ease",
    kind: "multi",
    prompt: "Which of these are annoyingly easy for you?",
    hint: "The ones where you quietly think: isn't this obvious to everybody? Pick up to three.",
    minPicks: 1,
    maxPicks: 3,
    options: [
      {
        id: "a1a",
        label: "Spotting the flaw in a plan",
        vector: { pattern: 2, insight: 1 },
        phrase: "spots the flaw in a plan before it costs anyone anything",
      },
      {
        id: "a1b",
        label: "Reading the room before anyone speaks",
        vector: { people: 2, care: 1 },
        phrase: "reads a room before anyone in it has said a word",
      },
      {
        id: "a1c",
        label: "Explaining a hard thing simply",
        vector: { signal: 2, insight: 1 },
        phrase: "can explain a hard thing so simply it stops being hard",
      },
      {
        id: "a1d",
        label: "Starting before you feel ready",
        vector: { drive: 2, play: 1 },
        phrase: "starts before the conditions are right, which is why things start at all",
      },
      {
        id: "a1e",
        label: "Making the thing actually work properly",
        vector: { craft: 2, pattern: 1 },
        phrase: "makes the thing actually work, not just appear to",
      },
      {
        id: "a1f",
        label: "Remembering who needs what",
        vector: { care: 2, people: 1 },
        phrase: "remembers who needs what, and follows through on it",
      },
      {
        id: "a1g",
        label: "Finding the angle nobody looked at",
        vector: { play: 2, pattern: 1 },
        phrase: "finds the angle everyone else walked straight past",
      },
      {
        id: "a1h",
        label: "Getting people to say yes",
        vector: { signal: 2, drive: 1 },
        phrase: "gets people to yes without anyone feeling pushed",
      },
    ],
  },
  {
    id: "a2",
    act: "ease",
    kind: "choice",
    prompt: "Which of these have you heard about yourself more than once?",
    hint: "Usually said as a criticism. It's almost always the strength, turned up too far.",
    options: [
      { id: "a2a", label: "“You overthink it”", vector: { insight: 2, pattern: 1 } },
      { id: "a2b", label: "“You just went ahead and did it”", vector: { drive: 2, play: 1 } },
      { id: "a2c", label: "“You take it too personally”", vector: { care: 2, people: 1 } },
      { id: "a2d", label: "“Why does it always have to be different”", vector: { play: 2, craft: 1 } },
      { id: "a2e", label: "“You always have to have the last word”", vector: { signal: 2, insight: 1 } },
    ],
  },
  {
    id: "a3",
    act: "ease",
    kind: "choice",
    prompt: "A group thing is going badly and nobody's saying so. You become the one who…",
    options: [
      {
        id: "a3a",
        label: "…quietly rebuilds it so it works",
        vector: { craft: 2, care: 1 },
        phrase: "quietly rebuilds the thing while everyone else is still discussing it",
      },
      {
        id: "a3b",
        label: "…names what's actually going wrong",
        vector: { insight: 2, signal: 1 },
        phrase: "names the real problem while everyone else is being polite about it",
      },
      {
        id: "a3c",
        label: "…gets everyone unstuck and moving",
        vector: { drive: 2, people: 1 },
        phrase: "gets a stuck group moving again",
      },
      {
        id: "a3d",
        label: "…keeps everybody from falling apart",
        vector: { care: 2, people: 1 },
        phrase: "keeps people steady when the thing around them isn't",
      },
    ],
  },

  /* ── Act 4 · Evidence ───────────────────────────────────────────── */
  {
    id: "v1",
    act: "evidence",
    kind: "multi",
    prompt: "People come to you when they need…",
    hint: "Not what you wish they came for. What they actually turn up asking for. Pick up to three.",
    minPicks: 1,
    maxPicks: 3,
    options: [
      {
        id: "v1a",
        label: "A second opinion they'll actually trust",
        vector: { insight: 2, care: 1 },
        phrase: "a second opinion they'll actually believe",
      },
      {
        id: "v1b",
        label: "Someone to make it happen",
        vector: { drive: 2, craft: 1 },
        phrase: "someone who will make the thing happen",
      },
      {
        id: "v1c",
        label: "It explained in plain words",
        vector: { signal: 2, insight: 1 },
        phrase: "the version of it that finally makes sense",
      },
      {
        id: "v1d",
        label: "An introduction",
        vector: { people: 2, signal: 1 },
        phrase: "the door you happen to know how to open",
      },
      {
        id: "v1e",
        label: "Someone to spot what's missing",
        vector: { pattern: 2, insight: 1 },
        phrase: "the gap nobody else had noticed",
      },
      {
        id: "v1f",
        label: "It done properly, not just done",
        vector: { craft: 2, care: 1 },
        phrase: "it done properly rather than just finished",
      },
      {
        id: "v1g",
        label: "A fresh idea when everything's stale",
        vector: { play: 2, pattern: 1 },
        phrase: "a fresh idea when the room has run out of them",
      },
      {
        id: "v1h",
        label: "Someone to calm it down",
        vector: { care: 2, people: 1 },
        phrase: "someone who can lower the temperature in a room",
      },
    ],
  },
  {
    id: "v2",
    act: "evidence",
    kind: "choice",
    prompt: "When someone genuinely thanks you, what are they thanking you for?",
    options: [
      { id: "v2a", label: "Seeing something they'd missed", vector: { insight: 2, pattern: 1 } },
      { id: "v2b", label: "Doing something they couldn't", vector: { craft: 2, drive: 1 } },
      { id: "v2c", label: "Saying something they needed to hear", vector: { signal: 2, insight: 1 } },
      { id: "v2d", label: "Being there when it mattered", vector: { care: 2, people: 1 } },
      { id: "v2e", label: "Opening a door for them", vector: { people: 2, drive: 1 } },
    ],
  },
  {
    id: "v3",
    act: "evidence",
    kind: "text",
    prompt: "Finish it in your own words.",
    hint: "Optional — but this is the line that ends up on your result. Skip it if nothing comes.",
    prefix: "People come to me when",
    placeholder: "something's gone quiet…",
  },

  /* ── Act 5 · Edge ───────────────────────────────────────────────── */
  {
    id: "g1",
    act: "edge",
    kind: "multi",
    prompt: "Which two worlds do you have a foot in that most people around you don't?",
    hint: "Rarity isn't about being the best at one thing. Pick up to two.",
    minPicks: 1,
    maxPicks: 2,
    options: [
      {
        id: "g1a",
        label: "Building things & understanding people",
        vector: { craft: 2, people: 2 },
        phrase: "sit between the thing being built and the people it's for",
      },
      {
        id: "g1b",
        label: "Numbers & stories",
        vector: { pattern: 2, signal: 2 },
        phrase: "move between the numbers and the story without dropping either",
      },
      {
        id: "g1c",
        label: "Inside the system & outside it",
        vector: { pattern: 2, play: 2 },
        phrase: "know the system well enough to see where it's wrong",
      },
      {
        id: "g1d",
        label: "Real depth & beginner's curiosity",
        vector: { insight: 2, play: 2 },
        phrase: "know a lot and still ask the beginner's question",
      },
      {
        id: "g1e",
        label: "The whole picture & the tiny details",
        vector: { pattern: 2, craft: 2 },
        phrase: "hold the whole shape and the small details at the same time",
      },
      {
        id: "g1f",
        label: "Getting it done & keeping people whole",
        vector: { drive: 2, care: 2 },
        phrase: "get it done without leaving people behind",
      },
    ],
  },
  {
    id: "g2",
    act: "edge",
    kind: "choice",
    prompt: "Ten years from now someone describes you in one line. Which one would hurt the most to lose?",
    hint: "Last question. Take the extra second.",
    options: [
      { id: "g2a", label: "“Nobody sees it the way they do.”", vector: { insight: 2, pattern: 2 } },
      { id: "g2b", label: "“If they're on it, it gets done.”", vector: { drive: 2, craft: 2 } },
      { id: "g2c", label: "“Everything they touch is better made.”", vector: { craft: 2, play: 1, care: 1 } },
      { id: "g2d", label: "“People are different after they meet them.”", vector: { people: 2, care: 2 } },
      { id: "g2e", label: "“They make you understand.”", vector: { signal: 2, insight: 2 } },
    ],
  },
];

/** Weighting by act. External evidence and asymmetry are more diagnostic than
 *  self-reported preference, so Ease and Evidence count for more. PRD §8.1. */
export const ACT_WEIGHT: Record<ActId, number> = {
  calibrate: 0,
  energy: 1,
  ease: 1.25,
  evidence: 1.25,
  edge: 1,
};

export const QUESTION_ORDER = QUESTIONS.map((q) => q.id);
