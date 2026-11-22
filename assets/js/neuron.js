// The player's neuron, ported from the Neiro app (Core/Neuron/Neuron.swift and
// Features/Neuron/NeuronView.swift). Seven branches, one per skill; every game played grows
// its skill's branch by one node. Growth is deterministic for a seed, so a branch with n nodes
// is always the first n nodes of the same sequence and new growth only ever adds.

import { SKILLS } from './data.js';

const AREA_COUNT = 7;
const CORE_RADIUS = 0.16;
const MAX_NODES_PER_BRANCH = 200;
const SPREAD = 0.86;
const FIRST_STEP = 0.1;
const OUTER_LIMIT = 0.96;
const CELL = 0.06;

const MASK = (1n << 64n) - 1n;
const GOLDEN = 0x9e3779b97f4a7c15n;

// SplitMix64, as SeededGenerator in the app.
class SeededGenerator {
  constructor(seed) {
    this.state = (BigInt.asUintN(64, BigInt(seed)) + GOLDEN) & MASK;
  }
  next() {
    this.state = (this.state + GOLDEN) & MASK;
    let z = this.state;
    z = ((z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n) & MASK;
    z = ((z ^ (z >> 27n)) * 0x94d049bb133111ebn) & MASK;
    return z ^ (z >> 31n);
  }
  uniform(low, high) {
    return low + (high - low) * Number(this.next() >> 11n) / 9007199254740992;
  }
}

const step = (r) => 0.078 * (1 - 0.45 * r);
const gap = (r) => 0.04 * (1 - 0.45 * r);
const angle = (a, b) => Math.atan2(Math.sin(b - a), Math.cos(b - a));
export const rootAngle = (index) => -Math.PI / 2 + (index * 2 * Math.PI) / AREA_COUNT;

class Grid {
  constructor() {
    this.squares = new Map();
  }
  key(x, y) {
    return x * 100003 + y;
  }
  insert(p) {
    const k = this.key(Math.floor(p.x / CELL), Math.floor(p.y / CELL));
    const list = this.squares.get(k);
    if (list) list.push(p);
    else this.squares.set(k, [p]);
  }
  clearance(p) {
    const cx = Math.floor(p.x / CELL);
    const cy = Math.floor(p.y / CELL);
    let nearest = CELL;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const list = this.squares.get(this.key(cx + dx, cy + dy));
        if (!list) continue;
        for (const o of list) nearest = Math.min(nearest, Math.hypot(o.x - p.x, o.y - p.y));
      }
    }
    return nearest;
  }
}

