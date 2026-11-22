// Two Neiro games, playable in the browser. Their rules follow the app's engines:
// Games/Constellation/ConstellationEngine.swift and Games/Ink/InkEngine.swift, with the same
// staircase (Games/Engine/Staircase.swift). The sessions are shorter than in the app.

import { t, inkName, currentLang } from './i18n.js';

class Staircase {
  constructor({ level = 1, min = 1, max = 12, upAfter = 1, downAfter = 1 }) {
    Object.assign(this, { level, min, max, upAfter, downAfter, successes: 0, failures: 0 });
  }
  record(success) {
    if (success) {
      this.failures = 0;
      if (++this.successes < this.upAfter) return 'hold';
      this.successes = 0;
      if (this.level >= this.max) return 'hold';
      this.level++;
      return 'up';
    }
    this.successes = 0;
    if (++this.failures < this.downAfter) return 'hold';
    this.failures = 0;
    if (this.level <= this.min) return 'hold';
    this.level--;
    return 'down';
  }
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const onLang = (fn) => document.addEventListener('neiro:lang', fn);

function hud(root, max) {
  const score = root.querySelector('[data-score]');
  const diff = root.querySelector('[data-diff]');
  const progress = root.querySelector('[data-progress]');
  return {
    score(v) { score.textContent = v.toLocaleString('en-US'); },
    level(v, step) {
      diff.querySelector('b').textContent = v;
      diff.style.setProperty('--p', `${Math.max(8, (v / max) * 100)}%`);
      diff.classList.remove('up', 'down');
      if (step === 'up' || step === 'down') {
        void diff.offsetWidth;
        diff.classList.add(step);
      }
    },
    progress(v) { progress.textContent = v; },
  };
}

// The cover over a board: a start button, and after a game its result. It redraws itself in
// the new language when the page's language changes.
function cover(root, startKey, onStart) {
  const el = root.querySelector('[data-overlay]');
  const button = el.querySelector('[data-start]');
  let result = null;
  const draw = () => {
    el.querySelectorAll('.result-score, .result-line').forEach((n) => n.remove());
    if (result) {
      button.insertAdjacentHTML('beforebegin', `<p class="result-score">${result.score.toLocaleString('en-US')}</p><p class="result-line">${t(result.key, result.vars)}</p>`);
    }
    button.querySelector('[data-label]').textContent = result ? t('demo.again') : t(startKey);
  };
  button.addEventListener('click', () => {
    el.classList.add('hidden');
    onStart();
  });
  onLang(draw);
  draw();
  return {
    show(next) {
      result = next;
      draw();
      el.classList.remove('hidden');
    },
    get open() { return !el.classList.contains('hidden'); },
  };
}

// Constellation ---------------------------------------------------------------------

const STARS = [3, 4, 4, 5, 6, 6, 7, 8, 9, 9, 10, 11, 12, 12, 13, 14];

function constellationLayout(level, round) {
  const grid = level <= 2 ? 3 : level <= 5 ? 4 : level <= 9 ? 5 : 6;
  const stars = STARS[Math.min(Math.max(level, 1), 16) - 1];
  const turns = level >= 13 || (level >= 8 && round % 2 === 0);
  return { grid, stars, turns };
}

export function constellationDemo(root) {
  const ROUNDS = 6;
  const gridEl = root.querySelector('[data-grid]');
  const msg = root.querySelector('[data-msg]');
  const h = hud(root, 16);
  let state = null;
  let line = { key: 'c.intro', vars: {} };

  const say = (key, vars = {}) => {
    line = { key, vars };
    msg.textContent = t(key, vars);
  };
  onLang(() => {
    msg.textContent = t(line.key, line.vars);
    [...gridEl.children].forEach((b, i) => b.setAttribute('aria-label', cellLabel(i, Number(gridEl.style.getPropertyValue('--n')) || 3)));
  });
  const cellLabel = (i, n) => t('c.cell', { r: Math.floor(i / n) + 1, c: (i % n) + 1 });

  function buildGrid(n) {
    gridEl.innerHTML = '';
    gridEl.style.setProperty('--n', n);
    for (let i = 0; i < n * n; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'star-cell';
      b.setAttribute('aria-label', cellLabel(i, n));
      b.addEventListener('click', () => tap(i, b));
      gridEl.appendChild(b);
    }
  }

  async function round() {
    const s = state;
    s.round++;
    h.progress(`${s.round}/${ROUNDS}`);
    const layout = constellationLayout(s.stairs.level, s.round);
    buildGrid(layout.grid);
    s.targets = new Set(shuffle([...Array(layout.grid * layout.grid).keys()]).slice(0, layout.stars));
    s.found = new Set();
    s.stage = 'waiting';
    gridEl.classList.add('disabled');
    gridEl.classList.remove('recall');
    say('c.watch', { n: layout.stars });
    await wait(450);
    if (s !== state) return;
    const cells = gridEl.children;
    s.targets.forEach((i) => cells[i].classList.add('lit'));
    await wait((0.9 + 0.11 * layout.stars) * 1000);
    if (s !== state) return;
    s.targets.forEach((i) => cells[i].classList.remove('lit'));
    if (layout.turns) {
      await wait(250);
      s.rotation += Math.random() < 0.5 ? 90 : -90;
      gridEl.style.transform = `rotate(${s.rotation}deg)`;
      say('c.turned');
      await wait(700);
    } else {
      await wait(200);
    }
    if (s !== state) return;
    s.stage = 'recall';
    gridEl.classList.remove('disabled');
    gridEl.classList.add('recall');
    say('c.recall');
  }

  function tap(i, cell) {
    const s = state;
    if (!s || s.stage !== 'recall' || s.found.has(i)) return;
    if (s.targets.has(i)) {
      s.found.add(i);
      cell.classList.add('found');
      if (s.found.size === s.targets.size) finishRound(true);
    } else {
      cell.classList.add('wrong');
      const cells = gridEl.children;
      s.targets.forEach((x) => { if (!s.found.has(x)) cells[x].classList.add('missed'); });
      finishRound(false);
    }
  }

  async function finishRound(solved) {
    const s = state;
    s.stage = solved ? 'solved' : 'missed';
    gridEl.classList.add('disabled');
    if (solved) {
      s.score += 10 * s.targets.size + 5 * s.stairs.level;
      s.right++;
      h.score(s.score);
    }
    const step = s.stairs.record(solved);
    s.best = Math.max(s.best, s.stairs.level);
    say(solved ? (step === 'up' ? 'c.allUp' : 'c.all') : 'c.missed');
    await wait(solved ? 1000 : 1400);
    if (s !== state) return;
    h.level(s.stairs.level, step);
    if (s.round >= ROUNDS) return end();
    round();
  }

  function end() {
    const s = state;
    say('c.intro');
    overlay.show({ score: s.score, key: 'c.result', vars: { right: s.right, best: s.best } });
  }

  function start() {
    gridEl.style.transform = '';
    state = { round: 0, score: 0, right: 0, rotation: 0, best: 1, stairs: new Staircase({ level: 1, max: 16 }) };
    h.score(0);
    h.level(1);
    round();
  }

  buildGrid(3);
  h.level(1);
  say('c.intro');
  const overlay = cover(root, 'demo.start.c', start);
}

// Ink ------------------------------------------------------------------------------------

const INKS = ['#FF5C61', '#7D9BFF', '#3DD68C', '#FFD84D'];
const CONFLICT = [0.25, 0.4, 0.5, 0.6, 0.65, 0.7, 0.7, 0.75, 0.75, 0.8, 0.8, 0.85];

function inkSettings(level) {
  const l = Math.min(Math.max(level, 1), 12);
  return {
    colors: l <= 2 ? 3 : 4,
    conflict: CONFLICT[l - 1],
    framed: l >= 6 ? Math.min(0.2 + 0.03 * (l - 6), 0.35) : 0,
    shuffles: l >= 5,
    deadline: l >= 4 ? Math.max(2.8 - 0.16 * (l - 4), 1.5) : null,
  };
}

export function inkDemo(root, { onDone } = {}) {
  const SECONDS = 30;
  const wordEl = root.querySelector('[data-word]');
  const swatchEl = root.querySelector('[data-swatches]');
  const deadlineEl = root.querySelector('[data-deadline]');
  const bar = deadlineEl.querySelector('i');
  const msg = root.querySelector('[data-msg]');
  const h = hud(root, 12);
  let state = null;
  let line = { key: 'i.intro', vars: {} };

  const say = (key, vars = {}) => {
    line = { key, vars };
    msg.textContent = t(key, vars);
  };
  // A word on the board keeps its meaning and colour; only its language changes.
  const showWord = (trial) => {
    if (!trial) return;
    // Georgian is never set in capitals; English words are, as in the app.
    wordEl.textContent = currentLang() === 'ka' ? inkName(trial.word) : inkName(trial.word).toUpperCase();
    wordEl.setAttribute('aria-label', t('i.word', { word: inkName(trial.word), ink: inkName(trial.ink).toLowerCase(), framed: trial.framed ? t('i.framed') : '' }));
  };
  onLang(() => {
    const vars = line.key === 'i.inkWas' ? { color: inkName(line.vars.index).toLowerCase(), index: line.vars.index } : line.vars;
    say(line.key, vars);
    if (state && state.trial) showWord(state.trial);
    swatchEl.querySelectorAll('.swatch').forEach((b) => b.setAttribute('aria-label', inkName(Number(b.dataset.ink))));
  });

  function renderSwatches(order) {
    swatchEl.style.setProperty('--k', order.length);
    swatchEl.innerHTML = '';
    order.forEach((idx) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'swatch';
      b.style.setProperty('--sw', INKS[idx]);
      b.setAttribute('aria-label', inkName(idx));
      b.dataset.ink = idx;
      b.addEventListener('click', () => choose(idx, b));
      swatchEl.appendChild(b);
    });
  }

