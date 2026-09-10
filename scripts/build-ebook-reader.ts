/**
 * Assembles the manuscript into a single readable HTML edition.
 *
 *   npm run build:reader
 *
 * The markdown in ebook/ is the source of truth; this is a view of it. Part
 * accents are the act hues from lib/questions.ts, so the book is tinted by the
 * same progression the test moves through.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { marked } from "marked";

const root = process.cwd();
const read = (f: string) => readFileSync(join(root, "ebook", f), "utf8");

type Part = { file: string; part: string | null; hue: number | null };

// Hues mirror the test's acts: Energy amber, Ease teal, Evidence rose,
// and the reveal's gold for the part about spending it.
const SOURCES: Part[] = [
  { file: "00-front.md", part: null, hue: null },
  { file: "01-why-you-cant-see-it.md", part: "Part One", hue: 34 },
  { file: "02-the-instrument.md", part: "Part Two", hue: 172 },
  { file: "03-the-twelve-shapes.md", part: "Part Two", hue: 172 },
  { file: "04-the-uncomfortable-parts.md", part: "Part Three", hue: 344 },
  { file: "05-spending-it.md", part: "Part Four", hue: 78 },
  { file: "A-question-bank.md", part: "Appendices", hue: null },
  { file: "B-scoring.md", part: "Appendices", hue: null },
  { file: "C-asking-three-people.md", part: "Appendices", hue: null },
  { file: "D-where-this-comes-from.md", part: "Appendices", hue: null },
];

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);

type Entry = { id: string; text: string; part: string | null; hue: number | null };
const toc: Entry[] = [];
const sections: string[] = [];

for (const src of SOURCES) {
  let md = read(src.file);
  // The cover is built below from the front matter's own words; drop the
  // title block so it isn't printed twice.
  if (src.file === "00-front.md") md = md.slice(md.indexOf("## Before you start"));

  let html = marked.parse(md, { async: false }) as string;

  html = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_m, inner: string) => {
    const plain = inner.replace(/<[^>]+>/g, "");
    const id = slug(plain);
    toc.push({ id, text: plain, part: src.part, hue: src.hue });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  html = html.replace(/<h3>([\s\S]*?)<\/h3>/g, (_m, inner: string) => {
    const plain = inner.replace(/<[^>]+>/g, "");
    return `<h3 id="${slug(plain)}">${inner}</h3>`;
  });
  html = html.replace(/<table>/g, '<div class="tw"><table>').replace(/<\/table>/g, "</table></div>");

  sections.push(
    `<section class="chunk"${src.hue !== null ? ` style="--hue:${src.hue}"` : ""}>${html}</section>`,
  );
}

// Group the contents by part, preserving order.
const groups: { part: string; hue: number | null; items: Entry[] }[] = [];
for (const e of toc) {
  const name = e.part ?? "Front";
  const last = groups[groups.length - 1];
  if (last && last.part === name) last.items.push(e);
  else groups.push({ part: name, hue: e.hue, items: [e] });
}

const nav = groups
  .map(
    (g) => `
        <div class="nav-group"${g.hue !== null ? ` style="--hue:${g.hue}"` : ""}>
          <p class="nav-part">${esc(g.part)}</p>
          <ul>
            ${g.items
              .map((i) => `<li><a href="#${i.id}" data-target="${i.id}">${esc(i.text)}</a></li>`)
              .join("\n            ")}
          </ul>
        </div>`,
  )
  .join("");

const words = SOURCES.reduce((n, s) => n + read(s.file).split(/\s+/).length, 0);

const page = `<title>Suspiciously Easy</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Literata:opsz,wght@7..72,400;7..72,600&family=Inter:wght@400;500;600&display=swap">
<style>
:root {
  --paper: #f2f1ee;
  --raised: #e9e7e2;
  --ink: #16161a;
  --muted: #5d5c58;
  --faint: #8a8883;
  --rule: #dcdad4;
  --hue: 78;
  --accent: oklch(0.46 0.11 var(--hue));
  --accent-soft: oklch(0.46 0.11 var(--hue) / 0.10);
  --display: "Fraunces", Georgia, serif;
  --body: "Literata", Georgia, serif;
  --ui: "Inter", system-ui, sans-serif;
  color-scheme: light;
}
:root:not([data-theme="light"]) { }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --paper: #09080e;
    --raised: #14131b;
    --ink: #eeebe4;
    --muted: #a6a29a;
    --faint: #736f68;
    --rule: #26242e;
    --accent: oklch(0.82 0.12 var(--hue));
    --accent-soft: oklch(0.82 0.12 var(--hue) / 0.13);
    color-scheme: dark;
  }
}
:root[data-theme="dark"] {
  --paper: #09080e;
  --raised: #14131b;
  --ink: #eeebe4;
  --muted: #a6a29a;
  --faint: #736f68;
  --rule: #26242e;
  --accent: oklch(0.82 0.12 var(--hue));
  --accent-soft: oklch(0.82 0.12 var(--hue) / 0.13);
  color-scheme: dark;
}

* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--body);
  font-size: 17px;
  line-height: 1.68;
  -webkit-font-smoothing: antialiased;
}
a { color: var(--accent); text-underline-offset: 2px; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 3px; }

.progress {
  position: fixed; inset: 0 0 auto 0; height: 2px; z-index: 40;
  background: transparent;
}
.progress span {
  display: block; height: 100%; width: 100%;
  background: var(--accent);
  transform: scaleX(0); transform-origin: left;
  transition: transform 120ms linear;
}

.shell { display: grid; grid-template-columns: 1fr; max-width: 1220px; margin: 0 auto; }
@media (min-width: 1000px) {
  .shell { grid-template-columns: 268px minmax(0, 1fr); gap: 3.5rem; }
}

/* Contents spine */
.rail { display: none; }
@media (min-width: 1000px) {
  .rail {
    display: block; position: sticky; top: 0; align-self: start;
    height: 100vh; overflow-y: auto; padding: 3.2rem 0 3rem 2rem;
    font-family: var(--ui);
  }
}
.rail-title {
  font-family: var(--display); font-size: 1.05rem; font-weight: 600;
  margin: 0 0 0.15rem;
}
.rail-sub { margin: 0 0 2rem; font-size: 0.76rem; color: var(--faint); letter-spacing: 0.02em; }
.nav-group { padding-left: 0.9rem; border-left: 2px solid var(--rule); margin-bottom: 1.5rem; }
.nav-group:has(a.is-active) { border-left-color: var(--accent); }
.nav-part {
  margin: 0 0 0.5rem; font-size: 0.65rem; letter-spacing: 0.16em;
  text-transform: uppercase; color: var(--faint);
}
.nav-group ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.34rem; }
.nav-group a {
  display: block; font-size: 0.83rem; line-height: 1.35; color: var(--muted);
  text-decoration: none; transition: color 140ms;
}
.nav-group a:hover { color: var(--ink); }
.nav-group a.is-active { color: var(--accent); font-weight: 500; }

