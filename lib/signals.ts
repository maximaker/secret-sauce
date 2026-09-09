/**
 * The eight signals.
 *
 * Every answer in the journey contributes weight to this eight-dimensional
 * vector. Archetypes are also expressed in this space, which lets us match by
 * the *shape* of a profile rather than by whichever raw score happens to be
 * biggest.
 */

export const SIGNAL_KEYS = [
  "pattern",
  "insight",
  "craft",
  "drive",
  "people",
  "signal",
  "care",
  "play",
] as const;

export type SignalKey = (typeof SIGNAL_KEYS)[number];

export type SignalVector = Partial<Record<SignalKey, number>>;
export type FullVector = Record<SignalKey, number>;

export const ZERO_VECTOR = (): FullVector => ({
  pattern: 0,
  insight: 0,
  craft: 0,
  drive: 0,
  people: 0,
  signal: 0,
  care: 0,
  play: 0,
});

type SignalMeta = {
  key: SignalKey;
  label: string;
  /** Plain-language gloss, shown under the bar on the reveal. */
  gloss: string;
  /** Second-person fragment used to compose the sauce sentence. */
  fragment: string;
};

export const SIGNALS: Record<SignalKey, SignalMeta> = {
  pattern: {
    key: "pattern",
    label: "Pattern",
    gloss: "You see the structure underneath. Connections other people have to be shown.",
    fragment: "sees the shape of a thing before anyone has drawn it",
  },
  insight: {
    key: "insight",
    label: "Insight",
    gloss: "You go to the bottom of things. Surface answers don't satisfy you.",
    fragment: "keeps digging until the real answer shows up",
  },
  craft: {
    key: "craft",
    label: "Craft",
    gloss: "You make things concrete, and then you make them good.",
    fragment: "makes things properly, not just quickly",
  },
  drive: {
    key: "drive",
    label: "Drive",
    gloss: "You start before it's comfortable and finish after it stops being fun.",
    fragment: "moves things that have stopped moving",
  },
  people: {
    key: "people",
    label: "People",
    gloss: "You read the room accurately and move it deliberately.",
    fragment: "reads people accurately and acts on what they read",
  },
  signal: {
    key: "signal",
    label: "Signal",
    gloss: "You make things land. Complicated goes in, obvious comes out.",
    fragment: "makes complicated things land",
  },
  care: {
    key: "care",
    label: "Care",
    gloss: "You hold things together. People are safer when you're on it.",
    fragment: "holds things together when they'd otherwise drift",
  },
  play: {
    key: "play",
    label: "Play",
    gloss: "You find the third option. The angle nobody in the room considered.",
    fragment: "finds the option nobody else was looking for",
  },
};
