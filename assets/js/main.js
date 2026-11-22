import { SKILLS, GAMES, CONSTELLATIONS, skillById, loc } from './data.js';
import { gameArt } from './art.js';
import { NeuronView } from './neuron.js';
import { constellationDemo, inkDemo, Staircase } from './demos.js';
import { mountLangSwitch, currentLang, t } from './i18n.js';
import { SCREEN_LANGS, FALLBACK_SCREENS } from './screens.js';
import { APP_STORE_URL } from './config.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

document.documentElement.classList.add('js');
$$('[data-appstore]').forEach((a) => { a.href = APP_STORE_URL; });
mountLangSwitch();
const onLang = (fn) => document.addEventListener('neiro:lang', () => fn(currentLang()));

// Reveal on scroll ---------------------------------------------------------------------

const revealer = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealer.unobserve(e.target);
    }
  }
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
const observeReveals = (root = document) => $$('.reveal:not(.in)', root).forEach((el) => revealer.observe(el));

// Navigation follows the section under it ---------------------------------------------

const nav = $('#nav');
const themed = $$('[data-theme]').filter((el) => el !== nav);
let navTick = false;
function updateNav() {
  navTick = false;
  nav.classList.toggle('scrolled', window.scrollY > 8);
  const y = 32;
  for (const el of themed) {
    const r = el.getBoundingClientRect();
    if (r.top <= y && r.bottom > y) {
      nav.dataset.on = el.dataset.theme;
      break;
    }
  }
}
window.addEventListener('scroll', () => {
  if (!navTick) {
    navTick = true;
    requestAnimationFrame(updateNav);
  }
}, { passive: true });
updateNav();

// App screenshots in the page's language ------------------------------------------------
// Each language shows its own set when there is one, and the Georgian set otherwise.

function applyScreens(lang) {
  const set = SCREEN_LANGS.includes(lang) ? lang : FALLBACK_SCREENS;
  const swap = (value) => value.replace(/screens\/[a-z]{2}\//g, `screens/${set}/`);
  $$('img.shot').forEach((img) => {
    const src = img.getAttribute('src');
    if (src && swap(src) !== src) img.setAttribute('src', swap(src));
    const srcset = img.getAttribute('srcset');
    if (srcset && swap(srcset) !== srcset) img.setAttribute('srcset', swap(srcset));
  });
  $('#lang-note').textContent = set === lang ? t('lang.match') : t('lang.fallback');
}
applyScreens(currentLang());
onLang(applyScreens);

// The seven skills under the hero
function renderRibbon(lang) {
  const varName = { problemSolving: 'problem' };
  $('#skill-ribbon').innerHTML = SKILLS.map((s) => `<li style="--c: var(--${varName[s.id] || s.id})">${loc(s, 'name', lang)}</li>`).join('');
}
renderRibbon(currentLang());
onLang(renderRibbon);

// Hero: a neuron that keeps growing, a node for every game ------------------------------

const heroCanvas = $('#hero-neuron');
const heroVisual = $('.hero-visual');
const toasts = $('#hero-toasts');
const hero = new NeuronView(heroCanvas, {
  seed: 7,
  counts: [17, 15, 14, 16, 13, 15, 12],
  onLand: (node, pt) => showToast(node, pt),
});
let pendingGame = null;

function showToast(node, pt) {
  if (!pendingGame || pendingGame.skill !== SKILLS[node.area].id) return;
  const game = pendingGame;
  pendingGame = null;
  const lang = currentLang();
  const skill = skillById[game.skill];
  const c = heroCanvas.getBoundingClientRect();
  const v = heroVisual.getBoundingClientRect();
  const dpr = heroCanvas.width / c.width;
  let x = c.left - v.left + pt.x / dpr;
  let y = c.top - v.top + pt.y / dpr;
  const el = document.createElement('div');
  el.className = 'toast';
  el.style.setProperty('--c', skill.night);
  el.innerHTML = `<i></i><div><b>${loc(game, 'name', lang)}</b><span>${t('toast.grew', { skill: skill.name, skillGen: skill.ka.gen })}</span></div>`;
  toasts.appendChild(el);
  const w = el.offsetWidth;
  const hgt = el.offsetHeight;
  // Sit beside the new node, inside the visible part of the hero.
  const minX = Math.max(8, -v.left + 12);
  const maxX = Math.min(v.width - w - 8, window.innerWidth - v.left - w - 12);
  x = x + (pt.x / dpr > c.width / 2 ? 14 : -w - 14);
  x = Math.min(Math.max(x, minX), maxX);
  y = Math.min(Math.max(y - hgt / 2, 8), v.height - hgt - 8);
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => el.classList.remove('show'), 2400);
  setTimeout(() => el.remove(), 3100);
}