main { padding: 0 1.4rem 6rem; min-width: 0; }
@media (min-width: 700px) { main { padding: 0 2rem 7rem; } }

/* Cover */
.cover { padding: 5rem 0 3.5rem; border-bottom: 1px solid var(--rule); margin-bottom: 3rem; }
.cover-mark {
  font-family: var(--ui); font-size: 0.68rem; letter-spacing: 0.22em;
  text-transform: uppercase; color: var(--faint); margin: 0 0 1.8rem;
}
.cover h1 {
  font-family: var(--display); font-weight: 600;
  font-size: clamp(2.6rem, 7.5vw, 4.4rem); line-height: 1.02;
  letter-spacing: -0.025em; margin: 0 0 1rem; text-wrap: balance;
}
.cover-sub {
  font-family: var(--display); font-size: clamp(1.1rem, 2.6vw, 1.45rem);
  line-height: 1.35; color: var(--muted); margin: 0 0 2rem; max-width: 30ch;
}
.cover-meta {
  display: flex; flex-wrap: wrap; gap: 1.6rem; font-family: var(--ui);
  font-size: 0.78rem; color: var(--faint);
}
.cover-meta b { display: block; color: var(--ink); font-weight: 500; font-size: 0.95rem; }

/* Spine of act hues — the same four segments the test uses for progress. */
.spine { display: flex; gap: 5px; margin: 2.4rem 0 0; }
.spine i { height: 3px; flex: 1; border-radius: 2px; background: oklch(0.6 0.14 var(--h)); opacity: 0.85; }

