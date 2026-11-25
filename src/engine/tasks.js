// The task types. Each one is make(task, ctx) -> {
//   docs       the source ids on the desk for this task (first one opens)
//   pointing   true if lines in the documents can be pointed at as proof
//   card()     the right-hand card, rebuilt on every ctx.refresh()
//   centre()   optional: something to show in the middle instead of a document (the board)
//   stamp()    optional: the ink on the open document
//   chip(id)   optional: a notebook word was clicked while this task wants one
//   solve()    the right answer, for testing (desk.solve() in the console)
// }
//
// ctx (from game.js): docs, sel, setSel(key), hits(key, refs), nearHint(key, near), quote(key), finish(result),
// refresh(), notebook {has, label}, open(id), shown (the open doc id).
//
// Grades: gold = right first time, proof and all. silver = got there after another try. red = the wrong stamp or answer
// first time (the student still has to find the proof before moving on).
import { el, button } from './dom.js';
import { boardLine } from './text.js';

const GENERIC = 'That line doesn’t prove it. Try the label at the top (who made it, and when?), or a line only someone who was there could write.';

// A rejected line empties the slot and its hint shows in its place (st.hint), until the student picks another line.
function proofSlot(ctx, st, prompt = 'Click the line in the document that proves it. (Or drag it here.)') {
  const slot = el('div', 'proof');
  slot.append(el('div', 'proof-label', 'Your proof'));
  const q = ctx.sel && ctx.quote(ctx.sel);
  if (q) {
    // two lines at most (the whole line is highlighted in the document), so a long sentence can't make the card scroll
    const b = el('blockquote', null, `“${q.text}”`);
    b.title = q.text;
    slot.append(b, el('cite', null, q.doc.src.title));
    slot.classList.add('filled');
  } else {
    if (st.hint) slot.classList.add('hinted');
    slot.append(el('p', st.hint ? 'proof-hint' : 'proof-empty', st.hint || prompt));
  }
  slot.addEventListener('dragover', (e) => { if (e.dataTransfer.types.includes('text/x-line')) { e.preventDefault(); slot.classList.add('over'); } });
  slot.addEventListener('dragleave', () => slot.classList.remove('over'));
  slot.addEventListener('drop', (e) => {
    const key = e.dataTransfer.getData('text/x-line');
    slot.classList.remove('over');
    if (key) { e.preventDefault(); ctx.setSel(key); }
  });
  return slot;
}

function message(st) {
  if (!st.msg) return null;
  const m = el('div', `msg ${st.tone || ''}`);
  for (const line of [].concat(st.msg)) m.append(el('p', null, line));
  return m;
}

function researchQuestion(text) {
  const box = el('div', 'rq');
  box.append(el('div', 'rq-label', 'Research question'), el('p', null, text));
  return box;
}

// ------------------------------------------------------------------ stamp
function stamp(t, ctx) {
  const st = { stamp: null, phase: 'choose', tries: 0, fresh: false };
  const NAME = { primary: 'Primary', secondary: 'Secondary' };

  function file() {
    const hit = ctx.hits(ctx.sel, t.proof);
    if (st.phase === 'choose' && st.stamp !== t.answer) {
      st.wrongFirst = true;
      st.stamp = t.answer;
      st.fresh = true;
      if (hit) return done('red', [t.wrong]);
      st.phase = 'fix';
      st.msg = [t.wrong];
      st.tone = 'bad';
      st.hint = null;
      ctx.setSel(null, true);
      return ctx.refresh();
    }
    if (hit) return done(st.wrongFirst ? 'red' : st.tries ? 'silver' : 'gold', [t.right]);
    st.tries++;
    st.hint = ctx.nearHint(ctx.sel, t.near) || GENERIC;
    ctx.setSel(null);
  }

  function done(grade, msg) {
    st.phase = 'done';
    st.msg = msg;
    st.tone = grade === 'red' ? 'bad' : 'good';
    ctx.finish({ grade, consequence: grade === 'red' ? t.consequence : null, stamp: t.answer });
  }

  return {
    docs: [t.doc],
    get pointing() { return st.phase !== 'done'; },
    stamp: () => st.stamp,
    stampFresh: () => { const f = st.fresh; st.fresh = false; return f; },
    card() {
      const c = el('div', 'task task-stamp');
      if (t.question) c.append(researchQuestion(t.question));
      c.append(el('p', 'ask', st.phase === 'fix' ? `Point at a line that shows it is ${t.answer}.` : 'Stamp the document. Then point at the line that proves your stamp.'));
      const pads = el('div', 'pads');
      for (const k of ['primary', 'secondary']) {
        const b = button(`pad pad-${k}${st.stamp === k ? ' on' : ''}`, NAME[k].toUpperCase());
        b.disabled = st.phase !== 'choose';
        b.onclick = () => { st.stamp = k; st.fresh = true; ctx.refresh(); };
        pads.append(b);
      }
      c.append(pads, proofSlot(ctx, st));
      if (st.phase !== 'done') {
        const go = button('go', st.phase === 'fix' ? 'Check' : 'File it');
        go.disabled = !(st.stamp && ctx.sel);
        go.title = go.disabled ? (st.stamp ? 'Point at a line first' : 'Stamp it first') : '';
        go.onclick = file;
        c.append(go);
      }
      const m = message(st);
      if (m) c.append(m);
      return c;
    },
    solve() {
      if (st.phase === 'done') return;
      st.stamp = t.answer;
      ctx.setSel(ctx.resolve(t.proof[0]), true);
      file();
    },
  };
}

