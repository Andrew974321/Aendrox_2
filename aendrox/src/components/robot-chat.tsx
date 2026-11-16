'use client';

import { useEffect, useId, useRef, useState } from 'react';

import { createPortal } from 'react-dom';

import Link from 'next/link';
import { Send, RotateCcw, X } from 'lucide-react';
type Message = { role: 'user' | 'assistant'; content: string };
const welcome: Message = { role: 'assistant', content: 'Hello, I’m your AENDROX robotic assistant. Let’s turn your idea into a clear project brief. What would you like to build?' };

function RobotAvatar() {
  const visor = useId();
  return <span className="robot-chat-avatar" role="img" aria-label="Your AENDROX robot assistant"><svg className="robot-avatar-face" viewBox="0 0 58 58" aria-hidden="true"><defs><linearGradient id={visor} x1="0" y1="0" x2="0.8" y2="1"><stop stopColor="#111b20"/><stop offset="1" stopColor="#03090c"/></linearGradient></defs><path d="M22 24 Q35 21 54 25 L54 38 Q50 44 43 45 L28 42 Q22 39 22 34Z" fill={`url(#${visor})`}/><path d="M24 25 Q37 23 51 26" fill="none" stroke="#809298" strokeOpacity=".13" strokeWidth=".6"/><g className="robot-avatar-eye robot-avatar-eye-left"><path d="M28 35 Q32 28 37 35"/></g><g className="robot-avatar-eye robot-avatar-eye-right"><path d="M45 36 Q49 30 53 36"/></g></svg></span>;
}

function RobotGreeterArt() {
  const mask = useId();
  const soft = useId();
  const head = useId();
  return <svg className="robot-greeter-art" viewBox="60 430 660 1300" aria-hidden="true">
    <defs>
      <filter id={soft}><feGaussianBlur stdDeviation="3"/></filter>
      <mask id={mask} maskUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1920">
        <path fill="white" filter={`url(#${soft})`} d="M420 463 C355 455 299 488 283 551 C266 598 285 658 326 699 L350 745 L321 773 C271 752 204 768 177 805 C145 845 154 893 146 942 L101 1068 L92 1183 L103 1240 L96 1361 L112 1435 L154 1478 L181 1454 L179 1416 L156 1379 L166 1288 L174 1201 L200 1111 L229 1031 L254 1093 L257 1180 L239 1276 L269 1410 L329 1550 L420 1700 L476 1570 L542 1410 L558 1301 L551 1188 L563 1090 L589 1199 L611 1307 L603 1401 L630 1467 L669 1476 L699 1435 L692 1365 L670 1302 L654 1198 L637 1095 L620 993 L627 881 C627 826 596 786 552 779 L508 780 L500 741 C549 712 564 668 558 600 C556 532 502 475 420 463Z"/>
        <rect x="0" y="0" width="1080" height="744" fill="black"/>
      </mask>
      <clipPath id={head}><path d="M500 240 C430 234 382 265 371 323 L357 373 L375 445 C395 489 438 512 496 515 C560 516 601 484 612 436 L632 413 L633 337 L608 309 C588 262 548 241 500 240Z"/></clipPath>
    </defs>
    <image href="/assets/contact/robot-video-clean-poster.jpg" width="1080" height="1920" mask={`url(#${mask})`}/>
    <svg x="273" y="451" width="296" height="300" viewBox="345 225 310 310" overflow="visible">
      <g transform="rotate(12 500 380)">
        <image href="/assets/contact/robot-front-frame.jpg" width="1080" height="1920" clipPath={`url(#${head})`}/>
        <path d="M411 356 Q490 322 587 341 L587 416 Q494 453 411 437Z" fill="#080f13"/>
        <g className="robot-front-eye"><path d="M427 393 Q447 353 471 383"/></g>
        <g className="robot-front-eye"><path d="M529 374 Q548 335 573 364"/></g>
      </g>
    </svg>
  </svg>;
}

