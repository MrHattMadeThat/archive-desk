# Writing a unit

A unit is a folder in `src/units/` with three files. Copy `acadie-1/` and change it. Register the unit in
`src/units/index.js`. Run `npm run check` until it says OK.

## sources.js

```js
export const SOURCES = {
  'ch-cider': {
    title: 'Frozen cider, melted snow, and the ice',
    look: 'old',              // 'old' (book page), 'web' (web page, shows `url` in a browser bar), 'map'
    folder: 'Book pages',     // the small kind-of-thing label above the title
    meta: {                   // the label: students read this first, and can point at any line of it
      by: '[[Samuel de Champlain]], a mapmaker who sailed with de Mons in 1604',
      when: 'Printed in [[Paris]] in [[1613]]',
      what: 'Pages 55 and 56 of his book about his voyages',
      words: 'Retold in today’s words by the Archive. Nothing added.',
    },
    body: ['Paragraph one. Split into sentences automatically.', 'Paragraph two.'],
    en: [...], fr: [...],     // optional original-language tabs
    quote: [...],             // optional: a web page's own words
    pages: [{ src: 'sources/x.webp', label: 'Page 55', marks: [[20, 55]] }],   // scans in public/sources/, gold bands
    pageFirst: true,          // open on the scan (maps)
    credit: '…', link: 'https://…',
  },
};
```

- `[[words]]` makes a **term**: dotted underline, click to keep it in the notebook. `[[big pieces of ice|ice]]` shows
  the first part and files it under the id `ice`, so two wordings can answer the same blank.
- Ids are the words in lower case with dashes: `Samuel de Champlain` → `samuel-de-champlain`.
- Mark more terms than you need. The extra ones are the decoys on the board.
- Keep sentences short (Grades 6–8). The check warns over 260 characters.
- Every fact needs a source. Note new ones in `docs/SOURCES.md`.

## shifts.js

```js
export const SHIFTS = [
  { id: 'stamp', title: 'Stamp it', letter: { from: 'The Head Archivist', text: ['…', '…'] }, tasks: [ … ] },
];
export const OUTRO = ['…'];
```

### Refs (pointing at proof)

- `'doc#some words'`: the one sentence of `doc`'s today's words that contains "some words" (any case).
- `'doc@by'` / `@when` / `@what` / `@words`: a line of the label.
- `near: { ref: 'hint' }`: lines that are close but not proof, each with its own nudge.

### Task types

| type | fields | what the student does |
|---|---|---|
| `stamp` | `doc`, `answer` (`'primary'`/`'secondary'`), `proof`, `near`, `right`, `wrong`, `consequence`, optional `question` (a research question shown above the stamps) | stamp + point at proof |
| `question` | `docs`, `ask`, `options`, `answer` (index), `proof`, `near`, `right`, optional `consequence` | pick an answer + point at proof |
| `point` | `doc`, `ask`, `proof`, `near`, `right` | find the line |
| `catalogue` | `doc`, `fields: [{ label, term }` or `{ label, choices, answer }]`, `right` | fill a card from the notebook |
| `board` | `title`, `lines` (blanks are `{term}` or `{term/other-term}`), `right` | fill blanks from the notebook; told only how many are wrong |

Grades: **gold** right first time, **silver** right after another try, **fixed** wrong first time (the student still
has to find the proof before moving on). A `consequence` arrives "in the mail" at the end of the shift when a task
was fixed.

### Card length

The right-hand card must not scroll at 1366×650. Long `ask`, `options` and `right` texts are what push it over.
After answering, a question folds down to the right answer, but `right` still has to fit: about 3 lines.
