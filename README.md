# Secret Sauce

A short, cinematic web journey that asks eleven well-aimed questions and hands back the
specific thing that makes you both **unique** and **valuable** — in language you can use
on Monday.

Built to work equally for a fifteen-year-old and a fifty-five-year-old, in about four
minutes, with no account and nothing transmitted anywhere.

**[PRD.md](./PRD.md)** is the source of truth for the product decisions behind this.

---

## How it works

**Four E's.** Secret sauce isn't a trait — it's an overlap. The journey measures four
faces of it: **Energy** (what charges you), **Ease** (what's suspiciously easy),
**Evidence** (what people actually come to you for), and **Edge** (your unusual
combination). Unique = Energy × Edge. Valuable = Ease × Evidence.

**Eight signals.** Every answer contributes weight to an eight-dimensional vector:
Pattern, Insight, Craft, Drive, People, Signal, Care, Play.

**Twelve archetypes.** Each archetype is a point in that same space. Your result is the
one whose *direction* most closely matches yours (cosine similarity), so a decisive
answerer and a broad answerer are compared fairly. Every archetype ships with its shadow
— a result that only flatters reads as a horoscope.

**Stage-translated payoff.** Questions are deliberately stage-agnostic; only the result
adapts. The same insight becomes personal-statement language for a teenager and legacy
language for a veteran.

## Anti-burden rules

No account. One question per screen. Single-select questions advance on their own, so
it's one tap, not two. Full keyboard control (`1`–`8`, `Enter`, `Backspace`). Progress is
shown as four act segments, and the whole page shifts hue as you move through them —
nobody needs to be told they're on "question 7 of 11". Progress survives a refresh.

## Privacy

Scoring runs entirely in the browser. Nothing is sent to a server, there is no database,
no analytics, and no cookies. A finished result is encoded into the URL fragment, which
is what makes it shareable without a backend — and means anyone holding the link can
read the result.

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
  page.tsx          the journey state machine
  globals.css       design tokens, act hues, motion
components/         Landing · StagePicker · QuestionScreen · Progress · Reveal
lib/
  signals.ts        the eight signals
  questions.ts      the question bank and act definitions
  archetypes.ts     the twelve archetypes
  stages.ts         life-stage translations
  scoring.ts        vector maths, matching, sentence composition
  share.ts          URL encoding of a result
```

Next.js 15 · React 19 · TypeScript · hand-written CSS. No UI framework, no state library,
no backend.
