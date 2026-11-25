# The Archive Desk: handoff

A primary and secondary sources game for Grades 6–8 (NB). Started 2026-11-25. Vite + vanilla JS, no framework, same
fonts as `../acadie`. Inspired by *Papers, Please* (a desk, documents arrive, stamp them, mistakes come back in the
mail) and *The Case of the Golden Idol* (collect words by clicking them, fill a deduction board, "two or fewer are
wrong").

## The one rule

**No answer without proof.** Every stamp and every multiple-choice answer needs the student to point at a line (a
sentence, or a line of the document's label) that proves it. Right answer + wrong line = try again. This is what
stops guessing, and it is the thing to protect when adding task types.

## What the teacher wants

- A **foundation** that later units plug into: Grade 8 Acadia now, British North America next (Dec 2026), Grade 7
  Culture after Christmas (the dawn of humanity / civilization: mostly objects and images, not text).
- Deeper than sorting. The big idea (shift 4): **primary or secondary depends on the question you ask.**
- Same rule as Acadie: **if it can't be proven, it goes.** Real sources only, credited. Don't add facts from memory.

## How it fits together

- `src/engine/` knows nothing about Acadia:
  - `text.js`: parses sources (`[[term]]` markup, sentence split, refs like `doc#words` and `doc@by`). Pure, so
    `scripts/check.mjs` uses it too.
  - `doc.js`: draws one document (label, tabs: today's words / 1878 English / 1613 French / park's own words / page
    scans with gold bands).
  - `tasks.js`: the five task types: `stamp`, `question` (MC + proof), `point`, `catalogue`, `board`.
  - `game.js`: the desk (layout, notebook, letters, end-of-shift report with "the mail", save in localStorage).
- `src/units/<id>/`: a unit is `sources.js` + `shifts.js` + `index.js`, registered in `src/units/index.js`. How to
  write one: `docs/UNITS.md`.
- `npm run check` validates every ref (exactly one line each), term, answer and image. Run it after any content edit.

## Acadie 1 (the first unit)

Sources are Acadie's fact-checked passages (`../acadie/src/sources.js`, checked 2026-11-19), with the plain
retellings as "today's words". Page scans copied from `../acadie/public/sources/`. Five shifts, 18 tasks: stamp (6),
catalogue cards (3), a museum designer's four questions, the twist (same NPS page, two questions; the primary source
hiding in a Parks Canada page; is a retelling still primary?), and the case board.

## Testing

- No automated UI test. Verify in the browser at 1366×650 (lab PCs) and say so. **The right-hand card must not
  scroll**, before or after answering, including after a wrong first answer. A loop over every task with
  `desk.solve()` and `.right` scrollHeight vs clientHeight does it.
- Preview: `archive-desk` in `REPOS/.claude/launch.json` (port 5671). `?unit=acadie-1&shift=3&task=2` jumps in.
- Console: `desk.solve()`, `desk.next()`, `desk.jump(shift, task)` (1-based; clears later results),
  `desk.collectAll()` (every term into the notebook), `desk.state`.
- The browser pane's screenshots crop at 1366 wide; after a page reload they show the whole scaled viewport.

## Open items

- Git: public repo MrHattMadeThat/archive-desk; LIVE at https://mrhattmadethat.github.io/archive-desk/. Pushing to
  `main` deploys through GitHub Pages (`.github/workflows/deploy.yml` runs `npm run check` first). Commits use the
  GitHub no-reply identity in the repo's local config, like `../acadie`. Stage files by name, never `git add -A`.
  Ask before pushing.
- No teacher view yet (class results). Ideas in `docs/DESIGN.md`.
- Planned task types: `compare` (two accounts disagree, pin the claims), `anachronism` (spot what can't be in a
  "1605" document; invented documents must be labelled as invented once caught), image hotspots (Grade 7 objects).
