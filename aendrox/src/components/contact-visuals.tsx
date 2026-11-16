export { default as AssistantVisual } from './robot-video';

// Contact page artwork. The gear and robot images come from tools/build-contact-art.cjs (geometry in
// tools/contact-art-geometry.json); the floating cards and the assistant chat window are redrawn as
// SVG/HTML so they stay sharp at any size.

const S = 3, OX = 605, OY = 82; // gear image: 1788x780
type Card = { id: 'chat' | 'code' | 'layers' | 'chart'; tl: [number, number]; w: number; h: number; slope: number };
const CARDS: Card[] = [
  { id: 'chat', tl: [707.5, 107.5], w: 62.5, h: 52.5, slope: -.136 },
  { id: 'code', tl: [1022.5, 100], w: 57.5, h: 50, slope: .26 },
  { id: 'layers', tl: [692.5, 230], w: 55, h: 52.5, slope: .227 },
  { id: 'chart', tl: [1020, 235], w: 55, h: 52.5, slope: -.227 },
];

function CardIcon({ id, w, h }: { id: Card['id']; w: number; h: number }) {
  const cx = w / 2, cy = h / 2;
  const line = { fill: 'none', stroke: '#f5f7fa', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (id === 'chat') return <g fill="#f5f7fa">{[-22, 0, 22].map((dx) => <circle key={dx} cx={cx + dx} cy={cy - 2} r="7" />)}</g>;
  if (id === 'code') return <g transform={`translate(${cx - 50} ${cy - 50}) scale(4.17)`} {...line} strokeWidth={.8}><path d="m18 16 4-4-4-4" /><path d="m6 8-4 4 4 4" /><path d="m14.5 4-5 16" /></g>;
  if (id === 'layers') return <g transform={`translate(${cx} ${cy + 4})`} {...line} strokeWidth="3.4">{[-16, 0, 16].map((dy) => <path key={dy} d={`M-30 ${dy - 8} L0 ${dy + 6} L30 ${dy - 8} L0 ${dy - 22} Z`} fill={dy === -16 ? '#f5f7fa22' : 'none'} />)}</g>;
  return <g transform={`translate(${cx - 46} ${cy + 36})`} fill="#f5f7fa">{[22, 34, 48, 64].map((b, i) => <rect key={i} x={i * 26} y={-b} width="16" height={b} rx="2" opacity={.8 + i * .06} />)}<path d="M2 -40 Q30 -58 52 -50 T96 -70" fill="none" stroke="#f5f7fa" strokeWidth="2.4" opacity=".6" /></g>;
}

function GlassCard({ c }: { c: Card }) {
  const x = (c.tl[0] - OX) * S, y = (c.tl[1] - OY) * S, w = c.w * S, h = c.h * S;
  return <g transform={`matrix(1 ${c.slope} 0 1 ${x.toFixed(1)} ${y.toFixed(1)})`}>
    <rect width={w} height={h} rx="22" fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="10" filter="url(#ctBloom)" />
    {c.id === 'chat' && <path d={`M${w - 46} ${h - 4} L${w - 14} ${h + 30} L${w - 22} ${h - 4} Z`} fill="url(#ctGlass)" stroke="url(#ctRim)" strokeWidth="3" strokeLinejoin="round" />}
    <rect width={w} height={h} rx="22" fill="url(#ctGlass)" stroke="url(#ctRim)" strokeWidth="3.2" />
    <rect x="8" y="8" width={w - 16} height={h - 16} rx="16" fill="none" stroke="#fff" strokeOpacity=".07" strokeWidth="1.5" />
    <path d={`M22 3 H${w - 22}`} stroke="#fff" strokeOpacity=".6" strokeWidth="1.6" strokeLinecap="round" />
    <CardIcon id={c.id} w={w} h={h} />
  </g>;
}

export function ContactHeroVisual() {
  return (
    <div className="contact-hero-visual">
      <picture>
        <source srcSet="/assets/contact/gear-enhanced.webp" type="image/webp" />
        <img src="/assets/contact/gear-enhanced.png" alt="Chrome gear with an AI chip at its centre, orbited by light rings above a glowing platform" width="1898" height="829" fetchPriority="high" decoding="async" />
      </picture>
      <div className="contact-gear-light" aria-hidden="true" />
      <svg className="contact-hero-fx" viewBox="0 0 1788 780" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="ctGlass" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stopColor="#2c2f35" stopOpacity=".97" /><stop offset=".55" stopColor="#15171b" stopOpacity=".95" /><stop offset="1" stopColor="#0b0c0f" stopOpacity=".96" /></linearGradient>
          <linearGradient id="ctRim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" /><stop offset=".45" stopColor="#9aa1ab" /><stop offset=".75" stopColor="#5d636c" /><stop offset="1" stopColor="#e9edf2" /></linearGradient>
          <filter id="ctBloom" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9" /></filter>
        </defs>
        <g className="contact-hero-cards">{CARDS.map((c) => <GlassCard key={c.id} c={c} />)}</g>
      </svg>
    </div>
  );
}


