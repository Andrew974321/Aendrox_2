import type { CSSProperties } from 'react';

// Separate wave ribbons flow only through the empty space beside the portrait.
// CSS morphs matching cubic paths; reduced-motion keeps the static dotted ribbons.
export function SkillsVisual() {
  return <div className="skills-hero-visual">
    <picture>
      <source srcSet="/assets/skills/android-head-enhanced.webp" type="image/webp" />
      <img src="/assets/skills/android-head-enhanced.png" alt="Detailed chrome android in profile surrounded by flowing silver particle waves" width="1713" height="918" fetchPriority="high" decoding="async" />
    </picture>
    <svg className="skills-particle-waves" viewBox="0 0 1713 918" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="skillsWaveLeft"><stop stopColor="white" stopOpacity="0"/><stop offset=".3" stopColor="#e5efff" stopOpacity=".8"/><stop offset=".75" stopColor="white" stopOpacity=".65"/><stop offset="1" stopColor="white" stopOpacity="0"/></linearGradient>
        <linearGradient id="skillsWaveRight"><stop stopColor="white" stopOpacity="0"/><stop offset=".2" stopColor="#e5efff" stopOpacity=".75"/><stop offset=".65" stopColor="white" stopOpacity=".8"/><stop offset="1" stopColor="white" stopOpacity="0"/></linearGradient>
      </defs>
      {Array.from({length:16},(_,i)=>{
        const a=`M0 ${475+i*13} C240 ${350+i*18} 290 ${750-i*7} 725 ${690+i*3}`;
        const b=`M0 ${530+i*10} C200 ${650-i*12} 400 ${430+i*17} 725 ${690+i*3}`;
        const c=`M1130 ${610+i*5} C1320 ${450+i*14} 1480 ${780-i*16} 1713 ${520+i*13}`;
        const d=`M1130 ${610+i*5} C1350 ${730-i*12} 1500 ${330+i*17} 1713 ${520+i*13}`;
        const style=(from:string,to:string)=>({'--wave-from':`path('${from}')`,'--wave-to':`path('${to}')`,'--wave-delay':`${-i*.14}s`,opacity:.32+Math.sin(i/15*Math.PI)*.55} as CSSProperties);
        return <g key={i}>
          <path className="skills-wave" d={a} stroke="url(#skillsWaveLeft)" style={style(a,b)}/>
          <path className="skills-wave" d={c} stroke="url(#skillsWaveRight)" style={style(c,d)}/>
        </g>;
      })}
    </svg>
  </div>;
}
