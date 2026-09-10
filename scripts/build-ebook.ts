/**
 * Generates the reference chapters of the ebook from the app's own data.
 *
 * Chapter 8 (the catalogue), Appendix A (the question bank) and Appendix B
 * (scoring by hand) are all restatements of what lib/ already contains. Typing
 * them out again would guarantee they drift the first time a question is
 * reworded, and a book that disagrees with the test it documents is worse than
 * no book. The narrative chapters are hand-written; these three are not.
 *
 *   npm run build:ebook
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { ARCHETYPES } from "../lib/archetypes";
import {
  ACTS,
  ACT_WEIGHT,
  CONDITION_AXES,
  QUESTIONS,
  channelOf,
  type ActId,
} from "../lib/questions";
import { RARITY, RARITY_SAMPLES } from "../lib/rarity";
import { SIGNALS, SIGNAL_KEYS } from "../lib/signals";

const root = process.cwd();
const write = (name: string, body: string) => {
  writeFileSync(join(root, "ebook", name), body.replace(/\n{3,}/g, "\n\n") + "\n", "utf8");
  console.log(`  wrote ebook/${name}`);
};

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/* ── Chapter 8 — the catalogue ─────────────────────────────────────── */

// Share of sampled profiles landing on each archetype, for the "how common"
// line. Same caveat as everywhere else: this is the profile space, not people.
const archetypeShare = new Map<string, number>();
for (const [key, count] of Object.entries(RARITY)) {
  const id = key.split("|")[0];
  archetypeShare.set(id, (archetypeShare.get(id) ?? 0) + count);
}

const catalogue = [
  // No part heading: this chapter continues Part Two, and repeating the part
  // title here reads as a second Part Two in the contents.
  "## 8. The twelve shapes",
  "",
  "What follows is the catalogue. Twelve shapes, each a particular mix of the",
  "eight signals.",
  "",
  "Read them in order rather than hunting for the one you like. The recognition",
  "you're looking for is not *I would enjoy being that* — it's the slightly",
  "uncomfortable *oh, that's what I keep doing*. If two feel true, read both",
  "shadows; the shadow is usually where the tie breaks, because you'll recognise",
  "one of the costs as something you've actually paid.",
  "",
  "Each entry has five parts. **What you do** is the behaviour. **Why it's worth",
  "something** is the market argument — why anyone would pay, defer or stay.",
  "**What it costs** is the shadow, and it is not decoration. **Two moves** are",
  "specific and for this week. **The line** is yours to say out loud.",
  "",
  "The percentage is how often this shape comes out of the instrument across",
  "300,000 randomly answered runs — a property of the profile space these",
  "questions can produce, not a measurement of how many people are like this.",
  "",
  "---",
  "",
];

for (const a of ARCHETYPES) {
  const share = ((archetypeShare.get(a.id) ?? 0) / RARITY_SAMPLES) * 100;
  catalogue.push(
    `### ${a.name}`,
    "",
    `*${a.tagline}*`,
    "",
    `**Signals:** ${SIGNALS[a.primary].label} + ${SIGNALS[a.secondary].label}  `,
    `**Frequency:** ${share.toFixed(1)}% of profiles`,
    "",
    `**What you do.** ${a.essence}`,
    "",
    `**Why it's worth something.** ${a.worth}`,
    "",
    `**What it costs.** ${a.shadow}`,
    "",
    "**Two moves.**",
    "",
    ...a.moves.map((m) => `- ${m}`),
    "",
    `**The line.** “${a.pitch}”`,
    "",
    `**In one clause, for a profile:** “${a.headline}”`,
    "",
    "---",
    "",
  );
}

