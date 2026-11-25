// Turns a unit's sources into things the desk can show and point at. Pure functions: scripts/check.mjs uses them too.
//
// Markup in a source's text:
//   [[words]]          a term: dotted underline, click to put it in the notebook. Its id is the words in lower case.
//   [[words|id]]       a term shown as `words` but filed under `id` (so "big pieces of ice" and "Ice" can both be `ice`).
// Paragraphs are split into sentences; each sentence (and each line of the source's label) is something a student can
// point at as proof.
//
// A task names a sentence with a REF:
//   'doc#some words'   the one sentence of `doc`'s today's-words text that contains "some words" (case-insensitive)
//   'doc@by'           one line of the source's label (by, when, what, words)

const ABBR = ['U.S.', 'St.', 'Dr.', 'Mme.', 'Mr.', 'Ms.', 'Mrs.'];
const TERM = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

export const META = [
  ['by', 'Made by'],
  ['when', 'Made'],
  ['what', 'What it is'],
  ['words', 'Words'],
];

export const termId = (s) => s.trim().toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9à-ÿ]+/g, '-').replace(/^-|-$/g, '');
export const plain = (s) => s.replace(TERM, '$1');

export function sentences(par) {
  let s = par;
  ABBR.forEach((a, i) => { s = s.split(a).join(`\u0000${i}\u0000`); });
  return s.split(/(?<=[.!?”])\s+(?=[[“"‘(A-Z0-9À-Ý])/).map((p) => p.replace(/\u0000(\d+)\u0000/g, (_, i) => ABBR[+i]));
}

export function segments(s) {
  const out = [];
  let last = 0, m;
  TERM.lastIndex = 0;
  while ((m = TERM.exec(s))) {
    if (m.index > last) out.push({ text: s.slice(last, m.index) });
    out.push({ text: m[1], term: termId(m[2] || m[1]) });
    last = TERM.lastIndex;
  }
  if (last < s.length) out.push({ text: s.slice(last) });
  return out;
}

// One source, ready to draw: label lines and today's-words sentences, each with a key the desk can point at.
export function prepare(id, src) {
  const meta = META.filter(([k]) => src.meta?.[k]).map(([k, label]) => {
    const s = src.meta[k];
    return { k, label, key: `${id}@${k}`, segs: segments(s), text: plain(s) };
  });
  const paras = (src.body || []).map((par, pi) => sentences(par).map((s, si) => ({
    key: `${id}:${pi}.${si}`, segs: segments(s), text: plain(s),
  })));
  return { id, src, meta, paras };
}

export function prepareUnit(unit) {
  const out = {};
  for (const [id, src] of Object.entries(unit.sources)) out[id] = prepare(id, src);
  return out;
}

// Every span key a ref matches (the check script insists on exactly one).
export function matches(docs, ref) {
  const at = ref.indexOf('@'), hash = ref.indexOf('#');
  if (at > 0 && (hash < 0 || at < hash)) {
    const d = docs[ref.slice(0, at)];
    const m = d?.meta.find((x) => x.k === ref.slice(at + 1));
    return m ? [m.key] : [];
  }
  if (hash > 0) {
    const d = docs[ref.slice(0, hash)];
    if (!d) return [];
    const want = ref.slice(hash + 1).toLowerCase();
    return d.paras.flat().filter((s) => s.text.toLowerCase().includes(want)).map((s) => s.key);
  }
  return [];
}

export const resolve = (docs, ref) => matches(docs, ref)[0] || null;

// Where a key lives: { doc, text }.
export function lookup(docs, key) {
  const id = key.split(/[@:]/)[0];
  const d = docs[id];
  if (!d) return null;
  const span = d.meta.find((m) => m.key === key) || d.paras.flat().find((s) => s.key === key);
  return span ? { doc: d, text: span.text, meta: d.meta.includes(span) ? span : null } : null;
}

// Every term in the unit: id -> the words first used for it.
export function allTerms(docs) {
  const out = new Map();
  for (const d of Object.values(docs)) {
    for (const span of [...d.meta, ...d.paras.flat()]) {
      for (const g of span.segs) if (g.term && !out.has(g.term)) out.set(g.term, g.text);
    }
  }
  return out;
}

// A board line: 'Of the {79} men' -> [{text}, {blank: '79'}, {text}]. A blank may list more than one right term: {ice/pieces-of-ice}.
export function boardLine(s) {
  const out = [];
  let last = 0, m;
  const re = /\{([^}]+)\}/g;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push({ text: s.slice(last, m.index) });
    out.push({ blank: m[1].split('/').map(termId) });
    last = re.lastIndex;
  }
  if (last < s.length) out.push({ text: s.slice(last) });
  return out;
}
