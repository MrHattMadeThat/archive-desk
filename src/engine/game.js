// The desk: runs one unit, shift by shift, task by task, and keeps the student's place in localStorage.
//
//   ┌ top bar: unit · shift · one pip per task · The rule · The letter ┐
//   │ left: on your desk / filed │ centre: the open document │ right: the task card │
//   └ notebook: the words the student has collected ┘
//
// Console: desk.solve() answers the current task correctly, desk.next() moves on, desk.jump(shift, task) (1-based).
import { el, button } from './dom.js';
import { renderDoc } from './doc.js';
import { TASKS } from './tasks.js';
import { prepareUnit, matches, lookup, allTerms } from './text.js';

const SAVE = (id) => `archive-desk:${id}`;
const GRADE_NAME = { gold: 'Gold seal', silver: 'Silver seal', red: 'Fixed' };

export const RULE = {
  title: 'The rule',
  rows: [
    ['PRIMARY', 'Made by someone who was there, or made at the time.', 'Letters, diaries, eyewitness books, maps, photos, objects, official records.'],
    ['SECONDARY', 'Made later, by someone who was not there, using other sources.', 'Textbooks, encyclopedias, most web pages and videos about the past.'],
  ],
  ask: ['Who made it? Were they there?', 'When was it made?'],
  remember: 'Primary does not mean true. Secondary does not mean false.',
};

export function loadSave(unit) {
  try { return JSON.parse(localStorage.getItem(SAVE(unit.id))); } catch { return null; }
}

export function clearSave(unit) {
  try { localStorage.removeItem(SAVE(unit.id)); } catch { /* private mode */ }
}