function growBranch(area, count, seed) {
  const target = Math.min(count, MAX_NODES_PER_BRANCH);
  if (target <= 0) return [];
  const gen = new SeededGenerator(seed);
  const direction = rootAngle(area);
  const halfSlice = (Math.PI / AREA_COUNT) * SPREAD;
  const r0 = CORE_RADIUS + FIRST_STEP;
  const nodes = [{ area, order: 0, x: r0 * Math.cos(direction), y: r0 * Math.sin(direction), parent: null, depth: 0, heading: direction }];
  const children = [0];
  const lastChild = [null];
  const closed = [false];
  const grid = new Grid();
  grid.insert(nodes[0]);
  const isOpen = (i) => !closed[i] && children[i] < 3;

  const clearance = (parent, heading, length, inward) => {
    const c = { x: parent.x + length * Math.cos(heading), y: parent.y + length * Math.sin(heading) };
    const radius = Math.hypot(c.x, c.y);
    if (radius > OUTER_LIMIT || radius < Math.hypot(parent.x, parent.y) - inward) return null;
    if (Math.abs(angle(direction, Math.atan2(c.y, c.x))) > halfSlice) return null;
    const room = grid.clearance(c);
    return room >= gap(radius) ? room : null;
  };

  const make = (parentIndex, heading, length) => {
    const p = nodes[parentIndex];
    return { area, order: nodes.length, x: p.x + length * Math.cos(heading), y: p.y + length * Math.sin(heading), parent: parentIndex, depth: p.depth + 1, heading };
  };

  const pickParent = (uniform) => {
    const weights = children.map((c, i) => {
      if (!isOpen(i)) return 0;
      if (uniform) return 1;
      return c === 0 ? 1 : c === 1 ? 0.9 : 0;
    });
    const total = weights.reduce((a, b) => a + b, 0);
    if (total <= 0) return null;
    let pick = gen.uniform(0, total);
    for (let i = 0; i < weights.length; i++) {
      pick -= weights[i];
      if (pick < 0) return i;
    }
    for (let i = weights.length - 1; i >= 0; i--) if (weights[i] > 0) return i;
    return null;
  };

  const nextNode = () => {
    for (let attempt = 0; attempt < 10; attempt++) {
      const pi = pickParent(attempt >= 6);
      if (pi === null) break;
      const parent = nodes[pi];
      const sibling = lastChild[pi] === null ? null : nodes[lastChild[pi]];
      const forkSide = sibling ? (angle(parent.heading, sibling.heading) >= 0 ? -1 : 1) : 0;
      let best = null;
      for (let k = 0; k < 5; k++) {
        const turn = sibling === null ? gen.uniform(-0.3, 0.3) : forkSide * gen.uniform(0.5, 0.9);
        let heading = parent.heading + turn;
        heading += angle(heading, direction) * 0.1;
        const length = step(Math.hypot(parent.x, parent.y)) * gen.uniform(0.85, 1.12);
        const c = clearance(parent, heading, length, 0.01);
        if (c === null || !(c > (best ? best.c : 0))) continue;
        best = { node: make(pi, heading, length), c };
      }
      if (best) return best.node;
    }
    let best = null;
    for (let pi = 0; pi < nodes.length; pi++) {
      if (!isOpen(pi)) continue;
      const parent = nodes[pi];
      const length = step(Math.hypot(parent.x, parent.y));
      let fits = false;
      for (let i = 0; i <= 12; i++) {
        const heading = parent.heading - Math.PI / 2 + (i * Math.PI) / 12;
        const c = clearance(parent, heading, length, 0.03);
        if (c === null) continue;
        fits = true;
        if (c > (best ? best.c : 0)) best = { node: make(pi, heading, length), c };
      }
      if (!fits) closed[pi] = true;
    }
    return best ? best.node : null;
  };

  while (nodes.length < target) {
    const next = nextNode();
    if (!next) break;
    if (next.parent !== null) {
      children[next.parent] += 1;
      lastChild[next.parent] = nodes.length;
    }
    nodes.push(next);
    children.push(0);
    lastChild.push(null);
    closed.push(false);
    grid.insert(next);
  }
  return nodes;
}

// Branches are cached per area and grown further only when asked for more nodes, since a
// branch of n nodes is always the first n of the same sequence.
export class NeuronModel {
  constructor(seed) {
    this.seed = BigInt(seed);
    this.cache = new Map();
  }
  branch(area, count) {
    const cached = this.cache.get(area);
    if (cached && cached.length >= count) return cached.slice(0, count);
    const seed = BigInt.asUintN(64, this.seed + BigInt(area + 1) * GOLDEN);
    const grown = growBranch(area, Math.max(count, cached ? cached.length : 0), seed);
    this.cache.set(area, grown);
    return grown.slice(0, count);
  }
  grow(counts) {
    const nodes = [];
    for (let a = 0; a < AREA_COUNT; a++) {
      const offset = nodes.length;
      for (const n of this.branch(a, counts[a] || 0)) {
        nodes.push({ ...n, parent: n.parent === null ? null : n.parent + offset, id: `${a}:${n.order}` });
      }
    }
    const hasChild = new Array(nodes.length).fill(false);
    for (const n of nodes) if (n.parent !== null) hasChild[n.parent] = true;
    const tips = nodes.map((_, i) => i).filter((i) => !hasChild[i]);
    return { nodes, tips };
  }
}

// Drawing ------------------------------------------------------------------------------

const GROWTH = { delay: 0.3, stagger: 0.32, reach: 0.45, pop: 0.35, ripple: 0.9, maxAnimated: 12 };
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const overshoot = (t) => {
  const c = 1.9;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

function hexToRgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

function signalPick(slot, n) {
  let t = (slot * 2654435761) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) % n;
}

