# Secret Sauce

A short, cinematic web journey that asks well-aimed questions and hands back the
specific thing that makes you both **unique** and **valuable** — in language you
can use on Monday.

Built to work equally for a fifteen-year-old and a fifty-five-year-old, with no
account and nothing transmitted anywhere.

**[PRD.md](./PRD.md)** is the source of truth for the product decisions behind this.

---

## How it works

**Four E's.** Secret sauce isn't a trait — it's an overlap. The journey measures
four faces of it: **Energy** (what charges you), **Ease** (what's suspiciously
easy), **Evidence** (what people actually come to you for), and **Edge** (your
unusual combination). Unique = Energy × Edge. Valuable = Ease × Evidence.

**Eight signals.** Every answer contributes weight to an eight-dimensional
vector: Pattern, Insight, Craft, Drive, People, Signal, Care, Play.

**Twelve archetypes.** Each is a point in that same space. Your result is the one
whose *direction* most closely matches yours (cosine similarity), so a decisive
answerer and a broad answerer are compared fairly. Every archetype ships with its
shadow — a result that only flatters reads as a horoscope.

**Two channels.** Every item is tagged `self` or `external`. They're scored
separately as well as together, and the gap between them becomes its own result
section: what you think you're good at versus what people actually come to you
for. It's the only part of the page that isn't flattering by construction.

**Stage-translated payoff.** Questions are deliberately stage-agnostic; only the
result adapts. The same insight becomes personal-statement language for a
teenager and legacy language for a veteran.

## The two rounds

| | Questions | Time | You get |
|---|---|---|---|
| **Core** | 16 | ~5 min | Archetype, sauce sentence, signal readout, the self/evidence gap, why it's valuable, the shadow, four moves, your pitch line |
| **Deep** *(opt-in, from the result)* | 8 | ~3 min | Plus: the conditions your sauce needs, what drains it, and a stress-tested confidence rating |

The split is deliberate. Doubling the question count in one pass trades accuracy
for abandonment, so everyone gets a complete result at the five-minute mark and
only the people who want a sharper one pay for it — after they've seen the value.

## How the items are written

Grounded in the assessment literature rather than intuition:

- Options within a question are **equal in social desirability**. Forced-choice
  format doesn't debias on its own — [research finds it recovers the same
  information as Likert, social desirability
  included](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11095325/). What
  debiases is removing the obviously correct answer.
- **Three to five items per construct**, the conventional floor for reliability.
- **Episodic recall over trait self-report** — "the last time someone asked for
  your help specifically" is harder to flatter than "are you helpful?".
- **Behaviour over aspiration** — "what do you catch yourself doing when you're
  meant to be doing something else?".
- **External evidence weighted highest**, after the [Reflected Best
  Self](https://positiveorgs.bus.umich.edu/cpo-tools/rbse/) tradition.

## Anti-burden rules

No account. One question per screen. Single-select questions advance on their
own, so it's one tap, not two. Full keyboard control (`1`–`8`, `Enter`,
`Backspace`). Progress is four act segments and a page that shifts hue as you
move through them — nobody needs to be told they're on "question 7 of 16".
Progress survives a refresh, including which round you're in.

## Validation

`buildResult` is deterministic and pure, so it's testable by simulation. A
harness generates random valid answer sets and asserts that all twelve
archetypes stay reachable, that no signal is systematically inflated, that every
result has four moves and a well-formed sentence, and that no copy path can
produce a degenerate sentence. Current status: 0 defects across 50,000 runs, with
an archetype floor of 3.2% and a signal spread of 1.36×.

Thresholds are calibrated against that simulation rather than guessed — the
confidence cut sits at 0.35 because the median run separates by 0.37.

## Privacy

Scoring runs entirely in the browser. Nothing is sent to a server, there is no
database, no analytics, and no cookies. A finished result is encoded into the URL
fragment, which is what makes it shareable without a backend — and means anyone
holding the link can read the result.

## Running it

```bash
npm install
npm run dev     # http://localhost:3111
npm run build
```

## Layout

```
app/
  layout.tsx        fonts, metadata, atmosphere layers
  page.tsx          the journey state machine (two rounds)
  globals.css       design tokens, act hues, motion
components/         Landing · StagePicker · QuestionScreen · Progress · Reveal
lib/
  signals.ts        the eight signals
  questions.ts      the bank, act definitions, condition axes, channels
  archetypes.ts     the twelve archetypes
  stages.ts         life-stage translations
  scoring.ts        vector maths, matching, alignment, sentence composition
  share.ts          schema-versioned URL encoding of a result
```

Next.js 16 · React 19 · TypeScript · hand-written CSS. No UI framework, no state
library, no backend.
