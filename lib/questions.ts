import type { SignalVector } from "./signals";

/**
 * The question bank.
 *
 * Two deliberate constraints:
 *
 * 1. Every question is written to be answerable, honestly and without
 *    translation, by a sixteen-year-old and by someone thirty years into a
 *    career. "A room full of people who disagree" is a classroom or a board.
 *    No question is age-segmented — the *result* is where the language
 *    adapts. See PRD §4.1.
 *
 * 2. Within a question, options are written to be roughly equal in social
 *    desirability. Forced-choice format on its own does not debias anything;
 *    it debiases when the alternatives are equally attractive, so there is no
 *    obviously "correct" answer to reach for. See PRD §5.6.
 */

export type ActId =
  | "calibrate"
  | "energy"
  | "ease"
  | "evidence"
  | "edge"
  | "conditions"
  | "drains"
  | "crosscheck";

/**
 * Which measurement channel an answer feeds.
 *
 * `self` and `external` are scored separately as well as together, so we can
 * report the gap between what someone thinks is easy for them and what people
 * actually come to them for. That gap is the most honest thing on the page.
 */
export type Channel = "self" | "external" | "condition" | "drain";

export type Act = {
  id: ActId;
  marker: string;
  title: string;
  /** One line shown when the act opens. Sets the emotional frame. */
  intro: string;
  hue: number;
  /** Deep acts only run in the optional second round. */
  round: "core" | "deep";
};

export const ACTS: Record<ActId, Act> = {
  calibrate: {
    id: "calibrate",
    marker: "Before we start",
    title: "Calibrate",
    intro: "One tap. This only changes the language of your result, nothing else.",
    hue: 258,
    round: "core",
  },
  energy: {
    id: "energy",
    marker: "Part one",
    title: "Energy",
    intro: "What charges you. A strength you resent is a liability, not a gift.",
    hue: 34,
    round: "core",
  },
  ease: {
    id: "ease",
    marker: "Part two",
    title: "Ease",
    intro:
      "What's suspiciously easy for you. You can't see your own advantage — it feels like nothing.",
    hue: 172,
    round: "core",
  },
  evidence: {
    id: "evidence",
    marker: "Part three",
    title: "Evidence",
    intro:
      "What other people already know about you. This is the part you can't argue with.",
    hue: 344,
    round: "core",
  },
  edge: {
    id: "edge",
    marker: "Part four",
    title: "Edge",
    intro: "The combination. Value doesn't live in the skill — it lives in the overlap.",
    hue: 268,
    round: "core",
  },
  conditions: {
    id: "conditions",
    marker: "Part five",
    title: "Conditions",
    intro:
      "The same person is brilliant in one setting and ordinary in another. This is which setting is yours.",
    hue: 210,
    round: "deep",
  },
  drains: {
    id: "drains",
    marker: "Part six",
    title: "Drains",
    intro: "What flattens you. Knowing this is worth as much as knowing the strength.",
    hue: 8,
    round: "deep",
  },
  crosscheck: {
    id: "crosscheck",
    marker: "Part seven",
    title: "Cross-check",
    intro:
      "Two more, asked a different way. If they agree with everything above, your result is solid.",
    hue: 96,
    round: "deep",
  },
};

export type Option = {
  id: string;
  label: string;
  /** Optional quieter second line. */
  sub?: string;
  vector: SignalVector;
  /**
   * A fragment reused in the result — the composed sauce sentence for Ease,
   * Evidence and Edge options; the display string for Drains options.
   */
  phrase?: string;
  /** Conditions only: position on the axis, -2 (far left) to +2 (far right). */
  pos?: number;
};

type Base = {
  id: string;
  act: ActId;
  prompt: string;
  hint?: string;
  /** Defaults to the act's channel; set explicitly where an item differs. */
  channel?: Channel;
};

