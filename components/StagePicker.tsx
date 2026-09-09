"use client";

import { ACTS } from "@/lib/questions";
import { STAGE_LIST, type StageKey } from "@/lib/stages";

export function StagePicker({
  value,
  onPick,
}: {
  value: StageKey | null;
  onPick: (stage: StageKey) => void;
}) {
  const act = ACTS.calibrate;

  return (
    <div className="canvas enter">
      <div className="act-marker">
        <span>{act.marker}</span>
      </div>

      <h2 className="display question-title" id="stage-q">
        Where are you, roughly?
      </h2>
      <p className="hint">{act.intro}</p>

      <ul className="options stage-list" role="radiogroup" aria-labelledby="stage-q">
        {STAGE_LIST.map((stage, index) => (
          <li key={stage.key}>
            <button
              type="button"
              className="option"
              role="radio"
              aria-checked={value === stage.key}
              onClick={() => onPick(stage.key)}
            >
              <span className="option-key" aria-hidden="true">
                {value === stage.key ? "✓" : index + 1}
              </span>
              <span className="option-body">
                <span className="option-label">{stage.label}</span>
                <span className="option-sub">{stage.sub}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