catalogue.push(
  "### If none of them fit",
  "",
  "Two possibilities, and they need different responses.",
  "",
  "The first is that you're a genuine blend — your two closest shapes scored",
  "nearly the same, and neither description is quite right on its own because",
  "you're standing between them. This is common and it isn't a failure of the",
  "instrument. Read both, and treat the pair as the description.",
  "",
  "The second is that you answered the Evidence questions as the person your",
  "current situation needs rather than the person you are. This happens most to",
  "people who have spent a couple of years in a badly-fitting role: you report",
  "what the job demanded, because that genuinely is what people have been coming",
  "to you for, and the result faithfully describes a version of you that you",
  "don't like much. If that's the shape of your discomfort, answer the Evidence",
  "questions again about a period when things were going well.",
  "",
  "What you should *not* do is pick the shape you'd prefer. Chapter 9 is about",
  "disagreeing properly, which means changing the input rather than the output.",
);

write("03-the-twelve-shapes.md", catalogue.join("\n"));

/* ── Appendix A — the question bank ────────────────────────────────── */

const ACT_ORDER: ActId[] = [
  "energy",
  "ease",
  "evidence",
  "edge",
  "conditions",
  "drains",
  "crosscheck",
];

const vec = (v: Record<string, number | undefined>) =>
  Object.entries(v)
    .map(([k, n]) => `${SIGNALS[k as keyof typeof SIGNALS].label} ${n! > 0 ? "+" : ""}${n}`)
    .join(", ") || "—";

const bank = [
  "# Appendix A — The full question bank",
  "",
  "Every question the test asks, with the signal weights each answer carries, so",
  "you can run the whole thing on paper.",
  "",
  "Two rules if you're self-administering. **Answer quickly** — your first",
  "response is less edited than your considered one, and this is one of the rare",
  "cases where less editing means more accuracy. And **don't read the weights",
  "until you've answered**; knowing what an option scores is the fastest way to",
  "produce a portrait of who you'd like to be.",
  "",
  "Within each question the options are written to be roughly equal in social",
  "desirability — there is no obviously correct answer to reach for. If one",
  "looks obviously better to you, that preference is itself data.",
  "",
];

for (const act of ACT_ORDER) {
  const qs = QUESTIONS.filter((q) => q.act === act);
  if (!qs.length) continue;
  const a = ACTS[act];
  bank.push(
    `## ${cap(a.title)}`,
    "",
    `*${a.intro}*`,
    "",
    `Round: **${a.round}** · Weight: **×${ACT_WEIGHT[act]}**`,
    "",
  );
  for (const q of qs) {
    bank.push(`**${q.id.toUpperCase()}. ${q.prompt}**`, "");
    if (q.hint) bank.push(`*${q.hint}*`, "");
    if (q.kind === "text") {
      bank.push(
        `> ${q.prefix} ______________`,
        "",
        "Optional, and it isn't scored — it's quoted back to you verbatim in the",
        "result. Write it anyway. It's usually the truest sentence on the page.",
        "",
      );
      continue;
    }
    bank.push(
      `*Channel: ${channelOf(q)}${
        q.kind === "multi" ? ` · pick up to ${q.maxPicks}` : " · pick one"
      }*`,
      "",
      "| | Option | Scores |",
      "|---|---|---|",
      ...q.options.map(
        (o, i) =>
          `| ${i + 1} | ${o.label}${o.sub ? ` — *${o.sub}*` : ""} | ${
            o.pos !== undefined ? `position ${o.pos > 0 ? "+" : ""}${o.pos}` : vec(o.vector)
          } |`,
      ),
      "",
    );
  }
}

bank.push(
  "## The condition axes",
  "",
  "The four Conditions questions don't score signals at all. Each one places you",
  "on a spectrum, and the position is read straight off your answer.",
  "",
  "| Axis | Far left (−2) | Left (−1) | Right (+1) | Far right (+2) |",
  "|---|---|---|---|---|",
  ...CONDITION_AXES.map(
    (x) =>
      `| **${x.label}** (${x.left} ↔ ${x.right}) | ${x.ask["-2"]} | ${x.ask["-1"]} | ${x.ask["1"]} | ${x.ask["2"]} |`,
  ),
);

write("A-question-bank.md", bank.join("\n"));