export type Question =
  | (Base & { kind: "binary" | "choice"; options: Option[] })
  | (Base & { kind: "multi"; minPicks: number; maxPicks: number; options: Option[] })
  | (Base & { kind: "text"; placeholder: string; prefix: string });

const ACT_CHANNEL: Record<ActId, Channel> = {
  calibrate: "self",
  energy: "self",
  ease: "self",
  evidence: "external",
  edge: "self",
  conditions: "condition",
  drains: "drain",
  crosscheck: "external",
};

export const channelOf = (q: Question): Channel => q.channel ?? ACT_CHANNEL[q.act];

/* ── Conditions axes ──────────────────────────────────────────────────── */

export type ConditionAxis = {
  id: string;
  questionId: string;
  label: string;
  left: string;
  right: string;
  /** Indexed by position: -2, -1, +1, +2 → the sentence shown on the reveal. */
  reading: Record<string, string>;
};

export const CONDITION_AXES: ConditionAxis[] = [
  {
    id: "company",
    questionId: "c1",
    label: "Company",
    left: "Alone",
    right: "In a room",
    reading: {
      "-2": "You need real solitude to do the good part. Protect it like a meeting.",
      "-1": "You do your best thinking against one other person, not a group.",
      "1": "A small team is your setting — big enough to spark, small enough to hear.",
      "2": "You're at your best with an audience. Don't let anyone put you in a back office.",
    },
  },
  {
    id: "structure",
    questionId: "c2",
    label: "Brief",
    left: "Defined",
    right: "Open",
    reading: {
      "-2": "Give you a clear spec and you'll make it excellent. Vagueness wastes you.",
      "-1": "You want the goal fixed and the method yours. Ask for that explicitly.",
      "1": "Rough direction suits you. Over-specified work will bore you into mediocrity.",
      "2": "A blank page is where you're strongest — and where most people freeze.",
    },
  },
  {
    id: "tempo",
    questionId: "c3",
    label: "Tempo",
    left: "Calm",
    right: "Pressure",
    reading: {
      "-2": "Your quality collapses under urgency. That's not fragility — it's the trade.",
      "-1": "A real but humane deadline is your sweet spot. Chaos costs you more than it gains.",
      "1": "Urgency sharpens you. In slow conditions you'll need to manufacture some.",
      "2": "You come alive when it's genuinely on fire. Steady states will bore you flat.",
    },
  },
  {
    id: "horizon",
    questionId: "c4",
    label: "Horizon",
    left: "Short",
    right: "Long",
    reading: {
      "-2": "You need to finish things today. Long projects should be cut into daily wins.",
      "-1": "A week is your natural unit. Anything longer needs visible milestones.",
      "1": "You can hold a season-long arc without losing the thread. Most people can't.",
      "2": "You think in years. Short-cycle work will feel like nothing you do matters.",
    },
  },
];

/* ── The bank ─────────────────────────────────────────────────────────── */

