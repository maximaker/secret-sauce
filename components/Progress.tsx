"use client";

import { ACTS, QUESTIONS, type ActId } from "@/lib/questions";

const SCORED_ACTS: ActId[] = ["energy", "ease", "evidence", "edge"];

const COUNTS = Object.fromEntries(
  SCORED_ACTS.map((act) => [act, QUESTIONS.filter((q) => q.act === act).length]),
) as Record<ActId, number>;

/**
 * Four segments, one per act — not a percentage. Someone should be able to
 * glance at this and know how much journey is left without being told they are
 * on "question 7 of 11". PRD §6.2.
 */
export function Progress({ answeredByAct }: { answeredByAct: Record<ActId, number> }) {
  return (
    <div className="progress" role="progressbar" aria-label="Journey progress" aria-valuemin={0} aria-valuemax={QUESTIONS.length} aria-valuenow={SCORED_ACTS.reduce((n, a) => n + answeredByAct[a], 0)}>
      {SCORED_ACTS.map((act) => {
        const fill = Math.min(1, answeredByAct[act] / COUNTS[act]);
        return (
          <div key={act} className="progress-seg" title={ACTS[act].title}>
            <div
              className="progress-fill"
              style={{ "--fill": fill } as React.CSSProperties}
            />
          </div>
        );
      })}
    </div>
  );
}
