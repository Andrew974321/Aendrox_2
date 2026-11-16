// Enhanced artwork with registered light sweeps and crisp floating vector cards.

const S = 3, OX = 378, OY = 66;
const CARDS = [
  { id: 'code', tl: [549.5, 87.5], w: 64, h: 55, slope: .24 },
  { id: 'chart', tl: [863, 110], w: 68.5, h: 55, slope: -.28 },
  { id: 'people', tl: [874.5, 202.5], w: 63, h: 59, slope: -.08 },
] as const;
const CORE = [(742 - OX) * S, (178 - OY) * S];

function CardIcon({ id, w, h }: { id: string; w: number; h: number }) {
  const cx = w / 2, cy = h / 2;
  const line = { fill: 'none', stroke: '#f5f7fa', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (id === 'code') return <g transform={`translate(${cx - 56} ${cy - 56}) scale(4.66)`} {...line} strokeWidth={.75}><path d="m18 16 4-4-4-4" /><path d="m6 8-4 4 4 4" /><path d="m14.5 4-5 16" /></g>;
  if (id === 'chart') {
    const bars = [24, 40, 34, 58, 78];
    return <g>
      <rect x={22} y={22} width={46} height={5} rx={2.5} fill="#f5f7fa" opacity=".55" />
      <rect x={22} y={32} width={28} height={4} rx={2} fill="#f5f7fa" opacity=".3" />
      {bars.map((b, i) => <rect key={i} x={42 + i * 26} y={h - 30 - b * 1.2} width={17} height={b * 1.2} rx={2} fill="#f5f7fa" opacity={.82 + i * .04} />)}
    </g>;
  }
  return <g transform={`translate(${cx} ${cy + 6})`} fill="#f5f7fa">
    <circle cx={-18} cy={-26} r={16} opacity=".95" />
    <path d="M-50 30 a32 30 0 0 1 64 0 v6 h-64 Z" opacity=".95" />
    <circle cx={24} cy={-30} r={13} opacity=".7" />
    <path d="M18 26 a28 26 0 0 0 -6 -18 a26 24 0 0 1 40 22 v6 h-34 Z" opacity=".7" />
  </g>;
}

function GlassCard({ c }: { c: (typeof CARDS)[number] }) {
  const x = (c.tl[0] - OX) * S, y = (c.tl[1] - OY) * S, w = c.w * S, h = c.h * S;
  return <g transform={`matrix(1 ${c.slope} 0 1 ${x.toFixed(1)} ${y.toFixed(1)})`}>
    <rect width={w} height={h} rx="22" fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="10" filter="url(#phBloom)" />
    <rect width={w} height={h} rx="22" fill="url(#phGlass)" stroke="url(#phRim)" strokeWidth="3.2" />
    <rect x="8" y="8" width={w - 16} height={h - 16} rx="16" fill="none" stroke="#fff" strokeOpacity=".07" strokeWidth="1.5" />
    <path d={`M22 3 H${w - 22}`} stroke="#fff" strokeOpacity=".6" strokeWidth="1.6" strokeLinecap="round" />
    <CardIcon id={c.id} w={w} h={h} />
  </g>;
}

export function ProjectsHeroVisual() {
  return (
    <div className="projects-hero-visual">
      <picture>
        <source srcSet="/assets/projects/hand-crystal-enhanced.webp" type="image/webp" />
        <img src="/assets/projects/hand-crystal-enhanced.png" alt="Robotic hand reaching toward a glowing crystal above a light platform, with floating code, analytics and team icons" width="1897" height="829" fetchPriority="high" decoding="async" />
      </picture>
      <div className="project-light project-orbit-light" aria-hidden="true" />
      <div className="project-light project-platform-light" aria-hidden="true" />
      <div className="project-light project-crystal-light" aria-hidden="true" />
      <svg className="projects-hero-fx" viewBox="0 0 1896 828" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="phGlass" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stopColor="#2c2f35" stopOpacity=".97" /><stop offset=".55" stopColor="#15171b" stopOpacity=".95" /><stop offset="1" stopColor="#0b0c0f" stopOpacity=".96" /></linearGradient>
          <linearGradient id="phRim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" /><stop offset=".45" stopColor="#9aa1ab" /><stop offset=".75" stopColor="#5d636c" /><stop offset="1" stopColor="#e9edf2" /></linearGradient>
          <radialGradient id="phCore"><stop offset="0" stopColor="#fff" stopOpacity=".5" /><stop offset=".35" stopColor="#dfe8f5" stopOpacity=".16" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
          <filter id="phBloom" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9" /></filter>
        </defs>
        <ellipse className="crystal-core" cx={CORE[0]} cy={CORE[1]} rx="150" ry="150" fill="url(#phCore)" />
        <g className="projects-hero-cards">{CARDS.map((c) => <GlassCard key={c.id} c={c} />)}</g>
      </svg>
    </div>
  );
}