// ------------------------------------------------------------------ question (multiple choice + proof)
function question(t, ctx) {
  const st = { pick: null, phase: 'choose', tries: 0, wrongFirst: null };
  const L = 'ABCDEF';

  function check() {
    const hit = ctx.hits(ctx.sel, t.proof);
    if (st.phase === 'choose' && st.pick !== t.answer) {
      st.wrongFirst = st.pick;
      st.pick = t.answer;
      if (hit) return done('red');
      st.phase = 'fix';
      st.msg = [`Not quite. The answer is ${L[t.answer]}: ${t.options[t.answer]}`, 'Now point at the line that proves it.'];
      st.tone = 'bad';
      st.hint = null;
      ctx.setSel(null, true);
      return ctx.refresh();
    }
    if (hit) return done(st.wrongFirst != null ? 'red' : st.tries ? 'silver' : 'gold');
    st.tries++;
    st.hint = ctx.nearHint(ctx.sel, t.near) || (st.phase === 'fix' ? 'Not that line. Keep looking.' : 'Good answer, but that line doesn’t prove it. Find a line that does.');
    ctx.setSel(null);
  }

  function done(grade) {
    st.phase = 'done';
    st.msg = [t.right];
    st.tone = grade === 'red' ? 'bad' : 'good';
    ctx.finish({ grade, consequence: grade === 'red' ? t.consequence : null });
  }

  return {
    docs: t.docs,
    get pointing() { return st.phase !== 'done'; },
    card() {
      const c = el('div', 'task task-question');
      c.append(el('p', 'ask big', t.ask));
      const opts = el('div', 'options');
      t.options.forEach((o, i) => {
        // once answered, only the right answer (and a wrong first pick) stay, so the card never has to scroll
        if (st.phase !== 'choose' && i !== t.answer && (st.phase === 'done' || i !== st.wrongFirst)) return;
        const b = button(`option${st.pick === i ? ' on' : ''}${st.phase !== 'choose' && i === t.answer ? ' right' : ''}${i === st.wrongFirst ? ' wrong' : ''}`);
        b.append(el('span', 'letter', L[i]), el('span', null, o));
        b.disabled = st.phase !== 'choose';
        b.onclick = () => { st.pick = i; ctx.refresh(); };
        opts.append(b);
      });
      c.append(opts, proofSlot(ctx, st));
      if (st.phase !== 'done') {
        const go = button('go', 'Check');
        go.disabled = st.pick == null || !ctx.sel;
        go.title = go.disabled ? (st.pick == null ? 'Pick an answer first' : 'Point at a line first') : '';
        go.onclick = check;
        c.append(go);
      }
      const m = message(st);
      if (m) c.append(m);
      return c;
    },
    solve() {
      if (st.phase === 'done') return;
      st.pick = t.answer;
      ctx.setSel(ctx.resolve(t.proof[0]), true);
      check();
    },
  };
}

