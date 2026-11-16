import { ChevronRight } from 'lucide-react';
import { experience } from '@/lib/data';

// HD discipline timeline for the Experience page: each discipline has an SVG icon standing on a
// glowing isometric platform (all vector, so it stays sharp at any size).

const CX = 110, CY = 128, HW = 80, HH = 30, T = 11; // platform centre, half-width, half-height, thickness

function Platform() {
  const top = `${CX},${CY - HH} ${CX + HW},${CY} ${CX},${CY + HH} ${CX - HW},${CY}`;
  const left = `${CX - HW},${CY} ${CX},${CY + HH} ${CX},${CY + HH + T} ${CX - HW},${CY + T}`;
  const right = `${CX + HW},${CY} ${CX},${CY + HH} ${CX},${CY + HH + T} ${CX + HW},${CY + T}`;
  return (
    <g>
      <ellipse cx={CX} cy={CY + HH + 12} rx={HW + 6} ry="10" fill="url(#dxFloor)" />
      <polygon points={left} fill="url(#dxSideL)" />
      <polygon points={right} fill="url(#dxSideR)" />
      <polyline points={`${CX - HW},${CY + T} ${CX},${CY + HH + T} ${CX + HW},${CY + T}`} fill="none" stroke="#fff" strokeOpacity=".9" strokeWidth="1.6" filter="url(#dxGlow)" />
      <polygon points={top} fill="url(#dxTop)" stroke="#fff" strokeOpacity=".85" strokeWidth="1.4" />
      <polygon points={`${CX},${CY - HH + 9} ${CX + HW - 22},${CY} ${CX},${CY + HH - 9} ${CX - HW + 22},${CY}`} fill="none" stroke="#fff" strokeOpacity=".18" />
      <ellipse cx={CX} cy={CY + HH + T - 1} rx="22" ry="4" fill="#fff" filter="url(#dxGlow)" />
    </g>
  );
}