export function RobotChat() {
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [input, setInput] = useState('');
  const [mounted, setMounted] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<'loading' | 'guide' | 'ai' | 'offline'>('loading');
  const [error, setError] = useState('');
  const log = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const lock = useRef(false);
  const dialog = useRef<HTMLDialogElement>(null);
  function openChat() { dialog.current?.showModal(); setChatOpen(true); requestAnimationFrame(() => field.current?.focus()); }
  function closeChat() { dialog.current?.close(); setChatOpen(false); }
  useEffect(() => () => { document.body.style.overflow = ''; }, []);
  useEffect(() => { const controller = new AbortController(); fetch('/api/chat', { signal: controller.signal }).then(r => { if (!r.ok) throw new Error(); return r.json(); }).then(d => setMode(d.mode)).catch(() => { if (!controller.signal.aborted) setMode('offline'); }); return () => controller.abort(); }, []);
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [messages, busy]);
  async function send(text: string) {
    const value = text.trim();
    if (!value || lock.current || mode === 'loading') return;
    lock.current = true; setBusy(true); setError(''); setInput('');
    const next: Message[] = [...messages, { role: 'user', content: value }];
    setMessages(next);
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next.slice(-12) }), signal: AbortSignal.timeout(30000) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not send your message. Please try again.');
      setMode(data.mode); setMessages([...next, { role: 'assistant', content: data.reply }]);
    } catch (e) { setMessages(messages); setInput(value); setError(e instanceof Error && e.name !== 'TimeoutError' ? e.message : 'The request timed out. Please try again.'); }
    finally { lock.current = false; setBusy(false); field.current?.focus(); }
  }
  return <section className={`global-robot-chat ${busy ? 'is-thinking' : ''}`} aria-label="Robotic chatbot">
    {mounted && createPortal(<button type="button" className="robot-corner-greeter" hidden={chatOpen} onClick={openChat} aria-label="Hi! Open AENDROX robot chat" aria-haspopup="dialog">
      <span className="robot-greeter-bubble">Hi! <span aria-hidden="true">👋</span><small>Let’s chat</small></span>
      <RobotGreeterArt/>
    </button>, document.body)}
    <dialog className="robot-chat-dialog" ref={dialog} onClose={() => setChatOpen(false)} aria-label="AENDROX robotic assistant chat" onClick={e => { if (e.target === e.currentTarget) closeChat(); }}>
    <div className="robot-chat-panel"><div className="robot-chat-header"><RobotAvatar/><div><strong>AENDROX Robotic Assistant</strong><small>{mode === 'ai' ? 'Live AI · powered by OpenAI' : mode === 'loading' ? 'Connecting…' : mode === 'offline' ? 'Connection unavailable' : 'Local guide · preset answers'}</small></div><button type="button" aria-label="Reset chat" disabled={busy} onClick={() => { if (!window.confirm('Clear this conversation?')) return; setMessages([welcome]); setInput(''); setError(''); field.current?.focus(); }}><RotateCcw size={17}/></button><button type="button" aria-label="Close chat" onClick={closeChat}><X size={20}/></button></div>
    <div className="robot-chat-log" ref={log} role="log" aria-live="polite" aria-relevant="additions text">{messages.map((m,i) => <div key={i} className={`robot-message ${m.role}`}><span>{m.role === 'user' ? 'You' : 'AENDROX'}</span><p>{m.content}</p></div>)}{busy && <div className="robot-typing" role="status" aria-label="Preparing response"><i/><i/><i/></div>}</div>
    <div className="robot-prompts">{['Explore AENDROX Services', 'Build a Website', 'Create a SaaS Product', 'AI Automation Solutions', 'Get a Project Estimate', 'Contact AENDROX'].map(q => <button type="button" key={q} disabled={busy || mode === 'loading'} onClick={() => send(q)}>{q}</button>)}</div>
    {error && <p className="robot-chat-error" role="alert">{error}</p>}
    <form className="robot-composer" onSubmit={e => { e.preventDefault(); void send(input); }}><label className="sr-only" htmlFor="robot-message">Message the robotic assistant</label><input id="robot-message" ref={field} value={input} onChange={e => setInput(e.target.value)} maxLength={2000} placeholder="Tell me about your idea…" disabled={busy} autoComplete="off"/><button type="submit" aria-label="Send chat message" disabled={busy || !input.trim() || mode === 'loading'}><Send size={18}/></button></form>
    <p className="robot-chat-note">{mode === 'ai' ? 'Messages are sent to OpenAI. Avoid sensitive information. AI can make mistakes.' : 'Local guide answers are preset. This chat does not send an inquiry.'} <Link href="/contact#project-inquiry" onClick={closeChat}>Open inquiry form ↗</Link></p>
    </div>
    </dialog>
  </section>;
}



