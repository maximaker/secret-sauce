# Suspiciously Easy — manuscript

Draft 1 of the ebook companion to the Secret Sauce test. ~17,000 words.

## Files, in reading order

| File | What it is | Written or generated |
|---|---|---|
| `00-front.md` | Title, how to use the book, contents | Written |
| `01-why-you-cant-see-it.md` | Part One, ch. 1–5 — the argument | Written |
| `02-the-instrument.md` | Part Two, ch. 6–7 — four E's, eight signals | Written |
| `03-the-twelve-shapes.md` | Ch. 8 — the catalogue | **Generated** |
| `04-the-uncomfortable-parts.md` | Part Three, ch. 9–12 | Written |
| `05-spending-it.md` | Part Four, ch. 13–16 | Written |
| `A-question-bank.md` | Every question, with weights | **Generated** |
| `B-scoring.md` | Scoring by hand | **Generated** |
| `C-asking-three-people.md` | The 360 version | Written |
| `D-where-this-comes-from.md` | Sources, and what not to trust | Written |

## Why three chapters are generated

The catalogue and the two reference appendices restate what `lib/` already
contains. Typed out by hand they would drift the first time a question was
reworded, and a book that disagrees with the test it documents is worse than no
book at all. They are built from the app's own source instead:

```bash
npm run build:ebook    # regenerates ch. 8, appendix A, appendix B
```

Run it after any change to the question bank, the option vectors, the archetype
definitions, or the rarity table. **Don't edit those three files directly** —
edits are overwritten. Change `lib/` or `scripts/build-ebook.ts`.

## The readable edition

```bash
npm run build:reader   # assembles ebook/reader.html from the markdown
```

Single-page HTML with a contents spine, tinted per part using the same act hues
the test moves through. Body text is set in Literata; display in Fraunces, to
match the product. `reader.html` is generated and gitignored.

## Draft status

This is a first draft. Known gaps and open questions:

- **Chapter 1's Forer material** is recounted from memory of a well-known study
  and should be checked against the 1949 paper before publication.
- **No worked example.** A single anonymised walkthrough — someone's answers,
  their result, what they did about it — would earn its place, probably after
  Chapter 8. It needs a real person.
- **Chapter 16 asserts a six-to-eighteen-month shelf life.** That number is
  reasoned, not measured. Either soften it or gather retest data.
- **Part Three is the strongest section and Part Two the weakest** — Part Two
  is doing structural work between two livelier neighbours and could take a
  sharper opening.
- **No cover, no ISBN, no EPUB build.** If it goes further than a PDF, add a
  pandoc target alongside the reader.
