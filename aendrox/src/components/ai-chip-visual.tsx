const S = 3, OX = 552, OY = 64;
const GLOW = [(856 - OX) * S, (226 - OY) * S];

// Floating icon cards and the "AI" lettering, redrawn as vectors (geometry: tools/services-chip-geometry.json)
const CARDS = [
  { id: 'code', tl: [660.8, 104.2], w: 62.5, h: 52.5, slope: .24 },
  { id: 'browser', tl: [595.5, 201.2], w: 75, h: 57.5, slope: .121 },
  { id: 'chart', tl: [966.3, 115.3], w: 68.4, h: 54.2, slope: -.219 },
  { id: 'cloud', tl: [1029.2, 210.3], w: 67.5, h: 52, slope: .124 },
] as const;
const uv = (x: number, y: number) => { const l = Math.hypot(x, y); return [x / l, y / l]; };
const [Ux, Uy] = uv(156, 75), [Vx, Vy] = uv(163, -75);
const AI_MATRIX = `matrix(${(Vx * S).toFixed(4)} ${(Vy * S).toFixed(4)} ${(Ux * S).toFixed(4)} ${(Uy * S).toFixed(4)} ${((837.2 - OX) * S).toFixed(1)} ${((247.1 - OY) * S).toFixed(1)})`;
const A_PATH = 'M0 0 L11 0 L15.2 -12.5 L36.8 -12.5 L41 0 L52 0 L31.5 -58 L20.5 -58 Z M18.6 -22.5 L33.4 -22.5 L26 -44.5 Z';
const I_PATH = 'M56 -58 L80 -58 L80 -50 L73.5 -50 L73.5 -8 L80 -8 L80 0 L56 0 L56 -8 L62.5 -8 L62.5 -50 L56 -50 Z';

function CardIcon({ id, w, h }: { id: string; w: number; h: number }) {
  const cx = w / 2, cy = h / 2, sw = 3.4;
  const common = { fill: 'none', stroke: '#f5f8fc', strokeWidth: sw, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (id === 'code') return <g transform={`translate(${cx - 54} ${cy - 54}) scale(4.5)`} {...common} strokeWidth={sw / 4.5}><path d="m18 16 4-4-4-4" /><path d="m6 8-4 4 4 4" /><path d="m14.5 4-5 16" /></g>;
  if (id === 'cloud') return <g transform={`translate(${cx - 66} ${cy - 66}) scale(5.5)`} {...common} strokeWidth={sw / 5.5}><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" /></g>;
  if (id === 'chart') {
    const bars = [[-58, 26], [-30, 44], [-2, 28], [26, 58], [54, 72]];
    return <g transform={`translate(${cx} ${cy + 46})`}>
      {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={-80} cy={-8 - i * 15} r="2.6" fill="#f5f8fc" opacity={i ? .9 : 1} />)}
      <line x1={-80} y1={0} x2={-80} y2={-4} {...common} />
      {bars.map(([x, hgt], i) => <rect key={i} x={x} y={-hgt * 1.2} width={20} height={hgt * 1.2} rx={2} fill="#f5f8fc" />)}
    </g>;
  }
  // browser window
  return <g transform={`translate(${cx - 84} ${cy - 66})`}>
    {[0, 1, 2].map((i) => <rect key={i} x={10 + i * 12} y={6} width={7} height={7} rx={1.5} fill="#f5f8fc" opacity=".85" />)}
    {[0, 1].map((i) => <rect key={i} x={146 + i * 11} y={26} width={6} height={6} rx={1.2} fill="#f5f8fc" opacity=".75" />)}
    <line x1={6} y1={20} x2={168} y2={20} stroke="#f5f8fc" strokeOpacity=".35" strokeWidth="2" />
    <rect x={18} y={36} width={150} height={20} rx={4} fill="#f5f8fc" opacity=".92" />
    <rect x={18} y={68} width={58} height={50} rx={2} {...common} />
    {[72, 86, 100, 114, 128].map((y, i) => <line key={y} x1={94} y1={y} x2={i === 4 ? 116 : i === 3 ? 140 : 160} y2={y} {...common} />)}
    <line x1={166} y1={66} x2={166} y2={128} {...common} strokeWidth="2.6" />
  </g>;
}