// ------------------------------------------------------------------ point (find the line)
function point(t, ctx) {
  const st = { phase: 'choose', tries: 0 };
  function check() {
    if (ctx.hits(ctx.sel, t.proof)) {
      st.phase = 'done';
      st.msg = [t.right];
      st.tone = 'good';
      return ctx.finish({ grade: st.tries ? 'silver' : 'gold' });
    }
    st.tries++;
    st.hint = ctx.nearHint(ctx.sel, t.near) || 'Not that one. Keep looking.';
    ctx.setSel(null);
  }
  return {
    docs: [t.doc],
    get pointing() { return st.phase !== 'done'; },
    card() {
      const c = el('div', 'task task-point');
      c.append(el('p', 'ask big', t.ask), proofSlot(ctx, st, 'Click the line in the document. (Or drag it here.)'));
      if (st.phase !== 'done') {
        const go = button('go', 'Check');
        go.disabled = !ctx.sel;
        go.onclick = check;
        c.append(go);
      }
      const m = message(st);
      if (m) c.append(m);
      return c;
    },
    solve() { if (st.phase !== 'done') { ctx.setSel(ctx.resolve(t.proof[0]), true); check(); } },
  };
}

// ------------------------------------------------------------------ word slots (catalogue card and board share these)
function wordSlot(ctx, st, i, value, onClear) {
  const b = button(`slot${st.active === i ? ' active' : ''}${value ? ' filled' : ''}${st.bad?.has(i) ? ' bad' : ''}`);
  b.textContent = value ? ctx.notebook.label(value) : ' ';
  b.title = value ? 'Click to change it' : 'Click, then pick a word from your notebook';
  b.onclick = () => {
    if (st.active === i && value) { onClear(); st.active = i; }
    else st.active = i;
    ctx.refresh();
  };
  b.addEventListener('dragover', (e) => { if (e.dataTransfer.types.includes('text/x-term')) { e.preventDefault(); b.classList.add('over'); } });
  b.addEventListener('dragleave', () => b.classList.remove('over'));
  b.addEventListener('drop', (e) => {
    const id = e.dataTransfer.getData('text/x-term');
    if (!id) return;
    e.preventDefault();
    st.active = i;
    st.place(id);
  });
  return b;
}

// ------------------------------------------------------------------ catalogue card
function catalogue(t, ctx) {
  const st = { values: {}, active: null, checks: 0, bad: new Set(), phase: 'fill' };
  const termFields = t.fields.map((f, i) => (f.term ? i : -1)).filter((i) => i >= 0);
  st.active = termFields[0] ?? null;
  st.place = (id) => {
    if (st.phase === 'done' || st.active == null || !t.fields[st.active].term) return;
    st.values[st.active] = id;
    st.bad.delete(st.active);
    st.active = termFields.find((i) => !st.values[i]) ?? null;
    ctx.refresh();
  };

  function check() {
    st.bad = new Set(t.fields.map((f, i) => i).filter((i) => {
      const f = t.fields[i];
      return f.term ? st.values[i] !== f.term : st.values[i] !== f.answer;
    }));
    if (!st.bad.size) {
      st.phase = 'done';
      st.msg = [t.right];
      st.tone = 'good';
      return ctx.finish({ grade: st.checks ? 'silver' : 'gold' });
    }
    st.checks++;
    st.msg = `${t.fields.length - st.bad.size} of ${t.fields.length} right. Fix the ones marked in red.`;
    st.tone = 'warn';
    ctx.refresh();
  }

  return {
    docs: [t.doc],
    pointing: false,
    chip: (id) => st.place(id),
    wantsChip: () => st.phase !== 'done' && st.active != null,
    card() {
      const c = el('div', 'task task-catalogue');
      if (st.phase !== 'done') c.append(el('p', 'ask', 'Fill in the catalogue card. Click a box, then a word in your notebook.'));
      const card = el('div', 'catcard');
      card.append(el('div', 'catcard-head', ctx.docs[t.doc].src.title));
      t.fields.forEach((f, i) => {
        const row = el('div', 'catrow');
        row.append(el('span', 'catlabel', f.label));
        if (f.term) {
          row.append(wordSlot(ctx, st, i, st.values[i], () => { delete st.values[i]; }));
        } else {
          const seg = el('span', `choices${st.bad.has(i) ? ' bad' : ''}`);
          f.choices.forEach((ch, ci) => {
            const b = button(`choice${st.values[i] === ci ? ' on' : ''}`, ch);
            b.disabled = st.phase === 'done';
            b.onclick = () => { st.values[i] = ci; st.bad.delete(i); ctx.refresh(); };
            seg.append(b);
          });
          row.append(seg);
        }
        card.append(row);
      });
      c.append(card);
      if (st.phase !== 'done') {
        const go = button('go', 'Check the card');
        go.disabled = t.fields.some((f, i) => st.values[i] == null);
        go.title = go.disabled ? 'Fill every box first' : '';
        go.onclick = check;
        c.append(go);
      }
      const m = message(st);
      if (m) c.append(m);
      return c;
    },
    solve() {
      if (st.phase === 'done') return;
      t.fields.forEach((f, i) => { st.values[i] = f.term || f.answer; });
      check();
    },
  };
}