if (!reduceMotion) {
  let heroVisible = true;
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }).observe(heroCanvas);
  setTimeout(function growHero() {
    if (heroVisible && !document.hidden && hero.total < 170) {
      const game = GAMES[Math.floor(Math.random() * GAMES.length)];
      const area = SKILLS.findIndex((s) => s.id === game.skill);
      pendingGame = game;
      hero.grow(area);
    }
    setTimeout(growHero, 2600);
  }, 1800);
}

// A day in Neiro: the phone follows the step being read ----------------------------------

const storyImgs = $$('.story-phone img');
const storyDots = $$('.story-progress i');
const steps = $$('.story-step');
const stepObserver = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    const i = Number(e.target.dataset.screen);
    steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
    storyImgs.forEach((img, k) => img.classList.toggle('is-active', k === i));
    storyDots.forEach((d, k) => d.classList.toggle('is-active', k === i));
  }
}, { rootMargin: '-45% 0px -45% 0px' });
steps.forEach((s) => stepObserver.observe(s));
steps[0].classList.add('is-active');

// The games wall ---------------------------------------------------------------------------

const wall = $('#wall');
function renderWall(lang) {
  const shown = wall.children.length > 0;
  wall.innerHTML = SKILLS.map((skill, i) => {
    const games = GAMES.filter((g) => g.skill === skill.id);
    return `<div class="wall-col reveal${shown ? ' in' : ''}" role="listitem" style="--c:${skill.night}" data-delay="${Math.min(i % 4, 3)}">
      <div class="wall-head"><b>${loc(skill, 'name', lang)}</b><span>${loc(skill, 'summary', lang)}</span></div>
      <div class="wall-row">${games.map((g) => `
        <button class="tile" type="button" data-game="${g.id}" aria-label="${t('tile.aria', { name: loc(g, 'name', lang), skill: skill.name.toLowerCase(), skillGen: skill.ka.gen, tagline: loc(g, 'tagline', lang) })}">
          ${gameArt(g, lang)}
          ${g.three ? '<span class="tile-badge">3D</span>' : ''}
          <span class="tile-body"><span class="tile-name">${loc(g, 'name', lang)}</span><span class="tile-meta">${loc(g, 'format', lang)}</span></span>
        </button>`).join('')}
      </div>
    </div>`;
  }).join('');
  observeReveals(wall);
}
renderWall(currentLang());
onLang(renderWall);

const dialog = $('#game-dialog');
let current = 0;
function openGame(index, lang = currentLang()) {
  current = (index + GAMES.length) % GAMES.length;
  const g = GAMES[current];
  const skill = skillById[g.skill];
  dialog.style.setProperty('--c', skill.night);
  $('#gd-art').innerHTML = gameArt(g, lang);
  $('#gd-skill').textContent = `${loc(skill, 'name', lang)}${g.three ? t('gd.three') : ''}`;
  $('#gd-title').textContent = loc(g, 'name', lang);
  $('#gd-tagline').textContent = loc(g, 'tagline', lang);
  $('#gd-trains').textContent = loc(g, 'trains', lang);
  $('#gd-basis').textContent = loc(g, 'basis', lang);
  $('#gd-format').textContent = loc(g, 'format', lang);
  $('#gd-level').textContent = g.level === 1 ? t('gd.start') : t('gd.atLevel', { n: g.level });
  if (!dialog.open) dialog.showModal();
}
wall.addEventListener('click', (e) => {
  const tile = e.target.closest('[data-game]');
  if (tile) openGame(GAMES.findIndex((g) => g.id === tile.dataset.game));
});
dialog.addEventListener('click', (e) => {
  if (e.target === dialog || e.target.closest('[data-close]')) dialog.close();
  const stepBtn = e.target.closest('[data-step]');
  if (stepBtn) openGame(current + Number(stepBtn.dataset.step));
});
dialog.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') openGame(current + 1);
  if (e.key === 'ArrowLeft') openGame(current - 1);
});
onLang((lang) => { if (dialog.open) openGame(current, lang); });

