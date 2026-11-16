'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

const ignoreReady = () => {};

export default function RobotVideo({ onReady = ignoreReady }: { onReady?: (ready: boolean) => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reduce = () => { if (media.matches) { video.current?.pause(); setDone(true); onReady(true); } };
    reduce();
    media.addEventListener('change', reduce);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) { video.current?.pause(); return; }
      if (!started.current && !media.matches) {
        started.current = true;
        void video.current?.play().catch(() => setPlaying(false));
      }
    }, { threshold: 0.35 });
    if (stage.current) observer.observe(stage.current);
    return () => { observer.disconnect(); media.removeEventListener('change', reduce); };
  }, [onReady]);
  function finish() { video.current?.pause(); setDone(true); onReady(true); }
  async function play(replay = false) {
    if (!video.current) return;
    started.current = true;
    if (replay || done) { video.current.currentTime = 0; setProgress(0); }
    setDone(false); onReady(false);
    try { await video.current.play(); } catch { setPlaying(false); }
  }
  return <div ref={stage} className={`robot-video-stage ${done ? 'is-ready' : ''}`}>
    <div className="robot-video-label"><span/> AENDROX · ROBOTIC ASSISTANT</div>
    <video ref={video} className="robot-video" playsInline muted={muted} preload="metadata"
      poster="/assets/contact/robot-video-clean-poster.jpg" aria-label="Robot walks in, waves hello, and transforms into a chatbot"
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={finish}
      onError={() => { setFailed(true); finish(); }}
      onTimeUpdate={() => { const v = video.current; if (v?.duration) setProgress(v.currentTime / v.duration); }}>
      <source src="/assets/contact/robot-transformation-clean.mp4" type="video/mp4"/>
    </video>
    <div className="robot-video-footer">
      <p role="status">{failed ? 'Use the robot in the corner to chat' : done ? 'Your idea. Let’s bring it to life.' : progress < 0.3 ? 'Meet your AENDROX assistant' : progress < 0.65 ? 'Hi! Let’s build something extraordinary.' : 'Your conversation starts here'}</p>
      <div className="robot-video-controls">
        {!failed && <>
          <button type="button" className="robot-video-playback" onClick={() => playing ? video.current?.pause() : void play(done)}>{playing ? <Pause size={15}/> : done ? <RotateCcw size={15}/> : <Play size={15}/>} {playing ? 'Pause' : done ? 'Replay' : 'Play intro'}</button>
          <button type="button" aria-label={muted ? 'Enable video sound' : 'Mute video sound'} aria-pressed={!muted} onClick={() => setMuted(!muted)}>{muted ? <VolumeX size={16}/> : <Volume2 size={16}/>}</button>
        </>}
      </div>
    </div>
    <div className="robot-video-progress" aria-hidden="true"><span style={{ transform: `scaleX(${done ? 1 : progress})` }}/></div>
  </div>;
}
