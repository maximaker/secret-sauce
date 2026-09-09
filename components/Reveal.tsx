"use client";

import { useState } from "react";
import type { Result } from "@/lib/scoring";
import { STAGES } from "@/lib/stages";

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard can be blocked (insecure context, permissions). Fall back to
      // a hidden textarea so the button still does something useful.
      const field = document.createElement("textarea");
      field.value = text;
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      try {
        document.execCommand("copy");
      } catch {
        /* nothing else to try */
      }
      field.remove();
    }
    setCopied(key);
    window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 2200);
  };

  return { copied, copy };
}

/** A bipolar axis with the reading marked on it. -2 … +2 maps to 0 … 100%. */
function ConditionDial({
  left,
  right,
  label,
  position,
  reading,
}: {
  left: string;
  right: string;
  label: string;
  position: number;
  reading: string;
}) {
  const pct = ((position + 2) / 4) * 100;
  return (
    <div className="dial">
      <div className="dial-head">
        <span className="dial-label">{label}</span>
        <span className="dial-poles">
          <span className={position < 0 ? "is-active" : undefined}>{left}</span>
          <span aria-hidden="true">·</span>
          <span className={position > 0 ? "is-active" : undefined}>{right}</span>
        </span>
      </div>
      <div
        className="dial-track"
        role="meter"
        aria-valuemin={-2}
        aria-valuemax={2}
        aria-valuenow={position}
        aria-label={`${label}: ${position < 0 ? left : right}`}
      >
        <span className="dial-mark" style={{ left: `${pct}%` }} />
      </div>
      <p className="dial-reading">{reading}</p>
    </div>
  );
}

export function Reveal({
  result,
  shareUrl,
  onRestart,
  onDeepen,
  deepCount,
}: {
  result: Result;
  shareUrl: string;
  onRestart: () => void;
  onDeepen: (() => void) | null;
  deepCount: number;
}) {
  const { copied, copy } = useCopy();
  const { archetype, runnerUp, readings, sauceSentence, moves, alignment, confidence } = result;
  const stage = STAGES[result.stage];
  const top = readings.slice(0, 4);

  return (
    <div className="canvas canvas--wide reveal stagger">
      <header className="reveal-head">
        <span className="glyph" aria-hidden="true">
          {archetype.glyph}
        </span>
        <span className="section-label" style={{ marginTop: "-0.4rem" }}>
          Your secret sauce
        </span>
        <h1 className="display archetype-name">{archetype.name}</h1>
        <p className="archetype-tagline">{archetype.tagline}</p>
      </header>

      <p className="sauce">{sauceSentence}</p>

      <section className="section">
        <h2 className="section-label">What that actually means</h2>
        <p className="prose">{archetype.essence}</p>
      </section>

      <section className="section">
        <h2 className="section-label">Your signal</h2>
        <div className="bars">
          {top.map((reading, index) => (
            <div className="bar-row" key={reading.key}>
              <div className="bar-head">
                <span className="bar-name">{reading.label}</span>
                <span className="bar-pct">{reading.strength}</span>
              </div>
              <div
                className="bar-track"
                role="meter"
                aria-valuenow={reading.strength}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={reading.label}
              >
                <div
                  className="bar-fill"
                  style={{
                    width: `${reading.strength}%`,
                    animationDelay: `${300 + index * 130}ms`,
                  }}
                />
              </div>
              <p className="bar-gloss">{reading.gloss}</p>
            </div>
          ))}
        </div>
        <p className="runner-up">
          Your next closest shape is <b>{runnerUp.name}</b> — {runnerUp.tagline.toLowerCase()}{" "}
          {result.separation < 0.35
            ? "You sit genuinely between the two, which is its own kind of rare."
            : "Worth knowing as the direction you lean when the first one isn't needed."}
        </p>
      </section>

      {/* The self / evidence gap. Often the most useful thing on the page,
          because it is the one part that isn't flattering by construction. */}
      <section className="section">
        <h2 className="section-label">You vs. the evidence</h2>
        <p className="alignment-headline">{alignment.headline}</p>
        <p className="prose">{alignment.body}</p>
      </section>

      <section className="section">
        <h2 className="section-label">Why this is worth something</h2>
        <p className="prose">{archetype.worth}</p>
        <div className="panel panel--accent">
          <p className="prose" style={{ color: "var(--text)" }}>
            {stage.valueFrame}
          </p>
        </div>
      </section>

      {result.conditions ? (
        <section className="section">
          <h2 className="section-label">Where it works</h2>
          <p className="prose">
            The same person is excellent in one setting and unremarkable in another. These are
            your settings — worth knowing before you accept the next thing.
          </p>
          <div className="dials">
            {result.conditions.map((c) => (
              <ConditionDial key={c.id} {...c} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="section">
        <h2 className="section-label">The cost of it</h2>
        <p className="prose">{archetype.shadow}</p>
      </section>

      {result.drains || result.misuse ? (
        <section className="section">
          <h2 className="section-label">What flattens it</h2>
          {result.drains ? (
            <ul className="tags">
              {result.drains.map((d) => (
                <li className="tag" key={d}>
                  {d}
                </li>
              ))}
            </ul>
          ) : null}
          {result.misuse ? (
            <p className="prose">
              And the fastest way to waste you completely is to put you somewhere{" "}
              <strong>{result.misuse}</strong>. If that describes where you are now, that is the
              thing to change — not your effort level.
            </p>
          ) : null}
        </section>
      ) : null}

      <section className="section">
        <h2 className="section-label">Four moves this week</h2>
        <ol className="moves">
          {moves.map((move) => (
            <li className="move" key={move}>
              <span>{move}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="section">
        <h2 className="section-label">Say it out loud</h2>
        <p className="pitch">&ldquo;{archetype.pitch}&rdquo;</p>
        <div>
          <button className="btn btn--accent" onClick={() => copy("pitch", archetype.pitch)}>
            {copied === "pitch" ? "Copied" : "Copy the line"}
          </button>
        </div>
      </section>

      <section className="section">
        <h2 className="section-label">How much to trust this</h2>
        <div className="confidence">
          <span className="confidence-badge">{confidence.label}</span>
          <p className="prose" style={{ margin: 0 }}>
            {confidence.note}
          </p>
        </div>
      </section>

      {onDeepen ? (
        <div className="panel panel--accent deepen">
          <h2 className="display deepen-title">There&rsquo;s more in you than four parts can find.</h2>
          <p className="prose" style={{ color: "var(--text)" }}>
            {deepCount} more questions, about three minutes. They work out the conditions your
            sauce actually needs, what quietly drains it, and — by asking two of these a
            different way — how much to trust the answer above.
          </p>
          <button className="btn btn--primary" onClick={onDeepen}>
            Go deeper
            <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : null}

      <div className="reveal-actions">
        <button className="btn btn--ghost" onClick={() => copy("link", shareUrl)}>
          {copied === "link" ? "Link copied" : "Copy your result link"}
        </button>
        <button className="btn btn--ghost" onClick={onRestart}>
          Start again
        </button>
      </div>

      <p className="footnote">
        Nothing you answered was sent anywhere. Your result lives entirely in that link —
        which means anyone you send it to can read it, so send it deliberately.
      </p>
    </div>
  );
}