// Where the games come from
const researchPicks = ['echo', 'compass', 'towers', 'ink', 'signal', 'matrix', 'trails', 'hunch', 'spin', 'brake', 'glimpse', 'pond'];
function renderResearch(lang) {
  $('#research-list').innerHTML = researchPicks.map((id) => {
    const g = GAMES.find((x) => x.id === id);
    return `<li style="--c:${skillById[g.skill].paper}"><b>${loc(g, 'name', lang)}</b> ${loc(g, 'basis', lang)}</li>`;
  }).join('');
}
renderResearch(currentLang());
onLang(renderResearch);

// Try it ------------------------------------------------------------------------------------

constellationDemo($('#demo-constellation'));
inkDemo($('#demo-ink'), { onDone: (history) => drawStairs(history, true) });

// The staircase chart ---------------------------------------------------------------------

function exampleRun() {
  // A believable game: quick climbs at first, then settling where about half go right.
  const pattern = '1111 1111 1111 1101111 10110 1111 1100 1111 0111 1011 0011 1101'.replace(/ /g, '');
  const stairs = new Staircase({ level: 1, max: 12, upAfter: 4, downAfter: 2 });
  return [...pattern].map((c) => {
    const entry = { level: stairs.level, correct: c === '1' };
    stairs.record(entry.correct);
    return entry;
  });
}

let lastStairs = null;
function drawStairs(history, mine = false, animate = true) {
  const svg = $('#stair-chart');
  if (!history.length) return;
  lastStairs = { history, mine };
  // Drawn at the chart's real width, so its labels stay legible on a phone.
  const W = Math.round(Math.min(640, Math.max(300, svg.clientWidth || 640)));
  const H = W < 480 ? 220 : 260;
  const dotR = W < 480 ? 2.8 : 4;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const pad = { l: 34, r: 10, t: 12, b: 30 };
  const maxLevel = Math.max(6, ...history.map((h) => h.level)) + 1;
  const n = Math.max(history.length, 12);
  const x = (i) => pad.l + (i / (n - 1)) * (W - pad.l - pad.r);
  const y = (lvl) => pad.t + (1 - (lvl - 1) / (maxLevel - 1)) * (H - pad.t - pad.b);
  let grid = '';
  for (let l = 1; l <= maxLevel; l++) {
    grid += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${y(l)}" y2="${y(l)}"/>`;
  }
  let axis = '';
  for (let l = 1; l <= maxLevel; l += maxLevel > 8 ? 2 : 1) axis += `<text x="${pad.l - 12}" y="${y(l) + 4}" text-anchor="end">${l}</text>`;
  axis += `<text x="${pad.l}" y="${H - 6}">${t('stairs.first')}</text><text x="${x(history.length - 1)}" y="${H - 6}" text-anchor="end">${t('stairs.last', { n: history.length })}</text>`;
  let d = `M${x(0)} ${y(history[0].level)}`;
  history.forEach((h, i) => {
    if (i === 0) return;
    d += ` H${x(i)} V${y(h.level)}`;
  });
  const area = `${d} V${H - pad.b} H${x(0)} Z`;
  const dots = history.map((h, i) => `<circle class="dot ${h.correct ? 'ok' : 'no'}" cx="${x(i)}" cy="${y(h.level)}" r="${dotR}"/>`).join('');
  svg.innerHTML = `<g class="grid">${grid}</g><g class="axis">${axis}</g><path class="step-area" d="${area}"/><path class="step-line" d="${d}"/><g>${dots}</g>`;
  const line = svg.querySelector('.step-line');
  const len = line.getTotalLength();
  svg.classList.remove('drawn');
  if (!reduceMotion && animate) {
    line.style.setProperty('--len', len);
    line.style.strokeDasharray = len;
    line.style.strokeDashoffset = len;
    void svg.getBoundingClientRect();
    svg.classList.add('drawn');
  }
  const best = Math.max(...history.map((h) => h.level));
  $('#stair-label').textContent = mine ? t('stairs.mine') : t('stairs.example');
  $('#stair-sub').textContent = mine
    ? t('stairs.mineSub', { right: history.filter((h) => h.correct).length, total: history.length, best })
    : t('stairs.rule');
}