// ------------------------------------------------------------------ board (fill-in-the-blanks deduction)
function board(t, ctx) {
  const lines = t.lines.map(boardLine);
  const blanks = lines.flat().filter((g) => g.blank);
  const st = { values: {}, active: 0, checks: 0, phase: 'fill' };
  st.place = (id) => {
    if (st.phase === 'done' || st.active == null) return;
    st.values[st.active] = id;
    const next = blanks.findIndex((_, i) => !st.values[i]);
    st.active = next >= 0 ? next : null;
    ctx.refresh();
  };

  function check() {
    const wrong = blanks.filter((g, i) => !g.blank.includes(st.values[i])).length;
    st.checks++;
    if (!wrong) {
      st.phase = 'done';
      st.msg = [t.right];
      st.tone = 'good';
      return ctx.finish({ grade: st.checks <= 2 ? 'gold' : 'silver' });
    }
    st.msg = wrong <= 2 ? 'Close! Two or fewer are wrong.' : 'Not yet. More than two are wrong.';
    st.tone = 'warn';
    ctx.refresh();
  }

  return {
    docs: [],
    pointing: false,
    chip: (id) => st.place(id),
    wantsChip: () => st.phase !== 'done' && st.active != null,
    centre() {
      const panel = el('section', `panel${st.phase === 'done' ? ' solved' : ''}`);
      panel.append(el('h2', 'panel-title', t.title));
      let n = 0;
      for (const line of lines) {
        const p = el('p', 'panel-line');
        for (const g of line) {
          if (!g.blank) { p.append(g.text); continue; }
          const i = n++;
          const s = wordSlot(ctx, st, i, st.values[i], () => { delete st.values[i]; });
          s.disabled = st.phase === 'done';
          p.append(s);
        }
        panel.append(p);
      }
      if (st.phase === 'done') panel.append(el('div', 'ink ink-solved fresh', 'PROVEN'));
      return panel;
    },
    card() {
      const c = el('div', 'task task-board');
      c.append(el('p', 'ask', 'Fill the panel with words from your notebook. Click a blank, then a word.'));
      c.append(el('p', 'small', 'Need a word you don’t have? Open a document on the left and click it. Then come back with “The panel”.'));
      const filled = blanks.filter((_, i) => st.values[i]).length;
      c.append(el('p', 'small', `${filled} of ${blanks.length} blanks filled · ${st.checks} check${st.checks === 1 ? '' : 's'} so far`));
      if (st.phase !== 'done') {
        const go = button('go', 'Check');
        go.disabled = filled < blanks.length;
        go.title = go.disabled ? 'Fill every blank first' : '';
        go.onclick = check;
        c.append(go);
      }
      const m = message(st);
      if (m) c.append(m);
      return c;
    },
    solve() {
      if (st.phase === 'done') return;
      blanks.forEach((g, i) => { st.values[i] = g.blank[0]; });
      check();
    },
    needs: () => blanks.map((g) => g.blank[0]),
  };
}

export const TASKS = { stamp, question, point, catalogue, board };
