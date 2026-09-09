import { QUESTIONS } from "./questions";
import { emptyAnswers, type Answers } from "./scoring";
import { STAGE_KEYS, type StageKey } from "./stages";

/**
 * Results are shareable without a server: the whole answer set is packed into
 * the URL. No database, no account, nothing transmitted anywhere. PRD §8.
 */

const MAX_LINE = 140;

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
  const picks = QUESTIONS.filter((q) => q.kind !== "text")
    .map((q) => (answers.choices[q.id] ?? []).join("."))
    .join("|");
  const line = answers.line.trim().slice(0, MAX_LINE);
  return toBase64Url([answers.stage ?? "", picks, line].join("~"));
}

export function decodeAnswers(token: string): Answers | null {
  try {
    const [stage, picks, ...lineParts] = fromBase64Url(token).split("~");
    if (!STAGE_KEYS.includes(stage as StageKey)) return null;

    const answers = emptyAnswers();
    answers.stage = stage as StageKey;
    answers.line = lineParts.join("~").slice(0, MAX_LINE);

    const groups = (picks ?? "").split("|");
    const scored = QUESTIONS.filter((q) => q.kind !== "text");
    if (groups.length !== scored.length) return null;

    scored.forEach((question, index) => {
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
