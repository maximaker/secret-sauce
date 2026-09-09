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

export function Reveal({
  result,
  shareUrl,
  onRestart,
}: {
  result: Result;
  shareUrl: string;
  onRestart: () => void;
}) {
  const { copied, copy } = useCopy();
  const { archetype, runnerUp, readings, sauceSentence, moves } = result;
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
          {result.confidence < 0.35
            ? "You sit genuinely between the two, which is its own kind of rare."
            : "Worth knowing as the direction you lean when the first one isn't needed."}
        </p>
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

      <section className="section">
        <h2 className="section-label">The cost of it</h2>
        <p className="prose">{archetype.shadow}</p>
      </section>

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
          <button
            className="btn btn--accent"
            onClick={() => copy("pitch", archetype.pitch)}
          >
            {copied === "pitch" ? "Copied" : "Copy the line"}
          </button>
        </div>
      </section>

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