const stairChart = $('#stair-chart');
let stairsDrawn = false;
new IntersectionObserver(([e], obs) => {
  if (e.isIntersecting && !stairsDrawn) {
    stairsDrawn = true;
    drawStairs(exampleRun());
    obs.disconnect();
  }
}, { threshold: 0.3 }).observe(stairChart);
let stairWidth = 0;
new ResizeObserver(() => {
  const w = stairChart.clientWidth;
  if (lastStairs && Math.abs(w - stairWidth) > 4) drawStairs(lastStairs.history, lastStairs.mine, false);
  stairWidth = w;
}).observe(stairChart);
function stairLabels() {
  if (lastStairs) drawStairs(lastStairs.history, lastStairs.mine, false);
  else {
    $('#stair-label').textContent = t('stairs.example');
    $('#stair-sub').textContent = t('stairs.rule');
  }
}
stairLabels();
onLang(stairLabels);

// Your neuron --------------------------------------------------------------------------

const START_COUNTS = [9, 7, 6, 8, 5, 7, 4];
const neuron = new NeuronView($('#neuron-canvas'), { seed: 2026, counts: START_COUNTS });
const growCount = $('#grow-count');
const updateCount = () => { growCount.textContent = neuron.total; };
function renderGrowButtons(lang) {
  $('#grow-buttons').innerHTML = SKILLS.map((s, i) => `<button type="button" class="grow-btn" data-area="${i}" style="--c:${s.night}" aria-label="${t('grow.aria', { skill: s.name.toLowerCase(), skillGen: s.ka.gen })}"><span>${loc(s, 'name', lang)}</span></button>`).join('');
}
renderGrowButtons(currentLang());
onLang(renderGrowButtons);
$('#grow-buttons').addEventListener('click', (e) => {
  const b = e.target.closest('[data-area]');
  if (!b) return;
  neuron.grow(Number(b.dataset.area));
  updateCount();
});
let weekStart = 0;
$('#grow-week').addEventListener('click', () => {
  // Three games a day from three different skills, so a week covers all seven.
  const counts = neuron.counts.slice();
  for (let d = 0; d < 7; d++) {
    for (let k = 0; k < 3; k++) counts[(weekStart + d * 3 + k) % 7] += 1;
  }
  weekStart = (weekStart + 1) % 7;
  neuron.setCounts(counts.map((c) => Math.min(c, 200)));
  updateCount();
});
$('#grow-seed').addEventListener('click', () => {
  neuron.setSeed(Math.floor(Math.random() * 1e9));
  neuron.setCounts(neuron.counts, { animate: false });
});
$('#grow-reset').addEventListener('click', () => {
  neuron.setCounts([0, 0, 0, 0, 0, 0, 0], { animate: false });
  updateCount();
});
updateCount();

// The final call's neuron, fully grown.
new NeuronView($('#final-neuron'), { seed: 11, counts: [26, 22, 20, 24, 18, 21, 16], glow: true });

// Your sky -------------------------------------------------------------------------------

const skyGrid = $('#sky-grid');
const skyRange = $('#sky-days');
const skyOut = $('#sky-days-out');
const skyStatus = $('#sky-status');

skyGrid.innerHTML = CONSTELLATIONS.map((c, ci) => {
  const lines = c.lines.map(([a, b], li) => `<line class="line" data-li="${li}" x1="${c.stars[a][0] * 100}" y1="${c.stars[a][1] * 80}" x2="${c.stars[b][0] * 100}" y2="${c.stars[b][1] * 80}"/>`).join('');
  const stars = c.stars.map(([sx, sy], si) => {
    const r = c.bright.includes(si) ? 2.6 : 1.9;
    return `<circle class="halo" data-si="${si}" cx="${sx * 100}" cy="${sy * 80}" r="${r * 2.4}"/><circle class="star" data-si="${si}" cx="${sx * 100}" cy="${sy * 80}" r="${r}"/>`;
  }).join('');
  return `<article class="sky-card reveal" data-delay="${ci % 4}" data-ci="${ci}">
    <svg viewBox="-6 -6 112 92" aria-hidden="true">${lines}${stars}</svg>
    <h3><span class="sky-name"></span> <small></small></h3>
    <p></p>
  </article>`;
}).join('');

