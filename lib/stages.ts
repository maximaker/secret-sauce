/**
 * Life stages.
 *
 * Stage never changes which questions you see or how you're scored. It changes
 * only the currency your result is translated into — because "this is your
 * personal statement" and "this is your board contribution" are the same
 * insight priced in different money. PRD §4.1.
 */

export const STAGE_KEYS = ["teen", "early", "mid", "senior"] as const;
export type StageKey = (typeof STAGE_KEYS)[number];

export type Stage = {
  key: StageKey;
  label: string;
  sub: string;
  /** Headline noun for the result: "your …". */
  currency: string;
  /** One paragraph translating the archetype into this stage's stakes. */
  valueFrame: string;
  /** Two stage-specific moves, joined with two archetype-specific ones. */
  moves: string[];
  /**
   * Labels and the closing clause for the paste-ready artifacts. The same
   * insight has to arrive as a personal statement for a teenager and a board
   * bio for a veteran; only the framing differs.
   */
  artifacts: {
    headline: string;
    spoken: string;
    written: string;
    close: string;
  };
};

export const STAGES: Record<StageKey, Stage> = {
  teen: {
    key: "teen",
    label: "Still at school, or just out",
    sub: "Roughly 14–19",
    currency: "angle",
    valueFrame:
      "Nobody expects you to have experience yet — which means the only thing that separates you from everyone else applying is a clear, specific account of how you think. Most people your age write “I am hardworking and passionate.” That is invisible. What you have below is the opposite: a particular way of being useful that you can point at with real examples. Use it in personal statements, applications, interviews, and the first ten seconds of meeting anyone who might matter later.",
    moves: [
      "Write down three times you did this — an actual moment, with a date. Vague strengths are worthless; three concrete stories are unarguable.",
      "Find one adult who does this for a living and ask them a single question. Not for advice — for the shape of the job.",
    ],
    artifacts: {
      headline: "For a profile, form or bio",
      spoken: "When someone asks what you’re good at",
      written: "Opening lines for a personal statement",
      close: "That's the thing I'd want a course or a first job to actually use.",
    },
  },
  early: {
    key: "early",
    label: "Early in my working life",
    sub: "Roughly 20–34",
    currency: "angle",
    valueFrame:
      "You are competing with people who have the same qualification and the same job title. Skills won't separate you — they're table stakes and everyone lists them. What separates you is a repeatable way of being useful that people remember and refer. This is the thing to put in the top line of your profile, to say when someone asks what you do, and to point yourself toward when you're choosing between two roles that look identical on paper.",
    moves: [
      "Rewrite the first line of your profile so it says this instead of your job title. Titles are interchangeable; this isn't.",
      "Say yes this month to one piece of work that needs exactly this — even if it's unglamorous. Reputation compounds off repetition, not variety.",
    ],
    artifacts: {
      headline: "LinkedIn headline",
      spoken: "“Tell me about yourself”",
      written: "Opening lines for a profile or cover letter",
      close: "That's what I want a role to actually use.",
    },
  },
  mid: {
    key: "mid",
    label: "Well into it",
    sub: "Roughly 35–54",
    currency: "signature",
    valueFrame:
      "At this point you can do many things competently, and that's the trap: competence pulls you toward being generally useful and away from being specifically valuable. The question is no longer what you're able to do — it's what you should stop doing so the thing below gets your best hours. This is your signature: the work that only degrades when someone else does it. Everything else is a candidate for delegation.",
    moves: [
      "Name one recurring thing on your plate that someone else could do at 80%. Give it away this month. 80% from them beats 100% from you at the cost of this.",
      "Look at your last six months. If less than a third of it used this, that's not a busy patch — that's a drift, and it needs a deliberate correction.",
    ],
    artifacts: {
      headline: "How you introduce yourself",
      spoken: "When someone asks what you do",
      written: "For a promotion case or a review",
      close: "That's the work my best hours should be going to.",
    },
  },
  senior: {
    key: "senior",
    label: "Deep in, or onto the next thing",
    sub: "Roughly 55 and up",
    currency: "signature",
    valueFrame:
      "The most valuable thing you carry now is not what you can produce yourself — it's judgement that took decades to build and can't be shortcut by anyone younger, however capable. The risk at this stage isn't running out of ability; it's letting the thing below stay implicit, so it leaves the room when you do. The task is to make it transferable: to name it, to put it where others can see it working, and to spend it where it compounds.",
    moves: [
      "Pick one person who would be measurably better at their job if they could do this. Give them one hour a month and nothing else. That's how it survives you.",
      "Choose where this is worth most now — advising, governance, teaching, building one last thing — and decline something good to protect it.",
    ],
    artifacts: {
      headline: "Bio line",
      spoken: "When someone asks what you do now",
      written: "For an advisory, board or speaker bio",
      close: "That's what I'm most useful for now.",
    },
  },
};

export const STAGE_LIST = STAGE_KEYS.map((k) => STAGES[k]);