  function makeTrial(level) {
    const s = inkSettings(level);
    const palette = [...Array(s.colors).keys()];
    const word = palette[Math.floor(Math.random() * palette.length)];
    let ink = word;
    if (Math.random() < s.conflict) {
      const others = palette.filter((p) => p !== word);
      ink = others[Math.floor(Math.random() * others.length)];
    }
    return { word, ink, framed: Math.random() < s.framed, swatches: s.shuffles ? shuffle(palette) : palette, deadline: s.deadline };
  }

  async function next(delay) {
    const s = state;
    wordEl.classList.add('out');
    await wait(delay);
    if (s !== state || s.over) return;
    const trial = makeTrial(s.stairs.level);
    s.trial = trial;
    s.trialId = (s.trialId || 0) + 1;
    const id = s.trialId;
    renderSwatches(trial.swatches);
    showWord(trial);
    wordEl.style.color = INKS[trial.ink];
    wordEl.classList.toggle('framed', trial.framed);
    wordEl.classList.remove('out');
    say(trial.framed ? 'i.tapWord' : 'i.tapInk');
    if (trial.deadline) {
      deadlineEl.classList.add('on');
      bar.style.transition = 'none';
      bar.style.transform = 'scaleX(1)';
      void bar.offsetWidth;
      bar.style.transition = `transform ${trial.deadline}s linear`;
      bar.style.transform = 'scaleX(0)';
      setTimeout(() => {
        if (state === s && s.trialId === id && s.trial === trial && !s.over) answer(null, null);
      }, trial.deadline * 1000);
    } else {
      deadlineEl.classList.remove('on');
    }
  }