/* Prose */
.chunk { max-width: 66ch; }
.chunk h1 {
  font-family: var(--display); font-weight: 600; font-size: clamp(1.1rem, 2.2vw, 1.25rem);
  letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent);
  margin: 4.5rem 0 0; padding-bottom: 0.9rem; border-bottom: 2px solid var(--accent);
}
.chunk h2 {
  font-family: var(--display); font-weight: 600;
  font-size: clamp(1.7rem, 3.6vw, 2.25rem); line-height: 1.14;
  letter-spacing: -0.02em; margin: 3.4rem 0 1.2rem; text-wrap: balance;
  scroll-margin-top: 1.5rem;
}
.chunk h3 {
  font-family: var(--display); font-weight: 600; font-size: 1.22rem;
  margin: 2.4rem 0 0.7rem; line-height: 1.25; scroll-margin-top: 1.5rem;
}
.chunk p { margin: 0 0 1.15rem; }
.chunk > p:first-of-type { margin-top: 1.2rem; }
.chunk em { color: inherit; }
.chunk strong { font-weight: 600; }
.chunk hr { border: 0; height: 1px; background: var(--rule); margin: 2.8rem 0; }
.chunk ul, .chunk ol { margin: 0 0 1.3rem; padding-left: 1.3rem; display: grid; gap: 0.5rem; }
.chunk li { padding-left: 0.2rem; }
.chunk blockquote {
  margin: 1.9rem 0; padding: 0 0 0 1.6rem;
  border-left: 1px solid var(--rule);
  font-family: var(--display); font-size: 1.02rem; line-height: 1.55;
  color: var(--muted);
}
.chunk blockquote strong { color: var(--ink); }
.chunk blockquote p:last-child { margin-bottom: 0; }
.chunk code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.88em; background: var(--raised); padding: 0.1em 0.35em; border-radius: 3px;
}
.tw { overflow-x: auto; margin: 0 0 1.6rem; }
.chunk table {
  border-collapse: collapse; width: 100%; font-family: var(--ui);
  font-size: 0.86rem; font-variant-numeric: tabular-nums;
}
.chunk th, .chunk td {
  text-align: left; padding: 0.55rem 0.8rem; border-bottom: 1px solid var(--rule);
  vertical-align: top;
}
.chunk th {
  font-weight: 600; font-size: 0.7rem; letter-spacing: 0.09em;
  text-transform: uppercase; color: var(--faint);
}

.theme-toggle {
  position: fixed; right: 1rem; top: 1rem; z-index: 50;
  font-family: var(--ui); font-size: 0.72rem; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--muted);
  background: var(--raised); border: 1px solid var(--rule);
  border-radius: 999px; padding: 0.45rem 0.9rem; cursor: pointer;
}
.theme-toggle:hover { color: var(--ink); }

@media (prefers-reduced-motion: reduce) {
  * { transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
html { scroll-behavior: smooth; }
</style>

<div class="progress"><span id="bar"></span></div>
<button class="theme-toggle" id="themeToggle" type="button">Theme</button>

<div class="shell">
  <aside class="rail">
    <p class="rail-title">Suspiciously Easy</p>
    <p class="rail-sub">Draft 1 · ${(words / 1000).toFixed(0)},000 words</p>
    <nav id="toc">${nav}
    </nav>
  </aside>

  <main>
    <header class="cover">
      <p class="cover-mark">Draft 1 · A companion to the Secret Sauce test</p>
      <h1>Suspiciously Easy</h1>
      <p class="cover-sub">Finding the thing that makes you not just unique, but valuable.</p>
      <div class="cover-meta">
        <span><b>${(words / 1000).toFixed(0)},000</b> words</span>
        <span><b>16</b> chapters, 4 appendices</span>
        <span><b>24</b> questions, on paper or online</span>
      </div>
      <div class="spine" aria-hidden="true">
        <i style="--h:34"></i><i style="--h:172"></i><i style="--h:344"></i><i style="--h:78"></i>
      </div>
    </header>
${sections.join("\n")}
  </main>
</div>

<script>
(function () {
  var bar = document.getElementById('bar');
  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? window.scrollY / h : 0) + ')';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var links = Array.prototype.slice.call(document.querySelectorAll('#toc a'));
  var byId = {};
  links.forEach(function (a) { byId[a.dataset.target] = a; });
  var heads = Array.prototype.slice.call(document.querySelectorAll('main h2[id]'));
  if ('IntersectionObserver' in window) {
    var seen = new Set();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) seen.add(e.target.id); else seen.delete(e.target.id);
      });
      var first = heads.filter(function (h) { return seen.has(h.id); })[0];
      if (!first) return;
      links.forEach(function (a) { a.classList.remove('is-active'); });
      if (byId[first.id]) byId[first.id].classList.add('is-active');
    }, { rootMargin: '0px 0px -70% 0px' });
    heads.forEach(function (h) { io.observe(h); });
  }

  var root = document.documentElement;
  document.getElementById('themeToggle').addEventListener('click', function () {
    var dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var current = root.getAttribute('data-theme') || (dark ? 'dark' : 'light');
    root.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
  });
})();
</script>
`;

writeFileSync(join(root, "ebook", "reader.html"), page, "utf8");
console.log(`wrote ebook/reader.html — ${words.toLocaleString("en-GB")} words, ${toc.length} sections`);
