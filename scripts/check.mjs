// npm run check: every unit's refs, terms, answers and images. Exits 1 on any error.
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { UNITS } from '../src/units/index.js';
import { prepareUnit, matches, allTerms, boardLine } from '../src/engine/text.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let errors = 0, warnings = 0;
const err = (where, msg) => { errors++; console.log(`  ✗ ${where}: ${msg}`); };
const warn = (where, msg) => { warnings++; console.log(`  ! ${where}: ${msg}`); };

const TYPES = ['stamp', 'question', 'point', 'catalogue', 'board'];

for (const unit of UNITS) {
  console.log(`${unit.id}: ${unit.title}`);
  const docs = prepareUnit(unit);
  const terms = allTerms(docs);

  for (const [id, d] of Object.entries(docs)) {
    const s = d.src;
    if (!s.title) err(id, 'no title');
    if (!['old', 'web', 'map'].includes(s.look)) err(id, `look "${s.look}"`);
    for (const k of ['by', 'when', 'what']) if (!s.meta?.[k]) err(id, `no meta.${k}`);
    if (!s.credit) err(id, 'no credit line');
    for (const p of s.pages || []) if (!existsSync(join(root, 'public', p.src))) err(id, `missing image ${p.src}`);
    for (const sent of d.paras.flat()) {
      if (sent.text.length > 260) warn(id, `long sentence (${sent.text.length}): "${sent.text.slice(0, 50)}…"`);
      if (/\[\[|\]\]/.test(sent.segs.map((g) => g.text).join(''))) err(id, `broken [[term]] in "${sent.text.slice(0, 40)}"`);
    }
  }

  const one = (where, ref, allowed) => {
    const m = matches(docs, ref);
    if (m.length !== 1) return err(where, `ref "${ref}" matches ${m.length} lines`);
    const doc = ref.split(/[@#]/)[0];
    if (allowed && !allowed.includes(doc)) err(where, `ref "${ref}" is not on the desk for this task (${allowed.join(', ')})`);
  };

  unit.shifts.forEach((shift, si) => {
    if (!shift.letter?.text?.length) err(shift.id, 'no letter');
    shift.tasks.forEach((t, ti) => {
      const where = `${shift.id}[${ti}] ${t.type}`;
      if (!TYPES.includes(t.type)) return err(where, 'unknown type');
      const onDesk = t.type === 'board' ? Object.keys(docs) : (t.docs || [t.doc]);
      for (const d of onDesk) if (!docs[d]) err(where, `no source "${d}"`);
      if (['stamp', 'question', 'point'].includes(t.type)) {
        if (!t.proof?.length) err(where, 'no proof refs');
        for (const r of t.proof || []) one(where, r, onDesk);
        for (const r of Object.keys(t.near || {})) {
          one(where, r, onDesk);
          const a = matches(docs, r)[0];
          if ((t.proof || []).some((p) => matches(docs, p)[0] === a)) err(where, `near ref "${r}" is also proof`);
        }
        if (!t.right) err(where, 'no right text');
      }
      if (t.type === 'stamp') {
        if (!['primary', 'secondary'].includes(t.answer)) err(where, `answer "${t.answer}"`);
        if (!t.wrong) err(where, 'no wrong text');
        if (!t.consequence) warn(where, 'no consequence');
      }
      if (t.type === 'question') {
        if (!t.options?.[t.answer]) err(where, 'answer is not an option');
        if (!t.ask) err(where, 'no ask');
      }
      if (t.type === 'catalogue') {
        for (const f of t.fields) {
          if (f.term) {
            if (!terms.has(f.term)) err(where, `"${f.label}" wants term "${f.term}", which no source has`);
            else if (![...docs[t.doc].meta, ...docs[t.doc].paras.flat()].some((s) => s.segs.some((g) => g.term === f.term))) {
              warn(where, `term "${f.term}" is not in ${t.doc} itself`);
            }
          } else if (!f.choices?.[f.answer]) err(where, `"${f.label}" answer is not a choice`);
        }
      }
      if (t.type === 'board') {
        let blanks = 0;
        for (const line of t.lines) for (const g of boardLine(line)) if (g.blank) {
          blanks++;
          for (const id of g.blank) if (!terms.has(id)) err(where, `blank {${id}} is no source's term`);
        }
        if (blanks < 3) warn(where, `only ${blanks} blanks`);
      }
    });
  });

  // terms the unit never asks for are fine (they are the decoys); report the count
  console.log(`  ${Object.keys(docs).length} sources, ${terms.size} terms, ${unit.shifts.reduce((n, s) => n + s.tasks.length, 0)} tasks in ${unit.shifts.length} shifts`);
}

console.log(errors ? `\n${errors} error(s), ${warnings} warning(s)` : `\nOK${warnings ? ` (${warnings} warning(s))` : ''}`);
process.exit(errors ? 1 : 0);
