// Tile artwork for each game: a small cut paper landscape in tones of the skill's colour,
// and in front a white sketch of how the game plays. A nod to the app's own card art,
// drawn here as plain SVG.

import { skillById } from './data.js';

const W = 120;
const H = 90;
const FONT = 'font-family="ui-rounded, \'SF Pro Rounded\', Nunito, \'Noto Sans Georgian\', system-ui, sans-serif" font-weight="800"';

function rand(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}

function hill(r, base, amp, waves) {
  const pts = [];
  const n = 6;
  const phase = r() * Math.PI * 2;
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * W;
    const y = base + Math.sin(phase + (i / n) * Math.PI * waves) * amp + (r() - 0.5) * amp * 0.6;
    pts.push([x, y]);
  }
  let d = `M0 ${H} L0 ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1];
    const [x, y] = pts[i];
    const cx = (px + x) / 2;
    d += ` C${cx.toFixed(1)} ${py.toFixed(1)} ${cx.toFixed(1)} ${y.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d + ` L${W} ${H} Z`;
}

function scenery(game, kind) {
  const r = rand(hash(game.id));
  let out = '';
  if (kind === 'night') {
    for (let i = 0; i < 16; i++) {
      out += `<circle cx="${(r() * W).toFixed(1)}" cy="${(r() * 52).toFixed(1)}" r="${(0.4 + r() * 0.7).toFixed(2)}" fill="#fff" opacity="${(0.3 + r() * 0.5).toFixed(2)}"/>`;
    }
  }
  if (kind === 'sea') {
    out += `<path d="${hill(r, 70, 1.4, 6)}" fill="var(--deep)" opacity=".42"/>`;
    out += `<path d="${hill(r, 78, 1.2, 8)}" fill="var(--deep)" opacity=".6"/>`;
    return out;
  }
  if (kind === 'skyline') {
    let x = -4;
    let d = `M0 ${H}`;
    while (x < W) {
      const w = 8 + r() * 12;
      const h = 12 + r() * 20;
      d += ` L${x.toFixed(1)} ${(H - h).toFixed(1)} L${(x + w).toFixed(1)} ${(H - h).toFixed(1)}`;
      x += w + 1.5;
    }
    d += ` L${W} ${H} Z`;
    out += `<path d="${d}" fill="var(--deep)" opacity=".38"/>`;
    out += `<path d="${hill(r, 82, 2, 2)}" fill="var(--deep)" opacity=".55"/>`;
    return out;
  }
  const amp = kind === 'dunes' ? 6 : 4;
  out += `<path d="${hill(r, 62, amp, kind === 'dunes' ? 1.6 : 2.2)}" fill="var(--deep)" opacity=".32"/>`;
  out += `<path d="${hill(r, 72, amp * 0.8, kind === 'dunes' ? 1.2 : 1.8)}" fill="var(--deep)" opacity=".5"/>`;
  out += `<path d="${hill(r, 81, amp * 0.6, 1.4)}" fill="var(--deep)" opacity=".72"/>`;
  return out;
}

const S = 'stroke="#fff" fill="none" stroke-linecap="round" stroke-linejoin="round"';

function arrow(x, y, dir, size = 7, opacity = 1) {
  const d = dir === 'r' ? `M${x - size / 2} ${y - size / 2} L${x + size / 2} ${y} L${x - size / 2} ${y + size / 2}` : `M${x + size / 2} ${y - size / 2} L${x - size / 2} ${y} L${x + size / 2} ${y + size / 2}`;
  return `<path d="${d}" ${S} stroke-width="2.6" opacity="${opacity}"/>`;
}

function cube(x, y, s, o = 1) {
  // An isometric cube with its top at (x, y).
  const h = s * 0.58;
  return `<g opacity="${o}">
    <path d="M${x} ${y} L${x + s} ${y + h} L${x} ${y + 2 * h} L${x - s} ${y + h} Z" fill="#fff"/>
    <path d="M${x - s} ${y + h} L${x} ${y + 2 * h} L${x} ${y + 2 * h + s * 1.15} L${x - s} ${y + h + s * 1.15} Z" fill="#fff" opacity=".62"/>
    <path d="M${x + s} ${y + h} L${x} ${y + 2 * h} L${x} ${y + 2 * h + s * 1.15} L${x + s} ${y + h + s * 1.15} Z" fill="#fff" opacity=".82"/>
  </g>`;
}

