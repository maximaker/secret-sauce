# Secret Sauce — Product Requirements Document

**Version:** 1.0
**Date:** 2026-09-10
**Status:** Approved for build
**Owner:** Max

---

## 1. The one-line version

A short, cinematic web journey that asks you eleven well-aimed questions and hands back the specific thing that makes you both **unique** and **valuable** — in language you can actually use on Monday.

---

## 2. Problem

Everyone is told to "find your strengths," "know your superpower," "build your personal brand." The existing tools fail in one of three ways:

| Failure mode | Example | Why it fails |
|---|---|---|
| **Too long** | 177-question psychometrics | Abandonment. The instrument is the obstacle. |
| **Too vague** | "You are an Achiever!" | True of everyone. Not actionable, not differentiating. |
| **Too narrow** | Corporate competency frameworks | Meaningless to a 16-year-old; patronising to a 30-year veteran. |

And almost all of them answer the wrong question. They measure **traits** ("you are conscientious"). Nobody is paid, admired, chosen, or remembered for a trait. People are valued for the *intersection* of what comes easily to them and what is hard for everyone else.

**The gap:** there is no fast, dignified, universal tool that names your asymmetric advantage and then translates it into the currency of your particular life stage.

## 3. Product hypothesis

If we ask a small number of *emotionally precise* questions — the kind that make you pause rather than scroll — and if the experience feels like a journey rather than a form, then people across a 50-year age range will complete it in under five minutes and receive something they immediately want to say out loud.

---

## 4. Audience

Three cohorts, one product. Deliberately **not** three products.

| Cohort | Age | What they actually want | Failure state to avoid |
|---|---|---|---|
| **Teenagers / students** | 14–19 | "What am I actually good at?" — before university applications, first jobs, identity formation | Corporate jargon. Being talked down to. |
| **Young professionals** | 20–34 | "What's my angle?" — differentiation in a crowded market, positioning, interview language | Generic careers-advice mush. |
| **Experienced professionals** | 35–54 | "What's my signature?" — the thing to lean into, delegate around, be known for | Being handed a beginner's tool. |
| **Senior / veterans** | 55+ | "What's my legacy contribution?" — mentorship, board work, second acts | Ageist framing that assumes the ramp is over. |

### 4.1 The universality decision

**Key design decision:** the *questions* are stage-agnostic; the *payoff* is stage-specific.

Question copy is written so a 16-year-old and a CTO can both answer it honestly and mean different things ("a room full of people who disagree" is a classroom or a board). This keeps the question bank tight, avoids 4× content bloat, and — critically — avoids the condescension that comes from age-segmented questions.

Personalisation lands where it creates value: the **result**. The same archetype is translated into a personal-statement line for a teen, a positioning line for a young professional, and a leadership signature for a veteran.

---

## 5. The framework

### 5.1 The Four E's

Secret sauce is not a trait. It is an overlap. We measure four faces of it:

| E | Question it answers | Why it matters |
|---|---|---|
| **Energy** | What charges you rather than drains you? | Sustainability. A strength you hate is a liability. |
| **Ease** | What is suspiciously easy for you? | Asymmetry. You can't see your own advantage because it feels like nothing. |
| **Evidence** | What do people actually come to you for? | External proof. Removes self-delusion. |
| **Edge** | What unusual combination do you carry? | Rarity. Value lives in the intersection, not the skill. |

*Unique* = Energy × Edge. *Valuable* = Ease × Evidence. Secret sauce = all four.

### 5.2 The eight signals

Every answer contributes weight to an eight-dimensional signal vector:

| Signal | Plain meaning |
|---|---|
| **Pattern** | Sees structure; connects dots; systems |
| **Insight** | Gets to the truth of a thing; depth |
| **Craft** | Makes it concrete and makes it good |
| **Drive** | Starts, pushes, finishes through friction |
| **People** | Reads, moves, and mobilises humans |
| **Signal** | Communicates; makes things land |
| **Care** | Stewardship; the reason things don't fall apart |
| **Play** | Invention; the lateral leap; the third option |

### 5.3 The twelve archetypes

Each archetype is a weighted vector over the eight signals. Results are assigned by cosine similarity against the user's normalised vector — not by "whichever score is highest," which produces flat, obvious results.

| Archetype | Primary + Secondary | The line |
|---|---|---|
| **The Cartographer** | Pattern + Insight | Maps the territory nobody else can see |
| **The Translator** | Signal + Insight | Turns the complicated into the obvious |
| **The Builder** | Craft + Drive | Turns "someone should" into "it exists" |
| **The Catalyst** | Drive + People | Makes things happen through other people |
| **The Anchor** | Care + Craft | The reason it doesn't fall apart |
| **The Inventor** | Play + Craft | Finds the third option nobody considered |
| **The Connector** | People + Signal | Knows who, and knows how to ask |
| **The Diagnostician** | Insight + Care | Finds what's actually wrong, not what's loudest |
| **The Provocateur** | Play + Signal | Asks the question that reroutes the room |
| **The Steward** | Care + People | Makes it safe to do good work |
| **The Architect** | Pattern + Craft | Designs the thing that survives scale |
| **The Closer** | Drive + Signal | Gets it over the line |

### 5.4 The shadow

Every archetype ships with its cost. This is a **credibility requirement**, not a nicety: a result that only flatters reads as a horoscope. Naming the failure mode is what makes the strength believable.

---

## 6. The journey

### 6.1 Structure