const glyph = { fill: 'none', stroke: '#f7f9fc', strokeWidth: 3.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

function Glyph({ index }: { index: number }) {
  switch (index) {
    case 0: return ( // glass screen with </>
      <g transform="translate(110 72) skewY(14)">
        <rect x="-38" y="-44" width="76" height="62" rx="8" fill="url(#dxGlass)" stroke="#fff" strokeOpacity=".85" strokeWidth="1.6" />
        <g {...glyph} strokeWidth="2.8"><path d="M-14 -24 l-9 9 9 9" /><path d="M14 -24 l9 9 -9 9" /><path d="M5 -30 l-10 30" /></g>
        <rect x="-38" y="18" width="76" height="8" rx="3" fill="#dfe3e9" opacity=".75" />
      </g>);
    case 1: return ( // shield with check
      <g transform="translate(110 70)">
        <path d="M0 -50 L36 -38 V-6 C36 20 18 36 0 46 C-18 36 -36 20 -36 -6 V-38 Z" fill="url(#dxGlass)" stroke="#fff" strokeWidth="2.4" />
        <path d="M0 -42 L28 -32 V-6 C28 14 14 28 0 36" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth="1.4" />
        <path d="M-15 -2 l10 11 20 -22" {...glyph} strokeWidth="4.2" />
      </g>);
    case 2: { // gears
      const gear = (r: number, teeth: number) => { const d: string[] = []; for (let i = 0; i < teeth * 2; i++) { const a = (i / (teeth * 2)) * Math.PI * 2, rr = i % 2 ? r : r * 1.22; d.push(`${(Math.cos(a) * rr).toFixed(1)},${(Math.sin(a) * rr).toFixed(1)}`); } return d.join(' '); };
      return (
        <g>
          <g transform="translate(96 68)"><polygon points={gear(28, 10)} fill="url(#dxMetal)" stroke="#fff" strokeOpacity=".6" strokeWidth="1.2" strokeLinejoin="round" /><circle r="11" fill="#0d0e11" stroke="#fff" strokeOpacity=".7" strokeWidth="1.4" /></g>
          <g transform="translate(140 96)"><polygon points={gear(15, 8)} fill="url(#dxMetal)" stroke="#fff" strokeOpacity=".6" strokeWidth="1.1" strokeLinejoin="round" /><circle r="6" fill="#0d0e11" stroke="#fff" strokeOpacity=".7" /></g>
        </g>);
    }
    case 3: return ( // stacked layers
      <g>{[0, 1, 2].map((k) => { const y = 66 + k * 18, hw = 52, hh = 20; return (
        <g key={k}>
          <polygon points={`${CX - hw},${y} ${CX},${y + hh} ${CX},${y + hh + 7} ${CX - hw},${y + 7}`} fill="#2a2d33" />
          <polygon points={`${CX + hw},${y} ${CX},${y + hh} ${CX},${y + hh + 7} ${CX + hw},${y + 7}`} fill="#15171a" />
          <polygon points={`${CX},${y - hh} ${CX + hw},${y} ${CX},${y + hh} ${CX - hw},${y}`} fill="url(#dxTop)" stroke="#fff" strokeOpacity=".9" strokeWidth="1.3" />
        </g>); })}</g>);
    case 4: return ( // AI chip tile
      <g transform="translate(110 76)">
        <g transform="matrix(.87 -.5 .87 .5 0 0)">
          {Array.from({ length: 7 }, (_, i) => -27 + i * 9).map((p) => <g key={p} stroke="#fff" strokeOpacity=".7" strokeWidth="2"><line x1={p} y1="-40" x2={p} y2="-48" /><line x1={p} y1="40" x2={p} y2="48" /><line x1="-40" y1={p} x2="-48" y2={p} /><line x1="40" y1={p} x2="48" y2={p} /></g>)}
          <rect x="-40" y="-40" width="80" height="80" rx="10" fill="url(#dxGlass)" stroke="#fff" strokeWidth="2" />
          <text x="0" y="12" textAnchor="middle" fontSize="34" fontWeight="700" fill="#f7f9fc" fontFamily="Inter, Arial, sans-serif">AI</text>
        </g>
      </g>);
    default: return ( // cloud with sync arrows
      <g transform="translate(110 70)">
        <path d="M-40 26 H38 a22 22 0 0 0 -2 -44 a30 30 0 0 0 -56 -6 a24 24 0 0 0 -20 50 Z" fill="url(#dxGlass)" stroke="#fff" strokeWidth="2.6" strokeLinejoin="round" />
        <g {...glyph} strokeWidth="3.4"><path d="M-8 14 V-12 M-16 -4 l8 -8 8 8" /><path d="M10 -12 V14 M2 6 l8 8 8 -8" /></g>
      </g>);
  }
}

function DisciplineIcon({ index }: { index: number }) {
  return (
    <svg className="discipline-icon" viewBox="0 0 220 190" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="dxTop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5d626b" /><stop offset=".45" stopColor="#24272c" /><stop offset="1" stopColor="#101114" /></linearGradient>
        <linearGradient id="dxSideL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3b3f46" /><stop offset="1" stopColor="#141518" /></linearGradient>
        <linearGradient id="dxSideR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#202227" /><stop offset="1" stopColor="#0b0c0e" /></linearGradient>
        <linearGradient id="dxGlass" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stopColor="#4a4e56" stopOpacity=".9" /><stop offset=".5" stopColor="#1b1d21" stopOpacity=".92" /><stop offset="1" stopColor="#0c0d0f" stopOpacity=".95" /></linearGradient>
        <linearGradient id="dxMetal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f1f3f6" /><stop offset=".4" stopColor="#8d939c" /><stop offset=".7" stopColor="#3c4047" /><stop offset="1" stopColor="#c9cdd3" /></linearGradient>
        <radialGradient id="dxFloor"><stop offset="0" stopColor="#fff" stopOpacity=".35" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
        <filter id="dxGlow" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="2.4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <Platform />
      <g className="discipline-glyph" filter="url(#dxGlow)"><Glyph index={index} /></g>
    </svg>
  );
}

export function ExperienceTimeline() {
  return (
    <div className="discipline-timeline">
      {experience.map((e, i) => (
        <article key={e.title} className="discipline">
          <DisciplineIcon index={i} />
          <span className="discipline-dot" aria-hidden="true" />
          <div className="discipline-body">
            <span className="discipline-label">DISCIPLINE / 0{i + 1}</span>
            <h2>{e.title}</h2>
            <p>{e.responsibilities}</p>
            <div className="discipline-pills"><span>Organization to be supplied <ChevronRight size={13} aria-hidden="true" /></span><span>Role &amp; dates to be supplied <ChevronRight size={13} aria-hidden="true" /></span></div>
          </div>
        </article>
      ))}
    </div>
  );
}
