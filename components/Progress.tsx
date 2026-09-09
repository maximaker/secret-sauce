"use client";

import { ACTS, QUESTIONS, type ActId } from "@/lib/questions";

const COUNTS = (Object.keys(ACTS) as ActId[]).reduce(
  (acc, act) => {
    acc[act] = QUESTIONS.filter((q) => q.act === act).length;
    return acc;
  },
  {} as Record<ActId, number>,
);

/**
 * One segment per act of the current round — not a percentage. Someone should
 * be able to glance at this and know how much journey is left without being
 * told they are on "question 7 of 16". PRD §6.2.
 */
export function Progress({
  acts,
  answeredByAct,
}: {
  acts: ActId[];
  answeredByAct: Record<ActId, number>;
}) {
  const total = acts.reduce((n, a) => n + COUNTS[a], 0);
  const done = acts.reduce((n, a) => n + answeredByAct[a], 0);

  return (
    <div
      className="progress"
      role="progressbar"
      aria-label="Journey progress"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={done}
    >
      {acts.map((act) => {
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