export class NeuronView {
  constructor(canvas, { seed = 7, counts = [0, 0, 0, 0, 0, 0, 0], glow = true, signals = true, onLand = null } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.model = new NeuronModel(seed);
    this.counts = counts.slice();
    this.glow = glow;
    this.signals = signals;
    this.onLand = onLand;
    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.growth = null;
    this.visible = false;
    this.still = document.createElement('canvas');
    this.neuron = this.model.grow(this.counts);
    this.resize();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
    this.io = new IntersectionObserver((entries) => {
      this.visible = entries[0].isIntersecting;
      if (this.visible) this.loop();
    }, { rootMargin: '80px' });
    this.io.observe(canvas);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.visible) this.loop();
    });
  }

  get total() {
    return this.counts.reduce((a, b) => a + b, 0);
  }

  resize() {
    // Layout size, not the on-screen box: the canvas breathes with a CSS transform.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(this.canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(this.canvas.clientHeight * dpr));
    if (w === this.canvas.width && h === this.canvas.height && this.size) return;
    this.canvas.width = w;
    this.canvas.height = h;
    this.still.width = w;
    this.still.height = h;
    this.size = { w, h };
    this.radius = (Math.min(w, h) / 2) * 0.94;
    this.center = { x: w / 2, y: h / 2 };
    this.paintStill();
    this.frame(performance.now() / 1000);
  }

  pt(n) {
    return { x: this.center.x + n.x * this.radius, y: this.center.y + n.y * this.radius };
  }

  setSeed(seed) {
    this.model = new NeuronModel(seed);
    this.growth = null;
    this.neuron = this.model.grow(this.counts);
    this.paintStill();
  }

  setCounts(counts, { animate = true } = {}) {
    const old = new Set(this.neuron.nodes.map((n) => n.id));
    this.counts = counts.slice();
    this.neuron = this.model.grow(this.counts);
    const added = this.neuron.nodes.filter((n) => !old.has(n.id)).map((n) => n.id);
    if (animate && added.length && !this.reduceMotion) {
      const ids = added.slice(-GROWTH.maxAnimated);
      this.growth = { ids: new Set(ids), order: ids, start: performance.now() / 1000, landed: 0 };
    } else {
      this.growth = null;
    }
    this.paintStill();
    this.loop();
    return added;
  }

  grow(area, by = 1) {
    const counts = this.counts.slice();
    counts[area] = Math.min(MAX_NODES_PER_BRANCH, counts[area] + by);
    return this.setCounts(counts);
  }

  nodeRadius(depth) {
    return this.radius * Math.max(0.011, 0.024 - 0.0016 * depth);
  }
  linkWidth(depth) {
    return this.radius * Math.max(0.006, 0.019 - 0.0015 * depth);
  }

  linkPoints(node) {
    let start;
    if (node.parent !== null) start = this.pt(this.neuron.nodes[node.parent]);
    else {
      const a = rootAngle(node.area);
      start = this.pt({ x: Math.cos(a) * CORE_RADIUS * 0.96, y: Math.sin(a) * CORE_RADIUS * 0.96 });
    }
    const end = this.pt(node);
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const bend = (node.order % 2 === 0 ? 1 : -1) * 0.16;
    const control = { x: (start.x + end.x) / 2 - dy * bend, y: (start.y + end.y) / 2 + dx * bend };
    return { start, control, end };
  }

  strokeLink(ctx, node, to = 1) {
    let { start, control, end } = this.linkPoints(node);
    if (to < 1) {
      // Split the quadratic curve at `to` (de Casteljau) to draw only its first part.
      const q0 = { x: start.x + (control.x - start.x) * to, y: start.y + (control.y - start.y) * to };
      const q1 = { x: control.x + (end.x - control.x) * to, y: control.y + (end.y - control.y) * to };
      end = { x: q0.x + (q1.x - q0.x) * to, y: q0.y + (q1.y - q0.y) * to };
      control = q0;
    }
    const color = SKILLS[node.area].night;
    ctx.strokeStyle = hexToRgba(color, 0.75);
    ctx.lineWidth = this.linkWidth(node.depth);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.quadraticCurveTo(control.x, control.y, end.x, end.y);
    ctx.stroke();
  }

  paintNode(ctx, node, isTip, scale = 1) {
    const at = this.pt(node);
    const size = this.nodeRadius(node.depth) * scale;
    if (size <= 0) return;
    const color = SKILLS[node.area].night;
    if (isTip) {
      ctx.fillStyle = hexToRgba(color, 0.18);
      ctx.beginPath();
      ctx.arc(at.x, at.y, size * 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(at.x, at.y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  paintStill() {
    if (!this.size) return;
    const ctx = this.still.getContext('2d');
    ctx.clearRect(0, 0, this.size.w, this.size.h);
    const growing = this.growth ? this.growth.ids : new Set();
    const present = new Set(this.neuron.nodes.map((n) => n.area));

    // Buds for skills not played yet.
    for (let a = 0; a < AREA_COUNT; a++) {
      if (present.has(a)) continue;
      const ang = rootAngle(a);
      const from = this.pt({ x: Math.cos(ang) * CORE_RADIUS, y: Math.sin(ang) * CORE_RADIUS });
      const budR = CORE_RADIUS + 0.075;
      const bud = this.pt({ x: Math.cos(ang) * budR, y: Math.sin(ang) * budR });
      const color = SKILLS[a].night;
      ctx.strokeStyle = hexToRgba(color, 0.4);
      ctx.lineWidth = this.radius * 0.012;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(bud.x, bud.y);
      ctx.stroke();
      ctx.fillStyle = '#0b0c0f';
      ctx.strokeStyle = hexToRgba(color, 0.6);
      ctx.lineWidth = this.radius * 0.008;
      ctx.beginPath();
      ctx.arc(bud.x, bud.y, this.radius * 0.026, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    const drawBranches = (glowPass) => {
      for (const node of this.neuron.nodes) {
        if (growing.has(node.id)) continue;
        if (glowPass) {
          ctx.shadowColor = hexToRgba(SKILLS[node.area].night, 0.9);
          ctx.shadowBlur = Math.min(12, this.radius * 0.02);
        }
        this.strokeLink(ctx, node);
      }
      const tips = new Set(this.neuron.tips);
      this.neuron.nodes.forEach((node, i) => {
        if (growing.has(node.id)) return;
        if (glowPass) {
          ctx.shadowColor = hexToRgba(SKILLS[node.area].night, 0.9);
          ctx.shadowBlur = Math.min(12, this.radius * 0.022);
        }
        this.paintNode(ctx, node, tips.has(i));
      });
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
    };
    drawBranches(this.glow);
    this.paintCore(ctx);
  }

  paintCore(ctx) {
    const core = CORE_RADIUS * this.radius;
    const { x, y } = this.center;
    const start = rootAngle(0);
    // Soft glow of all seven colours behind the cell body.
    const halo = ctx.createRadialGradient(x, y, core * 0.6, x, y, core * 2.1);
    halo.addColorStop(0, 'rgba(200,190,255,0.35)');
    halo.addColorStop(1, 'rgba(200,190,255,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, core * 2.1, 0, Math.PI * 2);
    ctx.fill();

    // The pale body, softly lit from the top left.
    const body = ctx.createRadialGradient(x - core * 0.3, y - core * 0.35, 0, x, y, core * 1.5);
    body.addColorStop(0, '#ffffff');
    body.addColorStop(0.5, '#f1efff');
    body.addColorStop(1, '#bdb8d8');
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(x, y, core, 0, Math.PI * 2);
    ctx.fill();

    // The ring through the seven skills' colours, so each branch leaves from its own.
    const ring = core * 0.16;
    const rr = core - ring / 2;
    if (ctx.createConicGradient) {
      const g = ctx.createConicGradient(start - Math.PI / AREA_COUNT, x, y);
      // Each colour is solid around its own branch and blends into the next between them.
      const slice = 1 / AREA_COUNT;
      const solid = slice * 0.62;
      g.addColorStop(0, '#619DF2'); // halfway between words and memory
      SKILLS.forEach((s, i) => {
        const mid = i * slice + slice / 2;
        g.addColorStop(mid - solid / 2, s.night);
        g.addColorStop(mid + solid / 2, s.night);
      });
      g.addColorStop(1, '#619DF2');
      ctx.strokeStyle = g;
      ctx.lineWidth = ring;
      ctx.shadowColor = 'rgba(180,160,255,.6)';
      ctx.shadowBlur = core * 0.4;
      ctx.beginPath();
      ctx.arc(x, y, rr, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    } else {
      SKILLS.forEach((s, i) => {
        const a = rootAngle(i);
        ctx.strokeStyle = s.night;
        ctx.lineWidth = ring;
        ctx.beginPath();
        ctx.arc(x, y, rr, a - Math.PI / AREA_COUNT, a + Math.PI / AREA_COUNT);
        ctx.stroke();
      });
    }
  }

  frame(time) {
    if (!this.size) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.size.w, this.size.h);
    ctx.drawImage(this.still, 0, 0);
    if (this.growth) this.paintGrowth(ctx, time);
    if (this.signals && !this.reduceMotion) this.paintSignals(ctx, time);
  }

  paintGrowth(ctx, time) {
    const g = this.growth;
    const elapsed = time - g.start;
    const index = new Map(this.neuron.nodes.map((n, i) => [n.id, i]));
    let done = true;
    g.order.forEach((id, s) => {
      const i = index.get(id);
      if (i === undefined) return;
      const node = this.neuron.nodes[i];
      const local = elapsed - GROWTH.delay - s * GROWTH.stagger;
      if (local < GROWTH.reach + GROWTH.ripple) done = false;
      if (local <= 0) return;
      this.strokeLink(ctx, node, easeOut(Math.min(local / GROWTH.reach, 1)));
      const landed = local - GROWTH.reach;
      if (landed <= 0) return;
      if (s >= g.landed) {
        g.landed = s + 1;
        if (this.onLand) this.onLand(node, this.pt(node));
      }
      ctx.shadowColor = SKILLS[node.area].night;
      ctx.shadowBlur = this.radius * 0.04;
      this.paintNode(ctx, node, true, overshoot(Math.min(landed / GROWTH.pop, 1)));
      ctx.shadowBlur = 0;
      const ripple = landed / GROWTH.ripple;
      if (ripple < 1) {
        const at = this.pt(node);
        const size = this.nodeRadius(node.depth) * (1.5 + 5 * easeOut(ripple));
        ctx.strokeStyle = hexToRgba(SKILLS[node.area].night, 0.55 * (1 - ripple));
        ctx.lineWidth = this.radius * 0.006;
        ctx.beginPath();
        ctx.arc(at.x, at.y, size, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
    if (done && elapsed > 0.5) {
      this.growth = null;
      this.paintStill();
    }
  }

  paintSignals(ctx, time) {
    const growing = this.growth ? this.growth.ids : new Set();
    const tips = this.neuron.tips.filter((i) => !growing.has(this.neuron.nodes[i].id));
    if (!tips.length) return;
    const beat = 0.62;
    const life = 1.9;
    const latest = Math.floor(time / beat);
    for (let slot = latest - Math.floor(life / beat); slot <= latest; slot++) {
      const progress = (time - slot * beat) / life;
      if (progress < 0 || progress > 1) continue;
      const tip = tips[signalPick(slot, tips.length)];
      const path = [this.center];
      const chain = [];
      let cur = tip;
      while (cur !== null) {
        chain.push(cur);
        cur = this.neuron.nodes[cur].parent;
      }
      chain.reverse().forEach((i) => path.push(this.pt(this.neuron.nodes[i])));
      const at = along(path, easeInOut(progress));
      if (!at) continue;
      const fade = Math.sin(Math.PI * progress);
      const skill = SKILLS[this.neuron.nodes[tip].area];
      ctx.fillStyle = hexToRgba(skill.glow, 0.35 * fade);
      ctx.beginPath();
      ctx.arc(at.x, at.y, this.radius * 0.04, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(255,255,255,${0.95 * fade})`;
      ctx.beginPath();
      ctx.arc(at.x, at.y, this.radius * 0.013, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  loop() {
    if (this.running) return;
    const animated = () => (this.signals && !this.reduceMotion) || this.growth;
    if (!animated()) {
      this.frame(performance.now() / 1000);
      return;
    }
    this.running = true;
    const tick = () => {
      if (!this.visible || document.hidden || !animated()) {
        this.running = false;
        this.frame(performance.now() / 1000);
        return;
      }
      this.frame(performance.now() / 1000);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}

function along(points, fraction) {
  if (points.length < 2) return null;
  const lengths = [];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const l = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    lengths.push(l);
    total += l;
  }
  if (total <= 0) return null;
  let remaining = fraction * total;
  for (let i = 0; i < lengths.length; i++) {
    if (remaining <= lengths[i] || i === lengths.length - 1) {
      const t = lengths[i] > 0 ? Math.min(remaining / lengths[i], 1) : 0;
      const a = points[i];
      const b = points[i + 1];
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
    remaining -= lengths[i];
  }
  return points[points.length - 1];
}