function renderSky(days, lang = currentLang()) {
  skyOut.textContent = days;
  skyRange.style.setProperty('--fill', `${(days / Number(skyRange.max)) * 100}%`);
  const finished = Math.floor(days / 7);
  const litInCurrent = days % 7;
  $$('.sky-card', skyGrid).forEach((card) => {
    const ci = Number(card.dataset.ci);
    const c = CONSTELLATIONS[ci];
    const done = ci < finished;
    const isCurrent = ci === finished;
    const lit = done ? 7 : isCurrent ? litInCurrent : 0;
    card.classList.toggle('done', done);
    card.classList.toggle('current', isCurrent && days < 84);
    card.classList.toggle('future', !done && !isCurrent);
    $$('.star', card).forEach((s) => s.classList.toggle('on', Number(s.dataset.si) < lit));
    $$('.halo', card).forEach((s) => {
      const si = Number(s.dataset.si);
      s.classList.toggle('on', si < lit && (done ? c.bright.includes(si) : si === lit - 1));
    });
    // A line shows once both its stars are lit, so the figure joins up as it fills.
    $$('.line', card).forEach((l) => {
      const [a, b] = c.lines[Number(l.dataset.li)];
      l.classList.toggle('on', a < lit && b < lit);
    });
    card.querySelector('.sky-name').textContent = loc(c, 'name', lang);
    const small = card.querySelector('small');
    const p = card.querySelector('p');
    if (done) {
      small.textContent = t('sky.finished');
      p.textContent = loc(c, 'note', lang);
    } else if (isCurrent) {
      const left = 7 - lit;
      small.textContent = t('sky.of7', { n: lit });
      p.textContent = t('sky.left', { n: left, days: left === 1 ? t('sky.day') : t('sky.days') });
    } else {
      small.textContent = t('sky.waiting');
      p.textContent = '';
    }
  });
  const toGo = 7 - litInCurrent;
  if (days === 0) skyStatus.textContent = t('sky.zero');
  else if (days >= 84) skyStatus.textContent = t('sky.all');
  else skyStatus.textContent = t('sky.toGo', { name: loc(CONSTELLATIONS[finished], 'name', lang), n: toGo, stars: toGo === 1 ? t('sky.star') : t('sky.stars') });
}
skyRange.addEventListener('input', () => renderSky(Number(skyRange.value)));
renderSky(Number(skyRange.value));
onLang((lang) => renderSky(Number(skyRange.value), lang));

// The daily puzzle, a small one to try -----------------------------------------------------
// The orb slides until a rock or the edge stops it; the star catches it as it passes.

const glide = {
  cols: 6,
  rows: 6,
  rocks: new Set(['0,3', '3,5', '4,0', '4,3', '5,4', '5,5']),
  start: [2, 4],
  goal: [4, 2],
};
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

function slide([x, y], dir) {
  const [dx, dy] = DIRS[dir];
  const path = [];
  for (;;) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx < 0 || ny < 0 || nx >= glide.cols || ny >= glide.rows || glide.rocks.has(`${nx},${ny}`)) return { to: [x, y], path, won: false };
    x = nx;
    y = ny;
    path.push([x, y]);
    if (x === glide.goal[0] && y === glide.goal[1]) return { to: [x, y], path, won: true };
  }
}

function fewestMoves() {
  const key = (p) => p.join(',');
  const seen = new Set([key(glide.start)]);
  let frontier = [glide.start];
  for (let depth = 1; depth < 20; depth++) {
    const nextFrontier = [];
    for (const p of frontier) {
      for (const dir of Object.keys(DIRS)) {
        const r = slide(p, dir);
        if (r.won) return depth;
        if (!r.path.length || seen.has(key(r.to))) continue;
        seen.add(key(r.to));
        nextFrontier.push(r.to);
      }
    }
    frontier = nextFrontier;
  }
  return null;
}

