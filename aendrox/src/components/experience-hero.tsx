// Enhanced globe with registered lighting and perspective-projected vector charts.

type P = [number, number];
const S = 3, OX = 470, OY = 62;
const at = ([x, y]: P): P => [(x - OX) * S, (y - OY) * S];

function homography(q: [P, P, P, P]) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / den, h = (dx1 * dy3 - dx3 * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + h * x3, d = y1 - y0 + g * y1, e = y3 - y0 + h * y3;
  return (u: number, v: number): P => { const w = g * u + h * v + 1; return [(a * u + b * v + x0) / w, (d * u + e * v + y0) / w]; };
}
const pts = (list: P[]) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

// Rounded panel outline in unit space, sampled so the corners survive the projection
function roundedOutline(map: (u: number, v: number) => P, ru: number, rv: number) {
  const out: P[] = [];
  const corner = (cu: number, cv: number, a0: number) => { for (let k = 0; k <= 6; k++) { const a = a0 + (k / 6) * Math.PI / 2; out.push(map(cu + Math.cos(a) * ru, cv + Math.sin(a) * rv)); } };
  corner(1 - ru, rv, -Math.PI / 2); corner(1 - ru, 1 - rv, 0); corner(ru, 1 - rv, Math.PI / 2); corner(ru, rv, Math.PI);
  return pts(out);
}
const quad = (map: (u: number, v: number) => P, u0: number, v0: number, u1: number, v1: number) => pts([map(u0, v0), map(u1, v0), map(u1, v1), map(u0, v1)]);

const PANELS: { id: 'bars' | 'line'; quad: [P, P, P, P] }[] = [
  { id: 'bars', quad: [[502.5, 114], [582.5, 130], [584, 211], [501, 210]] },
  { id: 'line', quad: [[827.5, 171], [897.5, 157.5], [900, 241], [827.5, 237.5]] },
];
const BARS = [.26, .48, .42, .34, .7, .5, .38, .62];
const LINE = [.72, .64, .7, .55, .6, .48, .58, .4, .5, .33, .44, .26, .38, .2];

function Panel({ id, q }: { id: 'bars' | 'line'; q: [P, P, P, P] }) {
  const map = homography(q.map(at) as [P, P, P, P]);
  return (
    <g>
      <polygon points={roundedOutline(map, .07, .07)} fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="10" filter="url(#xhBloom)" />
      <polygon points={roundedOutline(map, .07, .07)} fill="url(#xhGlass)" stroke="url(#xhRim)" strokeWidth="3" />
      <polyline points={pts([map(.08, .045), map(.92, .045)])} stroke="#fff" strokeOpacity=".55" strokeWidth="1.5" fill="none" />
      <polygon points={quad(map, .1, .12, .42, .15)} fill="#f2f5f9" opacity=".75" />
      {id === 'bars' ? <>
        {[.22, .29, .36].map((v, i) => <polygon key={v} points={quad(map, .1, v, .1 + [.7, .55, .62][i], v + .022)} fill="#f2f5f9" opacity={.35 - i * .06} />)}
        {BARS.map((hgt, i) => { const u0 = .12 + i * .097; return <polygon className="globe-chart-bar" style={{ animationDelay: `${-i * .4}s` }} key={i} points={quad(map, u0, .9 - hgt * .5, u0 + .058, .9)} fill="#f4f7fb" opacity={.75 + hgt * .3} />; })}
        <polyline points={pts([map(.08, .91), map(.92, .91)])} stroke="#fff" strokeOpacity=".4" strokeWidth="1.4" fill="none" />
      </> : <>
        {[.35, .55, .75].map((v) => <polyline key={v} points={pts([map(.08, v), map(.92, v)])} stroke="#fff" strokeOpacity=".08" strokeWidth="1.2" fill="none" />)}
        <polyline className="globe-chart-line" pathLength="100" points={pts(LINE.map((v, i) => map(.08 + i * (.84 / (LINE.length - 1)), v)))} stroke="#f6f9fc" strokeWidth="3" strokeLinejoin="round" fill="none" filter="url(#xhGlow)" />
        <polyline points={pts([map(.08, .86), map(.92, .86)])} stroke="#fff" strokeOpacity=".4" strokeWidth="1.4" fill="none" />
      </>}
    </g>
  );
}

export function ExperienceHeroVisual() {
  return (
    <div className="experience-hero-visual">
      <picture>
        <source srcSet="/assets/experience/globe-enhanced.webp" type="image/webp" />
        <img src="/assets/experience/globe-enhanced.png" alt="Glowing digital globe with orbit rings above a light platform, flanked by floating analytics panels" width="1714" height="918" fetchPriority="high" decoding="async" />
      </picture>
      <div className="globe-light globe-orbit-light" aria-hidden="true" />
      <div className="globe-light globe-base-light" aria-hidden="true" />
      <div className="globe-light globe-scan-light" aria-hidden="true" />
      <svg className="experience-hero-fx" viewBox="0 0 1401 750" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="xhGlass" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stopColor="#2b2e34" stopOpacity=".9" /><stop offset=".6" stopColor="#121417" stopOpacity=".9" /><stop offset="1" stopColor="#0a0b0d" stopOpacity=".92" /></linearGradient>
          <linearGradient id="xhRim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" /><stop offset=".5" stopColor="#9aa1ab" /><stop offset="1" stopColor="#e9edf2" /></linearGradient>
          <filter id="xhBloom" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="8" /></filter>
          <filter id="xhGlow" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <g className="experience-hero-panels">{PANELS.map((p) => <Panel key={p.id} id={p.id} q={p.quad} />)}</g>
      </svg>
    </div>
  );
}