export const QUESTIONS: Question[] = [
  /* ── Act 1 · Energy ─────────────────────────────────────────────── */
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
    prompt:
      "Something you'd planned just fell apart. Underneath the annoyance, what's the first real feeling?",
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
      { id: "e3b", label: "Take something rough and make it good", vector: { craft: 2, care: 1 } },
      {
        id: "e3c",
        label: "Take something stuck and get it moving",
        vector: { drive: 2, people: 1 },
      },
      { id: "e3d", label: "Take something dull and make it land", vector: { signal: 2, play: 1 } },
    ],
  },
  {
    id: "e4",
    act: "energy",
    kind: "choice",
    prompt: "At the end of a long day, which kind of tired is the good kind?",
    options: [
      { id: "e4a", label: "You worked something out", vector: { insight: 2, pattern: 1 } },
      { id: "e4b", label: "You made something", vector: { craft: 2, play: 1 } },
      { id: "e4c", label: "You carried people through something", vector: { care: 2, people: 1 } },
      { id: "e4d", label: "You brought someone round to something", vector: { signal: 2, drive: 1 } },
    ],
  },

  /* ── Act 2 · Ease ───────────────────────────────────────────────── */
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
  {
    id: "a4",
    act: "ease",
    kind: "choice",
    prompt: "What do you catch yourself doing when you're meant to be doing something else?",
    hint: "Not a hobby. The thing your attention slides towards on its own.",
    options: [
      {
        id: "a4a",
        label: "Reorganising something so it makes more sense",
        vector: { pattern: 2, craft: 1 },
      },
      { id: "a4b", label: "Reading far past the point of usefulness", vector: { insight: 2, play: 1 } },
      {
        id: "a4c",
        label: "Messaging someone who'd find this interesting",
        vector: { people: 2, signal: 1 },
      },
      { id: "a4d", label: "Fixing a small thing nobody asked about", vector: { craft: 2, care: 1 } },
      {
        id: "a4e",
        label: "Imagining how it could be done completely differently",
        vector: { play: 2, drive: 1 },
      },
    ],
  },

  /* ── Act 3 · Evidence ───────────────────────────────────────────── */
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
    id: "v4",
    act: "evidence",
    kind: "choice",
    prompt:
      "Think of the last time someone asked for your help specifically — not just anyone's. What was it about?",
    hint: "An actual occasion, not a general impression. Recalling one is more honest than summarising a hundred.",
    options: [
      { id: "v4a", label: "Working out what was really going on", vector: { insight: 2, pattern: 1 } },
      { id: "v4b", label: "Getting something over the line", vector: { drive: 2, craft: 1 } },
      { id: "v4c", label: "Saying it in a way that would land", vector: { signal: 2, people: 1 } },
      { id: "v4d", label: "Making sure it was done right", vector: { craft: 2, care: 1 } },
      { id: "v4e", label: "Just being in their corner", vector: { care: 2, people: 1 } },
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

  /* ── Act 4 · Edge ───────────────────────────────────────────────── */
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
    id: "g3",
    act: "edge",
    kind: "choice",
    channel: "external",
    prompt: "What do you bring that the people around you would otherwise have to hire for?",
    options: [
      { id: "g3a", label: "Judgement about what actually matters", vector: { insight: 2, pattern: 1 } },
      { id: "g3b", label: "The ability to actually finish", vector: { drive: 2, craft: 1 } },
      { id: "g3c", label: "Taste", vector: { craft: 2, play: 1 } },
      { id: "g3d", label: "Trust", vector: { care: 2, people: 1 } },
      { id: "g3e", label: "The words for it", vector: { signal: 2, insight: 1 } },
    ],
  },
  {
    id: "g4",
    act: "edge",
    kind: "choice",
    channel: "external",
    prompt: "When does your value become obvious to everyone, not just to you?",
    options: [
      { id: "g4a", label: "When nobody can tell what's going on", vector: { pattern: 2, insight: 1 } },
      { id: "g4b", label: "When something has to actually get built", vector: { craft: 2, drive: 1 } },
      { id: "g4c", label: "When people are at odds", vector: { people: 2, care: 1 } },
      { id: "g4d", label: "When the usual answer isn't good enough", vector: { play: 2, signal: 1 } },
    ],
  },
  {
    id: "g2",
    act: "edge",
    kind: "choice",
    prompt: "Ten years from now someone describes you in one line. Which one would hurt the most to lose?",
    hint: "Last one of the main round. Take the extra second.",
    options: [
      { id: "g2a", label: "“Nobody sees it the way they do.”", vector: { insight: 2, pattern: 2 } },
      { id: "g2b", label: "“If they're on it, it gets done.”", vector: { drive: 2, craft: 2 } },
      { id: "g2c", label: "“Everything they touch is better made.”", vector: { craft: 2, play: 1, care: 1 } },
      { id: "g2d", label: "“People are different after they meet them.”", vector: { people: 2, care: 2 } },
      { id: "g2e", label: "“They make you understand.”", vector: { signal: 2, insight: 2 } },
    ],
  },

  /* ── Act 5 · Conditions (deep) ──────────────────────────────────── */
  {
    id: "c1",
    act: "conditions",
    kind: "choice",
    prompt: "Your best work happens…",
    options: [
      { id: "c1a", label: "Alone, uninterrupted", vector: {}, pos: -2 },
      { id: "c1b", label: "With one other person", vector: {}, pos: -1 },
      { id: "c1c", label: "In a small team", vector: {}, pos: 1 },
      { id: "c1d", label: "In front of a room", vector: {}, pos: 2 },
    ],
  },
  {
    id: "c2",
    act: "conditions",
    kind: "choice",
    prompt: "Someone hands you a piece of work. You'd rather it arrived…",
    options: [
      { id: "c2a", label: "Fully specified — you'll make it excellent", vector: {}, pos: -2 },
      { id: "c2b", label: "Goal fixed, method yours", vector: {}, pos: -1 },
      { id: "c2c", label: "A rough direction to work out", vector: {}, pos: 1 },
      { id: "c2d", label: "As a blank page", vector: {}, pos: 2 },
    ],
  },
  {
    id: "c3",
    act: "conditions",
    kind: "choice",
    prompt: "You're at your sharpest…",
    options: [
      { id: "c3a", label: "When it's calm and there's room to think", vector: {}, pos: -2 },
      { id: "c3b", label: "With a real but reasonable deadline", vector: {}, pos: -1 },
      { id: "c3c", label: "When it's urgent", vector: {}, pos: 1 },
      { id: "c3d", label: "When it's genuinely on fire", vector: {}, pos: 2 },
    ],
  },
  {
    id: "c4",
    act: "conditions",
    kind: "choice",
    prompt: "Which is more satisfying?",
    options: [
      { id: "c4a", label: "Something finished today", vector: {}, pos: -2 },
      { id: "c4b", label: "A week's work, done properly", vector: {}, pos: -1 },
      { id: "c4c", label: "A project that takes a season", vector: {}, pos: 1 },
      { id: "c4d", label: "Something that takes years", vector: {}, pos: 2 },
    ],
  },

  /* ── Act 6 · Drains (deep) ──────────────────────────────────────── */
  {
    id: "d1",
    act: "drains",
    kind: "multi",
    prompt: "Which of these leave you flattened, even when they go perfectly well?",
    hint: "Not things you're bad at. Things that cost you something to do. Pick up to three.",
    minPicks: 1,
    maxPicks: 3,
    options: [
      {
        id: "d1a",
        label: "Long meetings that decide nothing",
        vector: { drive: -1 },
        phrase: "meetings that end without a decision",
      },
      {
        id: "d1b",
        label: "Being watched while you work",
        vector: { people: -1 },
        phrase: "working with someone looking over your shoulder",
      },
      {
        id: "d1c",
        label: "Repeating yourself",
        vector: { signal: -1 },
        phrase: "having to say the same thing a fourth time",
      },
      {
        id: "d1d",
        label: "Doing it someone else's way for no reason",
        vector: { craft: -1 },
        phrase: "following a method nobody can justify",
      },
      {
        id: "d1e",
        label: "Small talk with a lot of people",
        vector: { people: -1 },
        phrase: "rooms that run on small talk",
      },
      {
        id: "d1f",
        label: "Waiting on other people to move",
        vector: { drive: -1 },
        phrase: "waiting on other people's timelines",
      },
      {
        id: "d1g",
        label: "Detail work with no visible point",
        vector: { craft: -1, insight: -1 },
        phrase: "detail work whose purpose nobody will explain",
      },
      {
        id: "d1h",
        label: "Conflict you didn't choose",
        vector: { care: -1 },
        phrase: "friction you had no part in starting",
      },
    ],
  },
  {
    id: "d2",
    act: "drains",
    kind: "choice",
    prompt: "The fastest way to waste you completely is to put you somewhere…",
    options: [
      { id: "d2a", label: "…where nothing ever gets finished", vector: { drive: -1 }, phrase: "nothing ever ships" },
      {
        id: "d2b",
        label: "…where the answer's already been decided",
        vector: { insight: -1, play: -1 },
        phrase: "the conclusion is fixed before you arrive",
      },
      {
        id: "d2c",
        label: "…where nobody tells you what's really going on",
        vector: { pattern: -1 },
        phrase: "the real picture is kept from you",
      },
      {
        id: "d2d",
        label: "…where you never see who it's for",
        vector: { care: -1, people: -1 },
        phrase: "you never meet the person it's for",
      },
      {
        id: "d2e",
        label: "…where there's never time to do it properly",
        vector: { craft: -1 },
        phrase: "there is never time to do it properly",
      },
    ],
  },

  /* ── Act 7 · Cross-check (deep) ─────────────────────────────────── */
  {
    id: "x1",
    act: "crosscheck",
    kind: "choice",
    prompt: "Someone recommends you for something. What's the sentence they use?",
    channel: "external",
    options: [
      { id: "x1a", label: "“They'll work out what's actually going on.”", vector: { insight: 2, pattern: 1 } },
      { id: "x1b", label: "“They'll get it done.”", vector: { drive: 2, craft: 1 } },
      { id: "x1c", label: "“They'll make it make sense to everyone.”", vector: { signal: 2, people: 1 } },
      { id: "x1d", label: "“They'll look after it.”", vector: { care: 2, craft: 1 } },
      { id: "x1e", label: "“They'll come at it from somewhere else entirely.”", vector: { play: 2, insight: 1 } },
    ],
  },
  {
    id: "x2",
    act: "crosscheck",
    kind: "choice",
    prompt: "You have one hour to help anybody with anything. What do you offer them?",
    channel: "self",
    options: [
      { id: "x2a", label: "An hour to think it through together", vector: { insight: 2, care: 1 } },
      { id: "x2b", label: "An hour of actually doing it", vector: { craft: 2, drive: 1 } },
      { id: "x2c", label: "An hour making the case airtight", vector: { signal: 2, pattern: 1 } },
      { id: "x2d", label: "An hour of introductions", vector: { people: 2, drive: 1 } },
      { id: "x2e", label: "An hour of “what if we did the opposite”", vector: { play: 2, pattern: 1 } },
    ],
  },
];