Six acts. Eleven questions. One optional sentence. Target: **under 5 minutes**, ~12 taps.

```
Act 0  Threshold   Landing. One line, one button. No form, no signup.
Act 1  Calibrate   "Where are you right now?" — 1 tap, sets result language
Act 2  Energy      3 questions — what charges you
Act 3  Ease        3 questions — what's suspiciously easy
Act 4  Evidence    2 questions + 1 optional line — external proof
Act 5  Edge        2 questions — your unusual combination
Act 6  The Mirror  The reveal
```

### 6.2 Anti-burden rules

These are hard constraints, not preferences:

1. **No account, no email, no signup.** Ever. Nothing is transmitted; scoring is entirely client-side.
2. **One question per screen.** Never a scrolling list of items.
3. **No free text is required.** Exactly one optional single-line prompt, clearly skippable.
4. **No back-tracking anxiety.** A back control exists and preserves answers.
5. **Every question is answerable in under 15 seconds.** If it needs thought, that thought is the point — but not research.
6. **Interaction variety.** Binary choice → four-way choice → multi-select → optional text. Monotony *is* the burden.
7. **Progress is felt, not measured.** No "Question 7 of 11" bar. The world changes colour as you move through the acts.
8. **Resumable.** Progress persists in `localStorage`; leaving is not punished.

### 6.3 The reveal

The payoff screen must be worth the walk. It contains, in order:

1. **The archetype** — name, tagline, arriving with ceremony (slow reveal, not a page load).
2. **Your sauce sentence** — a single composed line built from *their own selections*, not a template with a name slotted in.
3. **The signal readout** — top four of eight, as bars. Evidence that the machine listened.
4. **Why this is valuable** — stage-translated. The teen gets personal-statement language; the veteran gets legacy language.
5. **The shadow** — what it costs, and when it turns against you.
6. **Four moves this week** — two from the archetype, two from the life stage. Concrete, doable, no "reflect on your journey."
7. **Say it out loud** — a copyable one-line pitch.
8. **Share / start again** — result encoded in the URL; no server involved.

---

## 7. Experience & design direction

**Feeling:** late-evening clarity. Cinematic, warm, unhurried, adult. Closer to a title sequence than a quiz.

| Element | Decision |
|---|---|
| **Palette** | Deep ink base (`#0B0A0F`). Accent hue shifts per act: indigo → amber → teal → rose → violet → gold. The colour *is* the progress bar. |
| **Type** | Fraunces (display serif, warm, optical sizing) for questions; Inter for UI. Questions set large — they should fill the screen and demand a beat. |
| **Motion** | Questions exit upward and fade; the next arrives from below. The reveal is slower and staged. All motion honours `prefers-reduced-motion`. |
| **Atmosphere** | Two large blurred radial fields drift behind the content and cross-fade hue on act change. |
| **Input** | Full keyboard support (1–5, arrows, Enter, Esc). Touch targets ≥ 44px. |
| **Density** | One idea per screen. Generous negative space. Never more than eight choices visible. |

---

## 8. Technical specification

| Concern | Decision | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript | Zero-config Vercel deploy; static output |
| Styling | Hand-written CSS with custom-property design tokens | Total control over the motion and atmosphere; no utility-class noise in a highly bespoke UI |
| State | React state + `localStorage` | No backend needed |
| Persistence | None server-side | Privacy is a feature and a marketing line |
| Sharing | Answers encoded into a URL hash (base64url) | Shareable results with no database |
| Rendering | Static export, client-side journey | Instant loads, zero cold start |
| Analytics | None in v1 | No consent banner, no tracking, no cookie friction |
| Hosting | Vercel | Requirement |
| A11y | Semantic radio groups, focus management, live regions, reduced-motion, AA contrast | Non-negotiable |

### 8.1 Scoring algorithm

```
1. Each selected option carries a partial signal vector (e.g. { insight: 2, pattern: 1 }).
2. Sum all vectors → raw score.
3. Weight by act: Ease and Evidence ×1.25 (external + asymmetry evidence
   is more diagnostic than self-reported preference).
4. L2-normalise → user vector u.
5. For each archetype vector a: score = cosine(u, a).
6. Highest cosine wins; deterministic tie-break by primary-signal raw score,
   then by fixed archetype order.
7. Report top 4 signals by normalised raw score for the readout.
```

Cosine similarity is used deliberately: it rewards the *shape* of someone's profile rather than raw enthusiasm, so a user who picks decisively and a user who picks broadly are compared fairly.

---

## 9. Success criteria

| Metric | Target |
|---|---|
| Time to complete | Median under 5 minutes |
| Completion rate (landing → reveal) | > 60% |
| Result recognition | User says "that's actually me" — validated qualitatively across all four cohorts |
| Age robustness | A 16-year-old and a 58-year-old both find every question answerable and neither finds the result patronising |
| Cold load | Interactive under 1.5s on 4G |
| Accessibility | Fully keyboard-operable; AA contrast throughout |

## 10. Out of scope for v1

- Accounts, saved history, email capture
- Team / comparison mode
- Downloadable PDF or generated share images
- Localisation beyond English
- Any analytics or tracking
- LLM-generated result text (results must be deterministic and instant)

## 11. Later

- **Team mode** — four people take it, the result maps the shape of the team and its blind spot
- **The six-month check-in** — a short re-take that shows drift
- **OG image generation** for shared links
- **Question bank v2** — validated against outcome data
