'use client';

import { useId } from 'react';

// All moving surfaces use pixels from the supplied emblem, never substitute gears.
// The upper gears are partially covered by the A. Repeat their unobscured half
// behind that foreground so the letter cannot rotate into view with the gear.
const gears = [
  { x: 704, y: 282, r: 51, seconds: 22, half: 'left', reverse: false },
  { x: 894, y: 281, r: 51, seconds: 22, half: 'right', reverse: true },
  { x: 642, y: 391, r: 37, seconds: 16, half: 'left', reverse: true },
  { x: 800, y: 499, r: 80, seconds: 34, half: 'full', reverse: false },
];

export function RotatingEmblem() {
  const id = `gear-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return <svg className="hero-emblem original-gear-emblem" viewBox="0 0 1600 759" preserveAspectRatio="xMidYMid slice" role="img" aria-label="AENDROX silver mechanical A emblem with rotating original gears">
    <defs>
      {gears.map((gear, index) => <g key={index}>
        <clipPath id={`${id}-disc-${index}`}><circle r={gear.r}/></clipPath>
        <clipPath id={`${id}-half-${index}`}><rect x={gear.half === 'right' ? 0 : -gear.r} y={-gear.r} width={gear.r} height={gear.r * 2}/></clipPath>
        <g id={`${id}-texture-${index}`} clipPath={`url(#${id}-half-${index})`}>
          <image href="/assets/emblem.webp" x={-gear.x} y={-gear.y} width="1600" height="759"/>
        </g>
      </g>)}
      <mask id={`${id}-foreground`} maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="759">
        <rect width="1600" height="759" fill="white"/>
        <path d="M800 153 L1006 500 L880 500 L900 480 L800 296 L697 477 L720 500 L594 500 Z" fill="black"/>
        <path d="M593 500 Q747 326 955 352 Q814 341 593 500 M886 319 Q1040 318 988 390 L959 405 Q1033 333 886 326 Z" fill="black"/>
        <path d="M669 215 L689 253 M620 257 L651 343 M928 216 L909 250 M976 258 L945 321" fill="none" stroke="black" strokeWidth="19"/>
      </mask>
    </defs>
    <image href="/assets/emblem.webp" width="1600" height="759"/>
    <g mask={`url(#${id}-foreground)`} className="original-gear-layers">
      {gears.map((gear, index) => <g key={index} transform={`translate(${gear.x} ${gear.y})`}>
        <g clipPath={`url(#${id}-disc-${index})`}>
          <g className="original-gear-rotation" style={{ animationDuration: `${gear.seconds}s`, animationDirection: gear.reverse ? 'reverse' : 'normal' }}>
            {gear.half === 'full'
              ? <image href="/assets/emblem.webp" x={-gear.x} y={-gear.y} width="1600" height="759"/>
              : <><use href={`#${id}-texture-${index}`}/><use href={`#${id}-texture-${index}`} transform="rotate(180)"/></>}
          </g>
        </g>
      </g>)}
    </g>
  </svg>;
}