const board = $('#glide-board');
const glideMsg = $('#glide-msg');
const fewest = fewestMoves();
board.style.setProperty('--cols', glide.cols);
board.style.setProperty('--rows', glide.rows);
for (let y = 0; y < glide.rows; y++) {
  for (let x = 0; x < glide.cols; x++) {
    const cell = document.createElement('div');
    cell.className = 'g-cell';
    if (glide.rocks.has(`${x},${y}`)) cell.classList.add('rock');
    if (x === glide.goal[0] && y === glide.goal[1]) cell.classList.add('goal');
    board.appendChild(cell);
  }
}
const orb = document.createElement('div');
orb.className = 'g-orb';
board.appendChild(orb);
let orbPos = glide.start.slice();
let moves = 0;
let solved = false;
let glideState = 'intro';

function glideText() {
  $('#glide-count').innerHTML = t('glide.moves', { n: fewest });
  $('#glide-moves').textContent = moves;
  if (glideState === 'intro') glideMsg.textContent = t('glide.intro');
  else if (glideState === 'moving') glideMsg.textContent = t('glide.keep');
  else {
    const stars = moves === fewest ? 3 : moves <= fewest + 2 ? 2 : 1;
    glideMsg.textContent = `${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}  ${t('glide.solved', { n: moves })} ${moves === fewest ? t('glide.fewest') : t('glide.canDo', { n: fewest })}`;
  }
}
onLang(glideText);

function placeOrb(animate = true) {
  const first = board.children[0].getBoundingClientRect();
  const b = board.getBoundingClientRect();
  const cell = first.width;
  const gapPx = parseFloat(getComputedStyle(board).columnGap) || 0;
  const size = cell * 0.62;
  orb.style.width = orb.style.height = `${size}px`;
  orb.style.transition = animate ? '' : 'none';
  const ox = first.left - b.left + orbPos[0] * (cell + gapPx) + (cell - size) / 2;
  const oy = first.top - b.top + orbPos[1] * (cell + gapPx) + (cell - size) / 2;
  orb.style.transform = `translate(${ox}px, ${oy}px)`;
}

function move(dir) {
  if (solved) return;
  const r = slide(orbPos, dir);
  if (!r.path.length) return;
  orbPos = r.to;
  moves++;
  orb.style.transitionDuration = reduceMotion ? '0s' : `${Math.min(0.12 + r.path.length * 0.07, 0.5)}s`;
  placeOrb();
  if (r.won) {
    solved = true;
    $('#glide-moves').textContent = moves;
    setTimeout(() => {
      orb.classList.add('won');
      glideState = 'solved';
      glideText();
    }, 300);
  } else {
    glideState = 'moving';
    glideText();
  }
}

function resetGlide() {
  orbPos = glide.start.slice();
  moves = 0;
  solved = false;
  glideState = 'intro';
  orb.classList.remove('won');
  glideText();
  placeOrb(false);
}

$('.glide-pad').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.reset !== undefined) resetGlide();
  else if (solved) resetGlide();
  else move(b.dataset.dir);
});
board.addEventListener('keydown', (e) => {
  const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
  if (map[e.key]) {
    e.preventDefault();
    move(map[e.key]);
  }
});
let touch = null;
board.addEventListener('pointerdown', (e) => { touch = { x: e.clientX, y: e.clientY }; board.focus({ preventScroll: true }); });
board.addEventListener('pointerup', (e) => {
  if (!touch) return;
  const dx = e.clientX - touch.x;
  const dy = e.clientY - touch.y;
  touch = null;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
  move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
});
new ResizeObserver(() => placeOrb(false)).observe(board);
glideText();
placeOrb(false);

// FAQ: open and close smoothly -----------------------------------------------------------

$$('.faq-list details').forEach((d) => {
  const summary = d.querySelector('summary');
  const body = document.createElement('div');
  body.className = 'faq-body';
  while (summary.nextSibling) body.appendChild(summary.nextSibling);
  d.appendChild(body);
  summary.addEventListener('click', (e) => {
    if (reduceMotion) return;
    e.preventDefault();
    if (d.open) {
      const a = body.animate([{ height: `${body.offsetHeight}px`, opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 280, easing: 'cubic-bezier(.2,.7,.2,1)' });
      a.onfinish = () => { d.open = false; };
    } else {
      d.open = true;
      const h = body.offsetHeight;
      body.animate([{ height: '0px', opacity: 0 }, { height: `${h}px`, opacity: 1 }], { duration: 360, easing: 'cubic-bezier(.2,.7,.2,1)' });
    }
  });
});

observeReveals();
