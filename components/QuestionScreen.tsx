"use client";

import { useEffect, useRef } from "react";
import { ACTS, type Option, type Question } from "@/lib/questions";

const KEYCAPS = ["1", "2", "3", "4", "5", "6", "7", "8"];

function OptionButton({
  option,
  index,
  selected,
  multi,
  disabled,
  onSelect,
}: {
  option: Option;
  index: number;
  selected: boolean;
  multi: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  const checkedProp = multi
    ? { "aria-pressed": selected }
    : { role: "radio", "aria-checked": selected };

  return (
    <button
      type="button"
      className="option"
      disabled={disabled}
      onClick={onSelect}
      {...checkedProp}
    >
      <span className="option-key" aria-hidden="true">
        {selected ? "✓" : KEYCAPS[index]}
      </span>
      <span className="option-body">
        <span className="option-label">{option.label}</span>
        {option.sub ? <span className="option-sub">{option.sub}</span> : null}
      </span>
    </button>
  );
}

export function QuestionScreen({
  question,
  selected,
  line,
  showActIntro,
  onToggle,
  onLineChange,
}: {
  question: Question;
  selected: string[];
  line: string;
  showActIntro: boolean;
  onToggle: (optionId: string) => void;
  onLineChange: (value: string) => void;
}) {
  const act = ACTS[question.act];
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (question.kind === "text") inputRef.current?.focus();
  }, [question.kind, question.id]);

  const isMulti = question.kind === "multi";
  const atLimit = isMulti && selected.length >= question.maxPicks;

  return (
    <div className="canvas enter" key={question.id}>
      <div className="act-marker">
        <span>
          {act.marker} · {act.title}
        </span>
      </div>

      {showActIntro ? <p className="act-intro">{act.intro}</p> : null}

      <h2 className="display question-title" id={`q-${question.id}`}>
        {question.prompt}
      </h2>

      {question.hint ? <p className="hint">{question.hint}</p> : null}

      {question.kind === "text" ? (
        <div className="sentence-field">
          <span className="sentence-prefix" aria-hidden="true">
            {question.prefix}
          </span>
          <input
            ref={inputRef}
            className="sentence-input"
            type="text"
            maxLength={140}
            value={line}
            aria-label={`${question.prefix}…`}
            placeholder={question.placeholder}
            onChange={(event) => onLineChange(event.target.value)}
          />
        </div>
      ) : (
        <ul
          className={`options ${
            question.kind === "binary" ? "options--pair" : "options--grid"
          }`}
          role={isMulti ? "group" : "radiogroup"}
          aria-labelledby={`q-${question.id}`}
        >
          {question.options.map((option, index) => {
            const isSelected = selected.includes(option.id);
            return (
              <li key={option.id}>
                <OptionButton
                  option={option}
                  index={index}
                  selected={isSelected}
                  multi={isMulti}
                  disabled={Boolean(atLimit && !isSelected)}
                  onSelect={() => onToggle(option.id)}
                />
              </li>
            );
          })}
        </ul>
      )}

      {isMulti ? (
        <p className="pick-count" aria-live="polite">
          {selected.length === 0
            ? `Pick at least one, up to ${question.maxPicks}.`
            : atLimit
              ? `That's your ${question.maxPicks}. Deselect one to swap.`
              : `${selected.length} of ${question.maxPicks} chosen.`}
        </p>
      ) : null}
    </div>
  );
}
