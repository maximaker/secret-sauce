import { QUESTIONS } from "./questions";
import { emptyAnswers, type Answers } from "./scoring";
import { STAGE_KEYS, type StageKey } from "./stages";

/**
 * Results are shareable without a server: the whole answer set is packed into
 * the URL. No database, no account, nothing transmitted anywhere. PRD §8.
 *
 * Every scored question gets a slot, in declaration order, whether or not it
 * was answered — so a core-only result and a full deep result use the same
 * layout and the deep half is simply empty. Bumping SCHEMA invalidates old
 * links rather than decoding them into the wrong questions.
 */

const SCHEMA = "2";
const MAX_LINE = 140;
const SCORED = QUESTIONS.filter((q) => q.kind !== "text");

const toBase64Url = (input: string) =>
  btoa(unescape(encodeURIComponent(input)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const fromBase64Url = (input: string) => {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  return decodeURIComponent(escape(atob(padded + "===".slice((padded.length + 3) % 4))));
};

export function encodeAnswers(answers: Answers): string {
  const picks = SCORED.map((q) => (answers.choices[q.id] ?? []).join(".")).join("|");
  const line = answers.line.trim().slice(0, MAX_LINE);
  return toBase64Url([SCHEMA, answers.stage ?? "", picks, line].join("~"));
}

export function decodeAnswers(token: string): Answers | null {
  try {
    const [schema, stage, picks, ...lineParts] = fromBase64Url(token).split("~");
    if (schema !== SCHEMA) return null;
    if (!STAGE_KEYS.includes(stage as StageKey)) return null;

    const groups = (picks ?? "").split("|");
    if (groups.length !== SCORED.length) return null;

    const answers = emptyAnswers();
    answers.stage = stage as StageKey;
    answers.line = lineParts.join("~").slice(0, MAX_LINE);

    SCORED.forEach((question, index) => {
      const ids = groups[index].split(".").filter(Boolean);
      const valid = new Set(question.options.map((o) => o.id));
      const kept = ids.filter((id) => valid.has(id));
      if (kept.length) answers.choices[question.id] = kept;
    });

    return answers;
  } catch {
    return null;
  }
}