/* ── Appendix B — scoring by hand ──────────────────────────────────── */

const scoring = [
  "# Appendix B — Scoring it by hand",
  "",
  "The test does this in a few milliseconds. Doing it yourself takes about",
  "fifteen minutes and has one real advantage: you finish knowing exactly what",
  "was measured, which makes the result much harder to either over-trust or",
  "dismiss.",
  "",
  "## Step 1 — Add up your signals",
  "",
  "Draw eight columns:",
  "",
  `| ${SIGNAL_KEYS.map((k) => SIGNALS[k].label).join(" | ")} |`,
  `|${SIGNAL_KEYS.map(() => "---").join("|")}|`,
  `|${SIGNAL_KEYS.map(() => "   ").join("|")}|`,
  "",
  "For every option you chose, find its weights in Appendix A and add them to",
  "the right columns — **multiplied by that act's weight**:",
  "",
  "| Act | Weight | Why |",
  "|---|---|---|",
  `| Evidence | ×${ACT_WEIGHT.evidence} | External, and the hardest channel to flatter |`,
  `| Ease | ×${ACT_WEIGHT.ease} | A felt asymmetry beats a stated preference |`,
  `| Cross-check | ×${ACT_WEIGHT.crosscheck} | Same ground, asked differently |`,
  `| Energy | ×${ACT_WEIGHT.energy} | Honest, but easy to answer aspirationally |`,
  `| Edge | ×${ACT_WEIGHT.edge} | Honest, but easy to answer aspirationally |`,
  `| Drains | ×${ACT_WEIGHT.drains} | Counts *against* the signals it names |`,
  `| Conditions | ×${ACT_WEIGHT.conditions} | Describes the setting, not the person |`,
  "",
  "## Step 2 — Note your top four",
  "",
  "Rank the eight columns. The top four are your signal readout. Divide each by",
  "your highest score and multiply by 100 if you want the percentages the test",
  "shows.",
  "",
  "## Step 3 — Find your shape",
  "",
  "Each shape is a point in the same eight dimensions:",
  "",
  `| Shape | ${SIGNAL_KEYS.map((k) => SIGNALS[k].label.slice(0, 4)).join(" | ")} |`,
  `|---|${SIGNAL_KEYS.map(() => "---").join("|")}|`,
  ...ARCHETYPES.map(
    (a) =>
      `| ${a.name} | ${SIGNAL_KEYS.map((k) => (a.vector[k] ? a.vector[k] : "·")).join(" | ")} |`,
  ),
  "",
  "You want the shape pointing most nearly the same direction as your own totals",
  "— not the one with the biggest overlap in raw numbers. For each shape:",
  "",
  "1. Multiply your score and the shape's score for each of the eight signals,",
  "   and add the eight results together. Call it **A**.",
  "2. Square each of your eight scores, add them, take the square root. Call it",
  "   **B**. (You only compute this once.)",
  "3. Do the same for the shape's eight numbers. Call it **C**.",
  "4. The match is **A ÷ (B × C)**, which lands between 0 and 1.",
  "",
  "Highest match wins. This is cosine similarity, and the reason for the",
  "division is that it compares direction rather than magnitude — so answering",
  "decisively doesn't inflate your score, it just sharpens it.",
  "",
  "**The gap between your top two matters.** If they're within about 0.03 of",
  "each other you're a blend, and you should read both entries and treat the",
  "pair as your description.",
  "",
  "## Step 4 — The honest bit",
  "",
  "Now do the whole of Step 1 twice more, on subsets:",
  "",
  "- **Self:** only the Energy, Ease, and Edge questions marked *self*.",
  "- **Evidence:** only the questions marked *external*.",
  "",
  "Compare the top signal of each. If they're the same, your self-image and the",
  "evidence agree, and you can trust the result. If they differ, you've found",
  "the most useful thing in this book, and Chapter 9 is about what to do with",
  "it.",
];

write("B-scoring.md", scoring.join("\n"));

console.log("ebook reference chapters rebuilt");
