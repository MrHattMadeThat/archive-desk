// The title screen: pick a unit, continue or start over. ?unit=acadie-1&shift=3 jumps straight in (for testing).
import '@fontsource-variable/fraunces';
import '@fontsource/atkinson-hyperlegible/400.css';
import '@fontsource/atkinson-hyperlegible/700.css';
import '@fontsource/atkinson-hyperlegible/400-italic.css';
import './style.css';
import { UNITS, COMING } from './units/index.js';
import { startGame, loadSave, clearSave } from './engine/game.js';
import { el, button } from './engine/dom.js';

const app = document.getElementById('app');
const params = new URLSearchParams(location.search);

function title() {
  const page = el('div', 'title-screen');
  const hero = el('header', 'title-hero');
  hero.append(
    el('div', 'title-kicker', 'Primary and secondary sources'),
    el('h1', null, 'The Archive Desk'),
    el('p', 'title-lede', 'Documents arrive. You stamp them, catalogue them, and answer the questions researchers send in. One rule: no answer without proof.'),
  );
  page.append(hero);

  const grid = el('div', 'units');
  for (const unit of UNITS) {
    const s = loadSave(unit);
    const total = unit.shifts.reduce((n, sh) => n + sh.tasks.length, 0);
    const done = s ? Object.keys(s.results).length : 0;
    const card = el('section', 'unit-card');
    card.append(el('div', 'unit-course', unit.course), el('h2', null, unit.title), el('div', 'unit-era', unit.era), el('p', null, unit.blurb));
    const bar = el('div', 'unit-bar');
    const fill = el('span');
    fill.style.width = `${Math.round((100 * done) / total)}%`;
    bar.append(fill);
    card.append(bar, el('div', 'unit-progress', s?.done ? 'Finished' : done ? `${done} of ${total} done` : `${unit.shifts.length} shifts · ${total} documents and questions`));
    const row = el('div', 'unit-buttons');
    const go = button('go', s && !s.done ? 'Continue' : 'Start');
    go.onclick = () => { if (s?.done) clearSave(unit); play(unit); };
    row.append(go);
    if (s && !s.done && done) {
      const again = button('quiet', 'Start over');
      again.onclick = () => { if (confirm('Start this unit again from the beginning? Your notebook will be emptied.')) { clearSave(unit); play(unit); } };
      row.append(again);
    }
    card.append(row);
    grid.append(card);
  }
  for (const c of COMING) {
    const card = el('section', 'unit-card coming');
    card.append(el('div', 'unit-course', c.course), el('h2', null, c.title), el('div', 'unit-era', c.era), el('p', null, 'Coming soon.'));
    grid.append(card);
  }
  page.append(grid);
  app.replaceChildren(page);
}

function play(unit, jump) {
  startGame(app, unit, { onExit: title, jump });
}

const want = UNITS.find((u) => u.id === params.get('unit'));
if (want) play(want, params.get('shift') ? [Number(params.get('shift')) - 1, Number(params.get('task') || 1) - 1] : null);
else title();
