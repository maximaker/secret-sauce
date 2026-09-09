# Secret Sauce — Product Requirements Document

**Version:** 2.0
**Date:** 2026-09-10
**Status:** Built and deployed
**Owner:** Max

*v2 expands the instrument from 11 items to 24 across seven acts, adds a second
measurement channel, and adds three new result sections. §5.5–§5.7, §6 and §8.1
are the substantive changes; the framework and audience decisions from v1 stand.*

---

## 1. The one-line version

A short, cinematic web journey that asks you well-aimed questions and hands back
the specific thing that makes you both **unique** and **valuable** — in language
you can actually use on Monday.

---

## 2. Problem

Everyone is told to "find your strengths," "know your superpower," "build your
personal brand." The existing tools fail in one of three ways:

| Failure mode | Example | Why it fails |
|---|---|---|
| **Too long** | 177-question psychometrics | Abandonment. The instrument is the obstacle. |
| **Too vague** | "You are an Achiever!" | True of everyone. Not actionable, not differentiating. |
| **Too narrow** | Corporate competency frameworks | Meaningless to a 16-year-old; patronising to a 30-year veteran. |

And almost all of them answer the wrong question. They measure **traits** ("you
are conscientious"). Nobody is paid, admired, chosen, or remembered for a trait.
People are valued for the *intersection* of what comes easily to them and what
is hard for everyone else.

**The gap:** there is no fast, dignified, universal tool that names your
asymmetric advantage and then translates it into the currency of your particular
life stage.

## 3. Product hypothesis

If we ask *emotionally precise* questions — the kind that make you pause rather
than scroll — and if the experience feels like a journey rather than a form,
then people across a 50-year age range will complete it and receive something
they immediately want to say out loud.

---

## 4. Audience

Three cohorts, one product. Deliberately **not** three products.

| Cohort | Age | What they actually want | Failure state to avoid |
|---|---|---|---|
| **Teenagers / students** | 14–19 | "What am I actually good at?" | Corporate jargon. Being talked down to. |
| **Young professionals** | 20–34 | "What's my angle?" — differentiation, positioning, interview language | Generic careers-advice mush. |
| **Experienced professionals** | 35–54 | "What's my signature?" — what to lean into and delegate around | Being handed a beginner's tool. |
| **Senior / veterans** | 55+ | "What's my legacy contribution?" — mentorship, governance, second acts | Ageist framing that assumes the ramp is over. |

### 4.1 The universality decision

**Key design decision:** the *questions* are stage-agnostic; the *payoff* is
stage-specific.

Question copy is written so a 16-year-old and a CTO can both answer it honestly
and mean different things ("a room full of people who disagree" is a classroom
or a board). This keeps the question bank tight, avoids 4× content bloat, and —
critically — avoids the condescension that comes from age-segmented questions.

Personalisation lands where it creates value: the **result**.

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

Each archetype is a weighted vector over the eight signals. Results are assigned
by cosine similarity against the user's normalised vector — not by "whichever
score is highest," which produces flat, obvious results.

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

Every archetype ships with its cost. This is a **credibility requirement**, not
a nicety: a result that only flatters reads as a horoscope. Naming the failure
mode is what makes the strength believable.

### 5.5 Two measurement channels *(new in v2)*

Every scored item is tagged **self** or **external**.

- **self** — Energy, Ease, and the two Edge items about your own combination.
  What you believe about yourself.
- **external** — Evidence, the two Edge items about what others would pay for or
  notice, and one of the two cross-check items. What other people do.

The two are scored separately as well as together. The cosine between them
becomes a result section in its own right: **You vs. the evidence**. A wide gap
is not an error — it is usually the most useful thing the assessment can say,
because it is the only part of the page that isn't flattering by construction.

Current balance: 11 self items, 6 external.

### 5.6 Item-writing rules *(new in v2)*

Grounded in the assessment literature rather than intuition:

1. **Options within a question must be roughly equal in social desirability.**
   Forced-choice format does not debias on its own; recent work finds
   forced-choice and Likert recover the same trait information *including*
   socially desirable responding. What debiases is removing the obviously
   "correct" answer, so every option is written to be one somebody would be
   happy to be.
2. **Three to five items per construct.** Three clears the conventional
   reliability threshold; five is better. v1 gave each of the eight signals only
   two to four actual selections. v2 roughly doubles selections per run.
3. **Prefer episodic recall to trait self-report.** "Think of the last time
   someone asked for your help specifically" beats "are you helpful?" — a
   recalled occasion is harder to flatter than a general impression.
4. **Prefer behaviour to aspiration.** "What do you catch yourself doing when
   you're meant to be doing something else?" measures where attention actually
   goes.
5. **External evidence outranks self-report.** The Reflected Best Self tradition
   builds an entire strengths portrait out of what other people report. We can't
   survey a user's colleagues, but we can weight the items that ask what other
   people actually do (§8.1).

### 5.7 Conditions and drains *(new in v2)*

Two things a strengths result normally omits, both highly actionable:

- **Conditions** — four bipolar axes (Company, Brief, Tempo, Horizon), each read
  from a single graded four-option item. The same person is excellent in one
  setting and unremarkable in another; this says which setting is theirs. These
  contribute **zero** signal weight — they describe the setting, not the person.
- **Drains** — what flattens you even when it goes well, plus the single fastest
  way to waste you. Drains carry a small *negative* signal weight (×0.5): a
  strength you resent isn't your sauce, which is the Energy principle applied in
  reverse.

---

## 6. The journey

### 6.1 Structure

Seven acts across two rounds. The second round is **optional and unlocked from
the result**, which is what lets the instrument grow without becoming a wall.

```
CORE ROUND — 16 questions, about five minutes
  Act 0  Threshold    Landing. One line, one button. No form, no signup.
  Act 1  Calibrate    "Where are you right now?" — 1 tap, sets result language
  Act 2  Energy       4 questions — what charges you
  Act 3  Ease         4 questions — what's suspiciously easy
  Act 4  Evidence     3 questions + 1 optional line — external proof
  Act 5  Edge         4 questions — your unusual combination
         → The Mirror. Full result, plus an invitation to go deeper.

DEEP ROUND — 8 questions, about three minutes, opt-in
  Act 6  Conditions   4 questions — where your sauce actually works
  Act 7  Drains       2 questions — what flattens it
  Act 8  Cross-check  2 questions — the same ground, asked differently
         → The Mirror again, with three sections it couldn't fill before.
```

**Why two rounds rather than one longer one.** The v1 constraint — "under five
minutes, never a burden" — was load-bearing, and doubling the question count in
one pass trades accuracy for abandonment. Splitting it means everyone gets a
complete, usable result at the five-minute mark, and the people who want a
sharper one pay for it with three more minutes *after* they've seen the value.
The deep round is also where the honesty checks live, so the users most invested
in the answer are the ones who get it stress-tested.

### 6.2 Anti-burden rules

Hard constraints, not preferences:

1. **No account, no email, no signup.** Ever. Nothing is transmitted; scoring is
   entirely client-side.
2. **One question per screen.** Never a scrolling list of items.
3. **No free text is required.** Exactly one optional single-line prompt.
4. **Single-select questions advance on their own.** One tap, not two.
5. **No back-tracking anxiety.** Back always works and preserves answers.
6. **Every question is answerable in under 15 seconds.**
7. **Interaction variety.** Binary → four-way → five-way → multi-select → graded
   scale → optional text. Monotony *is* the burden.
8. **Progress is felt, not measured.** No "question 7 of 16". One segment per
   act, and the whole page shifts hue as you move between them.
9. **Resumable.** Progress persists in `localStorage`, including which round.

### 6.3 The reveal

1. **The archetype** — name, tagline, arriving with ceremony.
2. **Your sauce sentence** — composed from *their own selections*, not a
   template with a name slotted in.
3. **What that actually means** — the archetype in two or three sentences.
4. **Your signal** — top four of eight, as bars.
5. **You vs. the evidence** *(new)* — the self/external gap, named plainly.
6. **Why this is worth something** — stage-translated.
7. **Where it works** *(new, deep only)* — the four condition dials.
8. **The cost of it** — the shadow.
9. **What flattens it** *(new, deep only)* — drains and the misuse warning.
10. **Four moves this week** — two from the archetype, two from the life stage.
11. **Say it out loud** — a copyable one-line pitch.
12. **How much to trust this** *(new)* — a confidence label and why.
13. **Go deeper** — shown only when the deep round is unfinished.
14. **Share / start again.**

---

## 7. Experience & design direction

**Feeling:** late-evening clarity. Cinematic, warm, unhurried, adult. Closer to
a title sequence than a quiz.

| Element | Decision |
|---|---|
| **Palette** | Deep ink base (`#09080e`). Accent hue shifts per act: indigo → amber → teal → rose → violet → blue → red → green, resolving to gold at the reveal. The colour *is* the progress bar. |
| **Type** | Fraunces (display serif, warm, optical sizing) for questions; Inter for UI. |
| **Motion** | Questions exit upward and fade; the next arrives from below. Opacity and transform only — animating `filter` promotes every section to its own compositor layer for no visual gain. |
| **Atmosphere** | Two large blurred radial fields drift behind the content and cross-fade hue on act change. |
| **Input** | Full keyboard support (1–8, arrows, Enter, Backspace). Touch targets ≥ 44px. |
| **Density** | One idea per screen. Never more than eight choices visible. |

---

## 8. Technical specification

| Concern | Decision | Rationale |
|---|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript | Zero-config Vercel deploy; static output |
| Styling | Hand-written CSS with custom-property design tokens | Total control over motion and atmosphere |
| State | React state + `localStorage` | No backend needed |
| Persistence | None server-side | Privacy is a feature and a marketing line |
| Sharing | Answers encoded into a URL hash (base64url, schema-versioned) | Shareable results with no database |
| Analytics | None | No consent banner, no tracking, no cookie friction |
| A11y | Semantic radio groups, focus management, live regions, reduced-motion, AA contrast | Non-negotiable |

### 8.1 Scoring algorithm

```
1. Each selected option carries a partial signal vector, e.g. { insight: 2, pattern: 1 }.
2. Sum all vectors, weighted by act:
     Evidence    ×1.35   external, hardest to flatter
     Ease        ×1.25   felt asymmetry beats reported preference
     Cross-check ×1.15
     Energy      ×1.00
     Edge        ×1.00
     Drains      ×0.50   contributes negatively
     Conditions  ×0.00   describes the setting, not the person
3. L2-normalise → user vector u.
4. For each archetype vector a: score = cosine(u, a).
5. Highest cosine wins; deterministic tie-break by primary-signal raw score,
   then by fixed archetype order.
6. separation = (best − runner_up) × 12, clamped to 0…1.
7. agreement = cosine(self_vector, external_vector) → the alignment section.
8. Report top 4 signals by normalised raw score.
```

Cosine similarity is used deliberately: it rewards the *shape* of someone's
profile rather than raw enthusiasm.

**Threshold calibration.** `separation` is compared against 0.35, not a round
0.5. Across 50,000 simulated runs the median separation is 0.37; a 0.5 cut would
label the majority of users "provisional" and quietly undermine their own
result. Alignment bands are 0.82 (aligned) and 0.62 (tilted).

### 8.2 Validation

A simulation harness generates random valid answer sets and asserts:

- all 12 archetypes are reachable (floor 3.2%, ceiling 14.7% over 50k runs);
- no signal is systematically inflated (1.36× spread between the most and least
  scored signal under random answering);
- no result can produce a degenerate sentence — including the case where both
  channels top out on the same signal, which would otherwise read "you lead with
  drive, people come to you for drive";
- every result has exactly four moves and a well-formed sauce sentence.

Current status: **0 defects across 50,000 runs.**

---

## 9. Success criteria

| Metric | Target |
|---|---|
| Time to complete, core round | Median under 6 minutes |
| Completion rate (landing → reveal) | > 60% |
| Deep-round uptake among finishers | > 25% |
| Result recognition | User says "that's actually me" across all four cohorts |
| Age robustness | A 16-year-old and a 58-year-old both find every question answerable and neither finds the result patronising |
| Accessibility | Fully keyboard-operable; AA contrast throughout |

## 10. Out of scope

- Accounts, saved history, email capture
- Team / comparison mode
- Downloadable PDF or generated share images
- Localisation beyond English
- Any analytics or tracking
- LLM-generated result text (results must be deterministic and instant)

## 11. Later

- **Team mode** — four people take it, the result maps the shape of the team and
  its blind spot
- **Genuine 360** — a short link a user sends to three people, whose answers
  populate the external channel for real rather than by self-report. This is the
  single biggest available accuracy gain and the natural v3.
- **The six-month check-in** — a short re-take that shows drift
- **OG image generation** for shared links

## 12. References

- [Why Forced-Choice and Likert Items Provide the Same Information on Personality, Including Social Desirability](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11095325/) — the basis for §5.6 rule 1.
- [Controlling for Response Biases in Self-Report Scales](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6803422/)
- [Measuring single constructs by single items](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0182714) and [short Big Five scale validations](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6966972/) — the basis for §5.6 rule 2.
- [Reflected Best Self Exercise, Center for Positive Organizations](https://positiveorgs.bus.umich.edu/cpo-tools/rbse/) — the basis for §5.5 and §5.6 rule 5.