function GlassCard({ c }: { c: (typeof CARDS)[number] }) {
  const x = (c.tl[0] - OX) * S, y = (c.tl[1] - OY) * S, w = c.w * S, h = c.h * S;
  return <g transform={`matrix(1 ${c.slope} 0 1 ${x.toFixed(1)} ${y.toFixed(1)})`}>
    <rect width={w} height={h} rx="20" fill="none" stroke="#ffffff" strokeOpacity=".5" strokeWidth="10" filter="url(#cardBloom)" />
    <rect width={w} height={h} rx="20" fill="url(#cardGlass)" stroke="url(#cardRim)" strokeWidth="3.2" />
    <rect x="7" y="7" width={w - 14} height={h - 14} rx="15" fill="none" stroke="#ffffff" strokeOpacity=".07" strokeWidth="1.5" />
    <path d={`M20 3 H${w - 20}`} stroke="#ffffff" strokeOpacity=".55" strokeWidth="1.5" strokeLinecap="round" />
    <CardIcon id={c.id} w={w} h={h} />
  </g>;
}


export function AiChipVisual() {
  return (
    <div className="ai-chip-visual">
      <picture>
        <source srcSet="/assets/services/ai-chip-enhanced.webp" type="image/webp" />
        <img src="/assets/services/ai-chip-enhanced.png" alt="Glowing AI processor on a circuit board surrounded by floating code, browser, analytics and cloud icons" width="1714" height="918" fetchPriority="high" decoding="async" />
      </picture>
      <div className="chip-art-light chip-art-sweep" aria-hidden="true" />
      <div className="chip-art-light chip-art-beams" aria-hidden="true" />
      <svg className="ai-chip-fx" viewBox="0 0 1839 984" aria-hidden="true" focusable="false">
        <defs>
          <filter id="chipGlow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3.2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <radialGradient id="chipCore"><stop offset="0" stopColor="#7cc0ff" stopOpacity=".55" /><stop offset=".45" stopColor="#2f8cff" stopOpacity=".2" /><stop offset="1" stopColor="#1a6dff" stopOpacity="0" /></radialGradient>
          <linearGradient id="cardGlass" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stopColor="#2a2e35" stopOpacity=".96" /><stop offset=".55" stopColor="#14161a" stopOpacity=".94" /><stop offset="1" stopColor="#0b0c0f" stopOpacity=".95" /></linearGradient>
          <linearGradient id="cardRim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset=".45" stopColor="#9aa1ab" /><stop offset=".75" stopColor="#5d636c" /><stop offset="1" stopColor="#e9edf2" /></linearGradient>
          <filter id="cardBloom" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9" /></filter>
          <filter id="aiGlow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2.2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <linearGradient id="beamFade" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#bfe2ff" /><stop offset="1" stopColor="#4aa5ff" stopOpacity="0" /></linearGradient>
        </defs>

        <ellipse className="chip-core-glow" cx={GLOW[0]} cy={GLOW[1]} rx="250" ry="150" fill="url(#chipCore)" />

        <g className="chip-ai" transform={AI_MATRIX}>
          <path d={A_PATH + ' ' + I_PATH} fillRule="evenodd" fill="#cfe6ff" opacity=".55" filter="url(#cardBloom)" />
          <path d={A_PATH + ' ' + I_PATH} fillRule="evenodd" fill="#f7fbff" filter="url(#aiGlow)" />
        </g>


      </svg>
      <svg className="ai-chip-cards" viewBox="0 0 1839 984" aria-hidden="true" focusable="false">
        <g className="chip-cards">{CARDS.map((c) => <GlassCard key={c.id} c={c} />)}</g>
      </svg>
    </div>
  );
}

