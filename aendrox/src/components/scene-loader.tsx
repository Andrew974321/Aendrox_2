'use client';
import dynamic from 'next/dynamic';
const Scene=dynamic(()=>import('./scene'),{ssr:false,loading:()=> <div className="three-scene"><span className="eyebrow">LOADING CONSTELLATION…</span></div>});
export default Scene;
