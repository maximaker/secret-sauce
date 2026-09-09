"use client";

export function Landing({ onBegin, hasSaved }: { onBegin: () => void; hasSaved: boolean }) {
  return (
    <div className="canvas hero enter">
      <span className="eyebrow">
        Sixteen questions · No signup
      </span>

      <h1 className="display hero-title">
        Everyone has a secret sauce.
        <br />
        Most people can&rsquo;t name theirs.
      </h1>

      <p className="lede">
        It isn&rsquo;t a skill on a list. It&rsquo;s the thing so easy for you that you assume
        it&rsquo;s easy for everyone — which is exactly why you can&rsquo;t see it, and exactly
        why it&rsquo;s worth something. Five minutes, whether you&rsquo;re fifteen or
        fifty-five, and you leave with a sentence you can say out loud.
      </p>

      <div className="hero-actions">
        <button className="btn btn--primary" onClick={onBegin} autoFocus>
          {hasSaved ? "Pick up where you left off" : "Begin"}
          <span aria-hidden="true">→</span>
        </button>
        <span className="keyhint">
          or press <kbd>Enter</kbd>
        </span>
      </div>

      <div className="facts">
        <div className="fact">
          <span className="fact-value">~5 min</span>
          <span className="fact-label">Start to finish</span>
        </div>
        <div className="fact">
          <span className="fact-value">17 taps</span>
          <span className="fact-label">Plus a deeper round if you want it</span>
        </div>
        <div className="fact">
          <span className="fact-value">Nothing sent</span>
          <span className="fact-label">It all runs in your browser</span>
        </div>
      </div>
    </div>
  );
}