/**
 * Weighting by act.
 *
 * Evidence carries the most weight: what people actually come to you for is
 * the highest-validity channel available without surveying them directly, and
 * it is the one a respondent can least easily flatter. Ease is next — an
 * asymmetry you can feel is better evidence than a preference you report.
 * Conditions carry no signal weight at all; they describe the setting, not
 * the person. PRD §8.1.
 */
export const ACT_WEIGHT: Record<ActId, number> = {
  calibrate: 0,
  energy: 1,
  ease: 1.25,
  evidence: 1.35,
  edge: 1,
  conditions: 0,
  drains: 0.5,
  crosscheck: 1.15,
};

export const CORE_QUESTIONS = QUESTIONS.filter((q) => ACTS[q.act].round === "core");
export const DEEP_QUESTIONS = QUESTIONS.filter((q) => ACTS[q.act].round === "deep");

/**
 * The Evidence act on its own.
 *
 * When someone says the result doesn't fit, this is the channel most likely to
 * be at fault — it carries the heaviest weight (§8.1) and it's the one people
 * answer wrongly when they've spent a stretch in an ill-fitting role, reporting
 * what that role demanded rather than what they're actually sought out for.
 */
export const EVIDENCE_QUESTIONS = QUESTIONS.filter((q) => q.act === "evidence");

export const CORE_ACTS: ActId[] = ["energy", "ease", "evidence", "edge"];
export const DEEP_ACTS: ActId[] = ["conditions", "drains", "crosscheck"];