  function choose(idx, button) {
    if (!state || !state.trial || state.over) return;
    answer(idx, button);
  }

  function answer(idx, button) {
    const s = state;
    const trial = s.trial;
    s.trial = null;
    const target = trial.framed ? trial.word : trial.ink;
    const correct = idx === target;
    s.history.push({ level: s.stairs.level, correct });
    s.total++;
    if (correct) {
      s.right++;
      s.score += 8 + s.stairs.level + (trial.word === trial.ink ? 0 : 4) + (trial.framed ? 4 : 0);
      h.score(s.score);
      button.classList.add('right');
    } else {
      if (button) button.classList.add('wrong');
      if (idx === null) say('i.slow');
      else if (trial.framed) say('i.framedMiss');
      else say('i.inkWas', { color: inkName(trial.ink).toLowerCase(), index: trial.ink });
    }
    const step = s.stairs.record(correct);
    s.best = Math.max(s.best, s.stairs.level);
    h.level(s.stairs.level, step);
    next(correct ? 300 : 800);
  }

  function end() {
    const s = state;
    s.over = true;
    clearInterval(s.clock);
    deadlineEl.classList.remove('on');
    wordEl.textContent = '';
    wordEl.classList.remove('framed');
    say('i.intro');
    overlay.show({ score: s.score, key: 'i.result', vars: { right: s.right, total: s.total, best: s.best } });
    if (onDone) onDone(s.history.slice());
  }

  function start() {
    if (state) clearInterval(state.clock);
    state = { score: 0, right: 0, total: 0, best: 1, history: [], over: false, stairs: new Staircase({ level: 1, max: 12, upAfter: 4, downAfter: 2 }) };
    const s = state;
    h.score(0);
    h.level(1);
    h.progress(SECONDS);
    const started = performance.now();
    s.clock = setInterval(() => {
      const left = Math.max(0, SECONDS - Math.floor((performance.now() - started) / 1000));
      h.progress(left);
      if (left <= 0 && state === s && !s.over) end();
    }, 200);
    next(150);
  }

  renderSwatches([0, 1, 2]);
  h.level(1);
  say('i.intro');
  const overlay = cover(root, 'demo.start.i', start);
}

export { Staircase };
