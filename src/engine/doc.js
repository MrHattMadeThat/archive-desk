// One document on the desk: its label, today's words, and (in tabs) the original words and the page scans.
//
// renderDoc(p, opts) returns a fresh element. opts:
//   pointing   true while a task wants proof: lines light up under the mouse and can be clicked or dragged
//   selected   the key of the chosen line
//   got        Set of term ids already in the notebook
//   stamp      'primary' | 'secondary' | null, the ink on this document for the current task
//   version    which tab is open
//   onPoint(key), onTerm(id, words, el), onVersion(v)
import { el, button } from './dom.js';

const VERSIONS = {
  plain: 'Today’s words',
  en: 'English, 1878',
  fr: 'French, 1613',
  quote: 'The park’s own words',
  page: (src) => (src.pages?.length > 1 ? 'The 1613 pages' : src.look === 'map' ? 'The map' : 'The 1613 page'),
};

export function versionsOf(src) {
  const v = ['plain'];
  if (src.pages?.length && src.pageFirst) v.unshift('page');
  if (src.en) v.push('en');
  if (src.fr) v.push('fr');
  if (src.quote) v.push('quote');
  if (src.pages?.length && !src.pageFirst) v.push('page');
  return v;
}

function spanFor(span, opts, tag = 'span') {
  const s = el(tag, 'line');
  s.dataset.key = span.key;
  for (const g of span.segs) {
    if (!g.term) { s.append(g.text); continue; }
    const t = el('span', 'term', g.text);
    t.dataset.term = g.term;
    if (opts.got?.has(g.term)) t.classList.add('got');
    t.title = opts.got?.has(g.term) ? 'In your notebook' : 'Click to put it in your notebook';
    t.addEventListener('click', (e) => {
      opts.onTerm?.(g.term, g.text, t);
      if (!opts.pointing) e.stopPropagation();
    });
    s.append(t);
  }
  if (opts.pointing) {
    s.classList.add('pointable');
    s.tabIndex = 0;
    s.setAttribute('role', 'button');
    s.draggable = true;
    s.addEventListener('click', () => opts.onPoint?.(span.key));
    s.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); opts.onPoint?.(span.key); } });
    s.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/x-line', span.key); e.dataTransfer.effectAllowed = 'copy'; });
  }
  if (opts.selected === span.key) s.classList.add('chosen');
  return s;
}

export function renderDoc(p, opts = {}) {
  const src = p.src;
  const versions = versionsOf(src);
  const version = versions.includes(opts.version) ? opts.version : versions[0];
  const sheet = el('article', `sheet look-${src.look}`);
  if (opts.pointing) sheet.classList.add('pointing');

  if (src.look === 'web') {
    const bar = el('div', 'browserbar');
    bar.append(el('span', 'dots', '● ● ●'), el('span', 'url', src.url || ''));
    sheet.append(bar);
  }

  const head = el('header', 'sheet-head');
  head.append(el('div', 'folder', src.folder || ''), el('h2', 'sheet-title', src.title));
  sheet.append(head);

  const label = el('dl', 'label');
  for (const m of p.meta) {
    const row = el('div', 'label-row');
    row.append(el('dt', null, m.label));
    const dd = el('dd');
    dd.append(spanFor(m, opts));
    row.append(dd);
    label.append(row);
  }
  sheet.append(label);

  if (versions.length > 1) {
    const tabs = el('div', 'tabs');
    tabs.setAttribute('role', 'tablist');
    for (const v of versions) {
      const name = typeof VERSIONS[v] === 'function' ? VERSIONS[v](src) : VERSIONS[v];
      const b = button(`tab${v === version ? ' on' : ''}`, name);
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', v === version);
      b.onclick = () => opts.onVersion?.(v);
      tabs.append(b);
    }
    sheet.append(tabs);
  }

  const body = el('div', `body v-${version}`);
  if (version === 'plain') {
    for (const para of p.paras) {
      const pe = el('p');
      para.forEach((s, i) => { if (i) pe.append(' '); pe.append(spanFor(s, opts)); });
      body.append(pe);
    }
  } else if (version === 'page') {
    for (const pg of src.pages) {
      const fig = el('figure', 'scan');
      const wrap = el('div', 'scan-wrap');
      const img = el('img');
      img.src = pg.src;
      img.alt = `${src.title}: ${pg.label}`;
      img.loading = 'lazy';
      wrap.append(img);
      for (const [a, b] of pg.marks || []) {
        const band = el('div', 'band');
        band.style.top = `${a}%`;
        band.style.height = `${b - a}%`;
        wrap.append(band);
      }
      fig.append(wrap, el('figcaption', null, pg.label + (pg.marks?.length ? ' · the gold bands mark the passage' : '')));
      body.append(fig);
    }
  } else {
    for (const par of src[version]) body.append(el('p', 'orig', par));
  }
  if (version !== 'plain' && opts.pointing) body.prepend(el('p', 'tabnote', 'You can point at the label above. To point at the text, switch to Today’s words.'));
  sheet.append(body);

  const foot = el('footer', 'credit');
  foot.append(src.credit || '');
  if (src.link) {
    foot.append(' ');
    const a = el('a', null, 'Open the original');
    a.href = src.link;
    a.target = '_blank';
    a.rel = 'noopener';
    foot.append(a);
  }
  sheet.append(foot);

  if (opts.stamp) {
    const ink = el('div', `ink ink-${opts.stamp}`, opts.stamp === 'primary' ? 'PRIMARY' : 'SECONDARY');
    if (opts.stampFresh) ink.classList.add('fresh');
    sheet.append(ink);
  }
  return sheet;
}
