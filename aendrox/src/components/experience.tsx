'use client';
import { useEffect,useRef,useState } from 'react';
import { Play, ArrowUpRight, ArrowDown, X } from 'lucide-react';
import Link from 'next/link';
import { RotatingEmblem } from './rotating-emblem';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
export function Intro(){
 const [show,setShow]=useState(false);const [progress,setProgress]=useState(0);const video=useRef<HTMLVideoElement>(null);const skip=useRef<HTMLButtonElement>(null);
 const close=()=>{setShow(false);try{sessionStorage.setItem('aendrox-intro','seen')}catch{}};
 useEffect(()=>{let seen=false;try{seen=!!sessionStorage.getItem('aendrox-intro')}catch{}if(!seen&&!matchMedia('(prefers-reduced-motion: reduce), (max-width: 600px)').matches)setShow(true)},[]);
 useEffect(()=>{if(!show)return;skip.current?.focus();const old=document.body.style.overflow;document.body.style.overflow='hidden';const timer=setTimeout(close,10500);return()=>{document.body.style.overflow=old;clearTimeout(timer)}},[show]);
 if(!show)return null;
 return <div className="intro" role="dialog" aria-modal="true" aria-label="AENDROX cinematic introduction" onKeyDown={e=>{if(e.key==='Escape')close();if(e.key==='Tab'){e.preventDefault();skip.current?.focus()}}}><span className="intro-brand">AENDROX</span><video ref={video} autoPlay muted playsInline preload="auto" src="/assets/assembly-clean.mp4" poster="/assets/exploded.webp" onEnded={close} onError={close} onTimeUpdate={e=>setProgress(e.currentTarget.duration?e.currentTarget.currentTime/e.currentTarget.duration*100:0)}/><div className="intro-bottom"><div><span className="eyebrow">ENGINEERING THE FUTURE</span><div className="loading-track"><i style={{width:`${progress}%`}}/></div></div><button ref={skip} onClick={close}>Skip intro <ArrowUpRight size={16}/></button></div></div>
}
export function Reveal(){useEffect(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;gsap.registerPlugin(ScrollTrigger);const ctx=gsap.context(()=>{gsap.utils.toArray<HTMLElement>('.reveal').forEach(el=>gsap.fromTo(el,{y:25,opacity:.25},{y:0,opacity:1,duration:.8,scrollTrigger:{trigger:el,start:'top 94%',once:true}}))});return()=>ctx.revert()},[]);return null}
export function Hero(){const visual=useRef<HTMLDivElement>(null);const [film,setFilm]=useState(false);const close=useRef<HTMLButtonElement>(null);const play=useRef<HTMLButtonElement>(null);
 useEffect(()=>{if(film){close.current?.focus();const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=old;play.current?.focus()}}},[film]);
 return <><section className="hero" onPointerMove={e=>{if(!visual.current||e.pointerType==='touch'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=e.currentTarget.getBoundingClientRect();visual.current.style.transform=`perspective(1000px) rotateY(${(e.clientX-r.left-r.width/2)/r.width*9}deg) rotateX(${-(e.clientY-r.top-r.height/2)/r.height*7}deg)`}} onPointerLeave={()=>{if(visual.current)visual.current.style.transform='none'}}><div className="hero-grid"/><div className="hero-content"><div className="availability"><i className="status-dot"/> INTELLIGENCE. INNOVATION. BEYOND LIMITS.</div><h1><span className="hero-name">AENDROX</span>Engineering<br/>the <em>future.</em></h1><p>We build intelligent digital experiences, powerful<br className="desktop-break"/> software, and scalable solutions. Your vision.<br className="desktop-break"/> Our engineering. Extraordinary possibilities.</p><div className="hero-actions"><Link className="button primary" href="/services">Explore our services <ArrowUpRight size={17}/></Link><Link className="button secondary" href="/projects">View our projects <ArrowUpRight size={17}/></Link></div><button className="film-button" ref={play} onClick={()=>setFilm(true)}><span><Play size={12} fill="currentColor"/></span>Watch the AENDROX film <small>00:08</small></button></div><div className="hero-visual" ref={visual}><div className="orbit orbit-one"/><div className="orbit orbit-two"/><RotatingEmblem/><span className="visual-label label-top"><i/> PRECISION IN EVERY LAYER</span><span className="visual-label label-bottom">01 / ENGINEERED TO EVOLVE <span>+</span></span></div><div className="hero-bottom"><a href="#intro">SCROLL TO EXPLORE <ArrowDown size={14}/></a><span>SOFTWARE ENGINEERING · INTELLIGENT BY DESIGN</span><span className="coordinates">INTELLIGENCE. CRAFT. POSSIBILITY. <i>↗</i></span></div></section>{film&&<div className="film-modal" role="dialog" aria-modal="true" aria-label="AENDROX brand film" onKeyDown={e=>{if(e.key==='Escape')setFilm(false);if(e.key==='Tab'){e.preventDefault();close.current?.focus()}}}><button ref={close} aria-label="Close film" onClick={()=>setFilm(false)}><X/></button><video src="/assets/assembly-clean.mp4" autoPlay muted playsInline controls/><p>Engineering the Future.</p></div>}</>
}
export function Assembly(){
 return <section className="assembly-section reveal"><div className="section-heading"><div><span className="eyebrow">THE AENDROX APPROACH</span><h2>Every detail.<br/><span>A greater whole.</span></h2></div><p>Great software works like a precision mechanism.<br/>Every component considered. Every connection intentional.</p></div><div className="assembly-visual assembly-player"><video autoPlay loop playsInline muted disablePictureInPicture preload="metadata" poster="/assets/exploded.webp" aria-label="AENDROX mechanical emblem assembly film"><source src="/assets/assembly-clean.mp4" type="video/mp4"/>Your browser does not support video playback.</video></div><div className="process-grid">{[['01','Discover','Understand your ambition. Define the right problem.'],['02','Architect','Design a clear foundation for everything that follows.'],['03','Engineer','Build with purpose. Refine with precision.'],['04','Evolve','Launch thoughtfully. Learn, improve, and grow.']].map(([n,t,d])=><div key={n}><span>{n} /</span><h3>{t}</h3><p>{d}</p></div>)}</div></section>
}