export function startGame(root, unit, { onExit, jump } = {}) {
  const docs = prepareUnit(unit);
  const termWords = allTerms(docs);
  let st = loadSave(unit) || { v: 1, shift: 0, task: 0, results: {}, notebook: [], letterSeen: {} };
  if (jump) { st.shift = jump[0]; st.task = jump[1] || 0; }

  let task = null, shown = null, sel = null, panelOpen = true;
  const versions = {};
  const keyOf = (s, t) => `${s}.${t}`;
  const save = () => { try { localStorage.setItem(SAVE(unit.id), JSON.stringify(st)); } catch { /* private mode */ } };

  // ------------------------------------------------------------------ layout
  root.replaceChildren();
  const game = el('div', 'game');
  const top = el('header', 'top');
  const brand = button('brand', 'The Archive Desk');
  brand.title = 'Back to the title screen (your place is saved)';
  brand.onclick = () => onExit?.();
  const where = el('div', 'where');
  const pips = el('div', 'pips');
  const ruleBtn = button('topbtn', 'The rule');
  ruleBtn.onclick = showRule;
  const letterBtn = button('topbtn', 'The letter');
  letterBtn.onclick = () => showLetter(false);
  top.append(brand, where, pips, ruleBtn, letterBtn);

  const desk = el('div', 'desk');
  const left = el('aside', 'left');
  const centre = el('main', 'centre');
  const right = el('aside', 'right');
  desk.append(left, centre, right);

  const nb = el('footer', 'notebook');
  const nbLabel = el('div', 'nb-label');
  const chips = el('div', 'chips');
  nb.append(nbLabel, chips);
  // a mouse wheel scrolls the one-row notebook sideways
  chips.addEventListener('wheel', (e) => {
    if (game.classList.contains('wide-notebook') || !e.deltaY) return;
    chips.scrollLeft += e.deltaY;
    e.preventDefault();
  }, { passive: false });

  const modal = el('div', 'modal-back');
  modal.hidden = true;
  game.append(top, desk, nb, modal);
  root.append(game);

  // ------------------------------------------------------------------ the notebook
  const notebook = {
    has: (id) => st.notebook.some(([k]) => k === id),
    label: (id) => st.notebook.find(([k]) => k === id)?.[1] || termWords.get(id) || id,
  };

  function collect(id, words, from) {
    if (notebook.has(id)) return;
    st.notebook.push([id, words]);
    save();
    toast(`+ ${words}`, from);
    renderNotebook(id);
    renderCentre();
  }

  function renderNotebook(fresh) {
    nbLabel.replaceChildren(el('span', null, 'Notebook'), el('b', null, String(st.notebook.length)));
    chips.replaceChildren();
    const wants = task?.wantsChip?.();
    chips.classList.toggle('wanted', !!wants);
    if (!st.notebook.length) chips.append(el('span', 'nb-empty', 'Words with a dotted line go here. Click one in a document.'));
    // A to Z, so a word is easy to find when the notebook is full
    const sorted = [...st.notebook].sort((a, b) => a[1].localeCompare(b[1], 'en', { numeric: true, sensitivity: 'base' }));
    for (const [id, words] of sorted) {
      const c = button(`chip${id === fresh ? ' fresh' : ''}`, words);
      c.draggable = true;
      c.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/x-term', id); e.dataTransfer.effectAllowed = 'copy'; });
      c.onclick = () => {
        if (task?.wantsChip?.()) task.chip(id);
        else toast(task?.chip ? 'Click a box first, then a word.' : 'You’ll use your notebook later.', c);
      };
      chips.append(c);
    }
    if (fresh) chips.querySelector('.fresh')?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
  }

  function toast(text, from) {
    const t = el('div', 'toast', text);
    game.append(t);
    const r = (from || nb).getBoundingClientRect();
    t.style.left = `${Math.min(window.innerWidth - 220, Math.max(8, r.left))}px`;
    t.style.top = `${Math.max(8, r.top - 34)}px`;
    setTimeout(() => t.remove(), 1400);
  }

  // ------------------------------------------------------------------ context for the tasks
  const ctx = {
    docs,
    notebook,
    get sel() { return sel; },
    setSel(key, silent) { sel = key; if (key) { const id = lookup(docs, key)?.doc.id; if (id) shown = id; } if (!silent) refresh(); },
    resolve: (ref) => matches(docs, ref)[0] || null,
    hits: (key, refs) => !!key && refs.some((r) => matches(docs, r).includes(key)),
    nearHint(key, near) {
      for (const [ref, hint] of Object.entries(near || {})) if (matches(docs, ref).includes(key)) return hint;
      return null;
    },
    quote: (key) => lookup(docs, key),
    finish(result) {
      st.results[keyOf(st.shift, st.task)] = result;
      save();
      refresh();
      right.scrollTop = right.scrollHeight;
      right.querySelector('.next')?.focus({ preventScroll: true });
    },
    refresh: () => refresh(),
  };

  // ------------------------------------------------------------------ render
  const shift = () => unit.shifts[st.shift];
  const result = (s = st.shift, t = st.task) => st.results[keyOf(s, t)];

  function filedDocs() {
    const seen = [];
    unit.shifts.forEach((sh, si) => sh.tasks.forEach((t, ti) => {
      if (si > st.shift || (si === st.shift && ti >= st.task)) return;
      for (const d of t.docs || (t.doc ? [t.doc] : [])) if (!seen.includes(d)) seen.push(d);
    }));
    return seen.filter((d) => !task.docs.includes(d));
  }

  function renderTop() {
    const sh = shift();
    where.replaceChildren(el('span', 'unit', unit.title), el('span', 'shift', `Shift ${st.shift + 1} of ${unit.shifts.length} · ${sh.title}`));
    pips.replaceChildren();
    sh.tasks.forEach((_, i) => {
      const r = result(st.shift, i);
      const p = el('span', `pip${r ? ` ${r.grade}` : ''}${i === st.task ? ' now' : ''}`);
      p.title = r ? GRADE_NAME[r.grade] : i === st.task ? 'Now' : 'To do';
      pips.append(p);
    });
  }

  function docButton(id, list) {
    const d = docs[id];
    const b = button(`docbtn look-${d.src.look}${shown === id && !(task.centre && panelOpen) ? ' on' : ''}`);
    b.append(el('span', 'docbtn-title', d.src.title), el('span', 'docbtn-sub', d.src.meta.by.replace(/\[\[|\]\]/g, '').split(',')[0]));
    b.onclick = () => { shown = id; panelOpen = false; refresh(); centre.scrollTop = 0; };
    list.append(b);
  }

  function renderLeft() {
    left.replaceChildren();
    if (task.centre) {
      const b = button(`docbtn panelbtn${panelOpen ? ' on' : ''}`);
      b.append(el('span', 'docbtn-title', 'The panel'), el('span', 'docbtn-sub', 'What you are filling in'));
      b.onclick = () => { panelOpen = true; refresh(); };
      left.append(b);
    }
    if (task.docs.length) {
      left.append(el('h3', null, 'On your desk'));
      const list = el('div', 'doclist');
      task.docs.forEach((id) => docButton(id, list));
      left.append(list);
    }
    const filed = filedDocs();
    if (filed.length) {
      left.append(el('h3', null, task.centre ? 'Filed documents' : 'Filed'));
      const list = el('div', 'doclist filed');
      filed.forEach((id) => docButton(id, list));
      left.append(list);
    }
  }

  function renderCentre() {
    const keep = centre.scrollTop;
    const sameDoc = centre.dataset.doc === (task.centre && panelOpen ? '#panel' : shown);
    centre.replaceChildren();
    if (task.centre && panelOpen) {
      centre.dataset.doc = '#panel';
      centre.append(task.centre());
    } else if (shown) {
      centre.dataset.doc = shown;
      const onDesk = task.docs.includes(shown);
      centre.append(renderDoc(docs[shown], {
        version: versions[shown],
        pointing: onDesk && task.pointing,
        selected: sel,
        got: new Set(st.notebook.map(([k]) => k)),
        stamp: onDesk && task.stamp ? task.stamp() : null,
        stampFresh: onDesk && task.stampFresh ? task.stampFresh() : false,
        onPoint: (key) => ctx.setSel(key),
        onTerm: (id, words, from) => collect(id, words, from),
        onVersion: (v) => { versions[shown] = v; renderCentre(); },
      }));
      if (task.centre) {
        const back = button('backpanel', '← Back to the panel');
        back.onclick = () => { panelOpen = true; refresh(); };
        centre.prepend(back);
      }
    }
    if (sameDoc) centre.scrollTop = keep;
  }

  function renderRight() {
    right.replaceChildren();
    const card = task.card();
    right.append(card);
    const r = result();
    if (r) {
      const seal = el('div', `seal ${r.grade}`);
      seal.append(el('span', 'seal-dot'), el('span', null, GRADE_NAME[r.grade]));
      card.prepend(seal);
      const last = st.task === shift().tasks.length - 1;
      const next = button('go next', last ? 'End of shift →' : 'Next →');
      next.onclick = advance;
      card.append(next);
    }
  }

  function refresh() {
    renderTop();
    renderLeft();
    renderCentre();
    renderRight();
    renderNotebook();
  }

  // ------------------------------------------------------------------ flow
  function begin() {
    while (st.shift < unit.shifts.length && result()) {
      if (st.task < shift().tasks.length - 1) st.task++;
      else { st.shift++; st.task = 0; }
    }
    if (st.shift >= unit.shifts.length) return showEnd();
    const t = shift().tasks[st.task];
    task = TASKS[t.type](t, ctx);
    sel = null;
    panelOpen = true;
    game.classList.toggle('wide-notebook', !!task.centre);
    if (task.docs.length) shown = task.docs[0];
    else if (!task.centre) shown = null;
    save();
    refresh();
    centre.scrollTop = 0;
    if (!st.letterSeen[st.shift]) showLetter(true);
  }

  function advance() {
    if (st.task < shift().tasks.length - 1) { st.task++; return begin(); }
    showReport();
  }

  // ------------------------------------------------------------------ modals
  function openModal(node, cls = '') {
    modal.replaceChildren(node);
    node.classList.add('modal');
    if (cls) node.classList.add(cls);
    modal.hidden = false;
    node.querySelector('.go')?.focus({ preventScroll: true });
  }
  const closeModal = () => { modal.hidden = true; modal.replaceChildren(); };
  modal.addEventListener('pointerdown', (e) => { if (e.target === modal && modal.dataset.soft) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden && modal.dataset.soft) closeModal(); });

  function showLetter(first) {
    const sh = shift();
    const box = el('section', 'letter');
    box.append(el('div', 'letter-kicker', `Shift ${st.shift + 1} · ${sh.title}`));
    for (const p of sh.letter.text) box.append(el('p', null, p));
    box.append(el('p', 'sign', `— ${sh.letter.from}`));
    if (first && st.shift === 0) box.append(ruleCard());
    const ok = button('go', first ? 'To work' : 'Close');
    ok.onclick = () => { st.letterSeen[st.shift] = true; save(); closeModal(); };
    box.append(ok);
    modal.dataset.soft = first ? '' : '1';
    openModal(box);
  }

  function ruleCard() {
    const r = el('div', 'rule');
    for (const [name, what, eg] of RULE.rows) {
      const row = el('div', `rule-row rule-${name.toLowerCase()}`);
      row.append(el('div', 'rule-name', name), el('div', 'rule-what', what), el('div', 'rule-eg', eg));
      r.append(row);
    }
    const ask = el('div', 'rule-ask');
    ask.append(el('b', null, 'Ask: '), RULE.ask.join(' '));
    r.append(ask, el('div', 'rule-remember', RULE.remember));
    return r;
  }

  function showRule() {
    const box = el('section', 'rulebox');
    box.append(el('h2', null, RULE.title), ruleCard());
    const ok = button('go', 'Close');
    ok.onclick = closeModal;
    box.append(ok);
    modal.dataset.soft = '1';
    openModal(box);
  }

  function taskName(t) {
    if (t.type === 'stamp') return (t.question ? `${docs[t.doc].src.title} (for: ${t.question})` : docs[t.doc].src.title);
    if (t.type === 'catalogue') return `Card: ${docs[t.doc].src.title}`;
    if (t.type === 'board') return t.title;
    return t.ask;
  }

  function showReport() {
    const sh = shift();
    const box = el('section', 'report');
    box.append(el('div', 'letter-kicker', `End of shift ${st.shift + 1}`), el('h2', null, sh.title));
    const list = el('ol', 'report-list');
    sh.tasks.forEach((t, i) => {
      const r = result(st.shift, i) || { grade: 'red' };
      const li = el('li', `report-row ${r.grade}`);
      li.append(el('span', 'seal-dot'), el('span', 'report-name', taskName(t)), el('span', 'report-grade', GRADE_NAME[r.grade]));
      list.append(li);
    });
    box.append(list);
    const mail = sh.tasks.map((_, i) => result(st.shift, i)?.consequence).filter(Boolean);
    if (mail.length) {
      const m = el('div', 'mail');
      m.append(el('h3', null, 'In the mail this week'));
      for (const c of mail) m.append(el('p', 'slip', c));
      box.append(m);
    } else if (sh.tasks.some((t) => t.consequence)) {
      box.append(el('p', 'nomail', 'No complaints in the mail. The Archive is proud of you.'));
    }
    const last = st.shift === unit.shifts.length - 1;
    const ok = button('go', last ? 'Finish' : 'Next shift →');
    ok.onclick = () => { closeModal(); st.shift++; st.task = 0; begin(); };
    box.append(ok);
    modal.dataset.soft = '';
    openModal(box, 'wide');
  }

  function showEnd() {
    st.done = true;
    save();
    const all = Object.values(st.results);
    const count = (g) => all.filter((r) => r.grade === g).length;
    const box = el('section', 'report end');
    box.append(el('div', 'letter-kicker', unit.course), el('h2', null, `${unit.title}: done`));
    const seals = el('div', 'seals');
    for (const g of ['gold', 'silver', 'red']) {
      const s = el('div', `bigseal ${g}`);
      s.append(el('b', null, String(count(g))), el('span', null, GRADE_NAME[g]));
      seals.append(s);
    }
    box.append(seals);
    for (const p of unit.outro || []) box.append(el('p', null, p));
    box.append(el('p', 'small', `Notebook: ${st.notebook.length} words collected.`));
    const ok = button('go', 'Back to the title');
    ok.onclick = () => { closeModal(); onExit?.(); };
    box.append(ok);
    modal.dataset.soft = '';
    openModal(box, 'wide');
  }

  // ------------------------------------------------------------------ console
  window.desk = {
    get state() { return st; },
    get task() { return task; },
    solve() { closeModal(); task.solve(); },
    next() { closeModal(); if (result()) advance(); },
    jump(s, t = 1) { closeModal(); st.shift = s - 1; st.task = t - 1; for (const k of Object.keys(st.results)) { const [a, b] = k.split('.').map(Number); if (a > st.shift - 1 && (a > st.shift || b >= st.task)) delete st.results[k]; } begin(); },
    collectAll() { for (const [id, w] of termWords) if (!notebook.has(id)) st.notebook.push([id, w]); save(); refresh(); },
  };

  begin();
}