const MOTIFS = {
  constellation: () => {
    const p = [[26, 34], [44, 22], [62, 36], [80, 24], [94, 44]];
    let o = `<path d="M${p.map((q) => q.join(' ')).join(' L')}" ${S} stroke-width="1" opacity=".55"/>`;
    p.forEach(([x, y], i) => {
      o += `<circle cx="${x}" cy="${y}" r="${i === 2 ? 6 : 4.5}" fill="#fff" opacity=".18"/><circle cx="${x}" cy="${y}" r="${i === 2 ? 2.8 : 2.2}" fill="#fff"/>`;
    });
    return o;
  },
  echo: () => {
    const pads = [[32, 16], [52, 13], [72, 17], [30, 34], [51, 32], [73, 35], [33, 52], [53, 50], [71, 53]];
    return pads.map(([x, y], i) => `<rect x="${x}" y="${y}" width="15" height="13" rx="4" fill="#fff" opacity="${i === 4 ? 1 : i === 2 ? 0.55 : 0.22}"/>`).join('') +
      `<circle cx="58.5" cy="38.5" r="12" ${S} stroke-width="1.2" opacity=".5"/>`;
  },
  treasure: () => `
    <ellipse cx="60" cy="62" rx="40" ry="8" ${S} stroke-width="1.4" opacity=".45"/>
    <rect x="44" y="36" width="32" height="20" rx="3" fill="#fff"/>
    <path d="M44 38 Q44 25 60 25 Q76 25 76 38 Z" fill="#fff" opacity=".78"/>
    <rect x="57" y="40" width="6" height="7" rx="1.5" fill="var(--base)"/>
    <path d="M86 18 L88 24 L94 26 L88 28 L86 34 L84 28 L78 26 L84 24 Z" fill="#fff"/>
    <rect x="22" y="44" width="14" height="10" rx="2" fill="#fff" opacity=".4"/>
    <rect x="84" y="44" width="14" height="10" rx="2" fill="#fff" opacity=".4"/>`,
  signal: () => `
    <path d="M44 26 L64 16 L84 26 L64 36 Z M44 26 L44 50 L64 60 L84 50 L84 26 M64 36 L64 60" ${S} stroke-width="1.8" opacity=".8"/>
    <path d="M44 50 L64 40 L84 50 M64 16 L64 40" ${S} stroke-width="1" opacity=".3"/>
    <circle cx="84" cy="26" r="9" fill="#fff" opacity=".22"/><circle cx="84" cy="26" r="4" fill="#fff"/>`,
  compass: () => [
    arrow(28, 40, 'r', 8, 0.5), arrow(44, 40, 'r', 8, 0.5), arrow(60, 40, 'l', 11, 1), arrow(76, 40, 'r', 8, 0.5), arrow(92, 40, 'r', 8, 0.5),
  ].join('') + `<circle cx="60" cy="40" r="11" ${S} stroke-width="1.2" opacity=".45"/>`,
  fireflies: () => {
    const p = [[24, 30], [40, 52], [52, 24], [66, 44], [80, 28], [94, 50], [34, 16], [86, 14]];
    return p.map(([x, y], i) => i === 2 || i === 5
      ? `<circle cx="${x}" cy="${y}" r="7" ${S} stroke-width="1.4"/><circle cx="${x}" cy="${y}" r="2.6" fill="#fff"/>`
      : `<circle cx="${x}" cy="${y}" r="2.4" fill="#fff" opacity=".6"/>`).join('');
  },
  flight: () => `
    <ellipse cx="62" cy="34" rx="22" ry="20" ${S} stroke-width="4"/>
    <path d="M50 62 L62 50 L74 62 L62 58 Z" fill="#fff"/>
    <path d="M94 16 L95.6 20.4 L100 22 L95.6 23.6 L94 28 L92.4 23.6 L88 22 L92.4 20.4 Z" fill="#fff"/>`,
  brake: () => `
    <path d="M36 70 L54 24 M84 70 L66 24" ${S} stroke-width="1.6" opacity=".55"/>
    <rect x="44" y="28" width="32" height="5" rx="2.5" fill="#fff" opacity=".85"/>
    <circle cx="60" cy="16" r="7" fill="#fff"/>
    ${arrow(60, 16, 'r', 6, 1).replace('stroke="#fff"', 'stroke="var(--base)"')}
    <rect x="50" y="50" width="20" height="14" rx="5" fill="#fff"/>`,
  glimpse: () => {
    let o = `<circle cx="60" cy="38" r="7" fill="#fff"/>`;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      o += `<line x1="${60 + Math.cos(a) * 13}" y1="${38 + Math.sin(a) * 13}" x2="${60 + Math.cos(a) * 30}" y2="${38 + Math.sin(a) * 30}" ${S} stroke-width="1.2" opacity=".35" stroke-dasharray="1 3"/>`;
    }
    const a = -Math.PI / 4;
    const x = 60 + Math.cos(a) * 30;
    const y = 38 + Math.sin(a) * 30;
    o += `<path d="M${x} ${y - 6} L${x + 1.8} ${y - 1.8} L${x + 6} ${y} L${x + 1.8} ${y + 1.8} L${x} ${y + 6} L${x - 1.8} ${y + 1.8} L${x - 6} ${y} L${x - 1.8} ${y - 1.8} Z" fill="#fff"/>`;
    return o;
  },
  cipher: () => {
    const glyphs = ['M-5 -5 L5 5 M-5 5 L0 0', 'M-5 0 L5 0 M0 -5 L0 5 M-5 -5 L-5 5', 'M-5 5 L0 -5 L5 5'];
    return glyphs.map((g, i) => {
      const x = 34 + i * 26;
      return `<rect x="${x - 10}" y="16" width="20" height="34" rx="5" fill="#fff" opacity=".2"/>
        <path d="${g}" transform="translate(${x} 27)" ${S} stroke-width="2.2"/>
        <text x="${x}" y="46" text-anchor="middle" font-size="11" fill="#fff" ${FONT}>${i + 1}</text>`;
    }).join('');
  },
  trails: () => {
    const p = [[28, 48, '1'], [48, 22, 'A'], [68, 50, '2'], [90, 26, 'B']];
    let o = `<path d="M28 48 Q36 30 48 22 T68 50 T90 26" ${S} stroke-width="2.2" opacity=".75"/>`;
    p.forEach(([x, y, t]) => {
      const sq = /[A-Z]/.test(t);
      o += sq ? `<rect x="${x - 8}" y="${y - 8}" width="16" height="16" rx="4.5" fill="#fff"/>` : `<circle cx="${x}" cy="${y}" r="8.5" fill="#fff"/>`;
      o += `<text x="${x}" y="${y + 3.8}" text-anchor="middle" font-size="10.5" fill="var(--deep)" ${FONT}>${t}</text>`;
    });
    return o;
  },
  seek: () => {
    let o = '';
    let k = 0;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 5; col++) {
        const x = 28 + col * 16;
        const y = 18 + row * 17;
        const odd = row === 1 && col === 3;
        const rot = [0, 90, 180, 270][(k++ * 7) % 4];
        o += odd
          ? `<g transform="translate(${x} ${y})"><circle r="8.5" fill="#fff" opacity=".22"/><path d="M-4 -4 L4 -4 M0 -4 L0 4.5" ${S} stroke-width="2.4"/></g>`
          : `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M-3 -4.5 L-3 4 L3.5 4" ${S} stroke-width="2.2" opacity=".6"/></g>`;
      }
    }
    return o;
  },
  switch: () => `
    <rect x="30" y="14" width="60" height="38" rx="9" ${S} stroke-width="2"/>
    <line x1="60" y1="14" x2="60" y2="52" ${S} stroke-width="1.4" opacity=".5"/>
    <rect x="61.5" y="15.5" width="27" height="35" rx="7.5" fill="#fff" opacity=".22"/>
    <text x="75" y="40" text-anchor="middle" font-size="20" fill="#fff" ${FONT}>7</text>
    <rect x="32" y="58" width="26" height="9" rx="4.5" fill="#fff" opacity=".55"/>
    <rect x="62" y="58" width="26" height="9" rx="4.5" fill="#fff"/>`,
  hunch: () => `
    <g transform="rotate(-8 36 38)"><rect x="24" y="20" width="24" height="34" rx="5" fill="#fff" opacity=".35"/><circle cx="36" cy="37" r="5" fill="#fff"/></g>
    <rect x="48" y="16" width="24" height="34" rx="5" fill="#fff"/>
    <path d="M55 39 L60 30 L65 39 Z" fill="var(--base)"/><path d="M55 30 L60 21 L65 30 Z" fill="var(--base)" opacity=".0"/>
    <g transform="rotate(8 84 38)"><rect x="72" y="20" width="24" height="34" rx="5" fill="#fff" opacity=".35"/><rect x="78" y="28" width="5" height="5" fill="#fff"/><rect x="85" y="28" width="5" height="5" fill="#fff"/><rect x="81.5" y="36" width="5" height="5" fill="#fff"/></g>
    <text x="60" y="66" text-anchor="middle" font-size="12" fill="#fff" ${FONT}>?</text>`,
  mirror: () => `
    <path d="M18 54 C34 18 48 64 62 34 S88 16 102 36" ${S} stroke-width="9" opacity=".25"/>
    <path d="M18 54 C34 18 48 64 62 34 S88 16 102 36" ${S} stroke-width="1.2" stroke-dasharray="2 4" opacity=".7"/>
    <circle cx="62" cy="34" r="5.5" fill="#fff"/>
    ${arrow(30, 70, 'l', 7, 0.9)}${arrow(44, 70, 'r', 7, 0.45)}`,
  // The word names one colour and is printed in another, in the page's language.
  ink: (lang) => `
    <text x="60" y="38" text-anchor="middle" font-size="${lang === 'ka' ? 17 : 22}" fill="#FFD84D" ${FONT} letter-spacing="${lang === 'ka' ? 0 : 1}" stroke="#fff" stroke-width=".6">${lang === 'ka' ? 'წითელი' : 'RED'}</text>
    <rect x="26" y="50" width="20" height="13" rx="6.5" fill="#FF5C61"/>
    <rect x="50" y="50" width="20" height="13" rx="6.5" fill="#FFD84D" stroke="#fff" stroke-width="2"/>
    <rect x="74" y="50" width="20" height="13" rx="6.5" fill="#7D9BFF"/>`,
  towers: () => `
    <line x1="34" y1="20" x2="34" y2="62" ${S} stroke-width="2.2"/>
    <line x1="60" y1="32" x2="60" y2="62" ${S} stroke-width="2.2"/>
    <line x1="86" y1="44" x2="86" y2="62" ${S} stroke-width="2.2"/>
    <line x1="22" y1="63" x2="98" y2="63" ${S} stroke-width="2.6"/>
    <circle cx="34" cy="55" r="7" fill="#fff"/><circle cx="34" cy="41" r="7" fill="#fff" opacity=".6"/>
    <circle cx="60" cy="55" r="7" fill="#fff" opacity=".85"/><circle cx="86" cy="55" r="7" fill="#fff" opacity=".4"/>`,
  matrix: () => {
    let o = '';
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const x = 38 + c * 16;
        const y = 12 + r * 16;
        if (r === 2 && c === 2) {
          o += `<rect x="${x}" y="${y}" width="13" height="13" rx="3" ${S} stroke-width="1.3" stroke-dasharray="2 2"/><text x="${x + 6.5}" y="${y + 10}" text-anchor="middle" font-size="9" fill="#fff" ${FONT}>?</text>`;
        } else {
          o += `<rect x="${x}" y="${y}" width="13" height="13" rx="3" fill="#fff" opacity=".18"/>`;
          const n = c + 1;
          for (let k = 0; k < n; k++) {
            const cx = x + 6.5 + (k - (n - 1) / 2) * 3.6;
            o += r === 0 ? `<circle cx="${cx}" cy="${y + 6.5}" r="1.5" fill="#fff"/>` : r === 1 ? `<rect x="${cx - 1.4}" y="${y + 5.1}" width="2.8" height="2.8" fill="#fff"/>` : `<path d="M${cx - 1.6} ${y + 8} L${cx} ${y + 5} L${cx + 1.6} ${y + 8} Z" fill="#fff"/>`;
          }
        }
      }
    }
    return o;
  },
  spin: () => cube(52, 14, 9) + cube(61, 19.2, 9, 1) + cube(43, 19.2 + 10.4 - 5.2, 9, 0.98) + cube(52, 32, 9),
  navigator: () => `
    <path d="M24 60 L28 30 L32 60 Z" fill="#fff"/>
    <rect x="25" y="25" width="6" height="5" rx="1" fill="#fff"/>
    <path d="M18 27 L24 27 M32 27 L38 27" ${S} stroke-width="1.2" opacity=".6"/>
    <path d="M36 58 C56 66 64 30 84 36 S96 54 90 58" ${S} stroke-width="1.6" stroke-dasharray="2 4" opacity=".85"/>
    <path d="M86 52 L94 56 L86 60 Z" fill="#fff"/>`,
  scales: () => `
    <line x1="60" y1="16" x2="60" y2="62" ${S} stroke-width="2.4"/>
    <path d="M50 64 L70 64" ${S} stroke-width="3"/>
    <line x1="30" y1="24" x2="90" y2="16" ${S} stroke-width="2.4"/>
    <path d="M30 24 L22 40 L38 40 Z" ${S} stroke-width="1.2" opacity=".6"/>
    <path d="M90 16 L82 32 L98 32 Z" ${S} stroke-width="1.2" opacity=".6"/>
    <path d="M20 40 Q30 48 40 40 Z" fill="#fff"/><path d="M80 32 Q90 40 100 32 Z" fill="#fff" opacity=".7"/>
    <text x="30" y="37" text-anchor="middle" font-size="8" fill="#fff" ${FONT}>9</text><text x="90" y="29" text-anchor="middle" font-size="8" fill="#fff" ${FONT}>3×2</text>`,
  chain: () => {
    const items = ['12', '+7', '×2', '−4'];
    return items.map((t, i) => {
      const x = 22 + i * 26;
      return `<rect x="${x - 3}" y="${i === 0 ? 24 : 28}" width="24" height="${i === 0 ? 22 : 16}" rx="${i === 0 ? 7 : 8}" fill="#fff" opacity="${i === 0 ? 1 : 0.26}"/>
        <text x="${x + 9}" y="${i === 0 ? 39.5 : 39.5}" text-anchor="middle" font-size="${i === 0 ? 11 : 9.5}" fill="${i === 0 ? 'var(--deep)' : '#fff'}" ${FONT}>${t}</text>`;
    }).join('') + `<text x="60" y="66" text-anchor="middle" font-size="10" fill="#fff" ${FONT} opacity=".85">= ?</text>`;
  },
  target: () => `
    <circle cx="60" cy="36" r="24" ${S} stroke-width="1.4" opacity=".4"/>
    <circle cx="60" cy="36" r="16" ${S} stroke-width="1.6" opacity=".7"/>
    <circle cx="60" cy="36" r="10" fill="#fff"/>
    <text x="60" y="40" text-anchor="middle" font-size="10" fill="var(--deep)" ${FONT}>24</text>
    ${[['3', 20, 64], ['8', 44, 70], ['1', 76, 70], ['4', 100, 64]].map(([t, x, y]) => `<rect x="${x - 7}" y="${y - 9}" width="14" height="13" rx="4" fill="#fff" opacity=".3"/><text x="${x}" y="${y}" text-anchor="middle" font-size="8.5" fill="#fff" ${FONT}>${t}</text>`).join('')}`,
  pond: () => {
    const fish = (x, y, c, s = 1, flip = false) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})"><ellipse cx="0" cy="0" rx="6" ry="3.4" fill="${c}"/><path d="M5 0 L10 -3.5 L10 3.5 Z" fill="${c}"/></g>`;
    return [
      fish(30, 24, '#FFD84D'), fish(46, 34, '#FFD84D', 1, true), fish(36, 46, '#FFD84D'), fish(58, 22, '#FFD84D', 0.9),
      fish(52, 50, '#FFD84D', 1, true), fish(76, 30, '#7D9BFF', 1, true), fish(88, 46, '#7D9BFF'), fish(70, 52, '#7D9BFF', 0.9),
    ].join('');
  },
  anagram: () => ['O', 'W', 'R', 'D'].map((t, i) => {
    const x = 26 + i * 18;
    const y = i % 2 ? 26 : 22;
    return `<rect x="${x}" y="${y}" width="15" height="17" rx="4" fill="#fff" ${i === 1 ? 'opacity=".55"' : ''}/><text x="${x + 7.5}" y="${y + 12.5}" text-anchor="middle" font-size="11" fill="var(--deep)" ${FONT}>${t}</text>`;
  }).join('') + `<rect x="34" y="52" width="52" height="3" rx="1.5" fill="#fff" opacity=".5"/>`,
  outlier: () => [0, 1, 2, 3].map((i) => {
    const odd = i === 2;
    return `<rect x="${odd ? 40 : 30}" y="${14 + i * 12}" width="${odd ? 50 : 50}" height="8" rx="4" fill="#fff" opacity="${odd ? 1 : 0.38}"/>`;
  }).join('') + `<circle cx="98" cy="42" r="4.5" ${S} stroke-width="1.6"/>`,
  baskets: () => `
    <path d="M22 50 L28 66 L46 66 L52 50 Z" fill="#fff" opacity=".85"/><path d="M20 50 L54 50" ${S} stroke-width="2.4"/>
    <path d="M68 50 L74 66 L92 66 L98 50 Z" fill="#fff" opacity=".45"/><path d="M66 50 L100 50" ${S} stroke-width="2.4" opacity=".7"/>
    <path d="M66 26 Q48 16 40 40" ${S} stroke-width="1.2" stroke-dasharray="2 3" opacity=".7"/>
    <rect x="62" y="18" width="30" height="12" rx="6" fill="#fff"/><rect x="68" y="22.5" width="18" height="3" rx="1.5" fill="var(--base)"/>`,
  recall: () => `
    <rect x="34" y="20" width="44" height="30" rx="6" fill="#fff" opacity=".3" transform="rotate(-6 56 35)"/>
    <rect x="40" y="18" width="44" height="30" rx="6" fill="#fff"/>
    <rect x="47" y="27" width="24" height="4" rx="2" fill="var(--base)"/><rect x="47" y="35" width="16" height="4" rx="2" fill="var(--base)" opacity=".5"/>
    <circle cx="86" cy="50" r="9" fill="#fff"/><path d="M82 50 L85 53 L90.5 47" stroke="var(--deep)" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
};

const SCENES = {
  constellation: 'night', echo: 'hills', treasure: 'hills', signal: 'night', compass: 'dunes', fireflies: 'night', flight: 'dunes', brake: 'hills',
  glimpse: 'dunes', cipher: 'hills', trails: 'dunes', seek: 'hills', switch: 'hills', hunch: 'dunes', mirror: 'hills', ink: 'night',
  towers: 'skyline', matrix: 'hills', spin: 'dunes', navigator: 'sea', scales: 'hills', chain: 'dunes', target: 'hills', pond: 'sea',
  anagram: 'sea', outlier: 'hills', baskets: 'dunes', recall: 'hills',
};

export function gameArt(game, lang = 'en') {
  const skill = skillById[game.skill];
  const motif = MOTIFS[game.id] ? MOTIFS[game.id](lang) : '';
  return `<svg class="art" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"
    style="--base:${skill.night};--deep:${skill.deep}">
    <rect width="${W}" height="${H}" fill="var(--base)"/>
    ${scenery(game, SCENES[game.id] || 'hills')}
    <g class="art-motif">${motif}</g>
  </svg>`;
}
