import { ServicesShowcase, MechanicalShowcase } from '@/components/mechanical-showcase';
import Link from 'next/link';
import { ArrowUpRight, Cpu, CircleDot, Workflow, ShieldCheck } from 'lucide-react';
import { Hero,Intro,Reveal,Assembly } from '@/components/experience';

export default function Home(){return <><Intro/><Hero/><div className="expertise-strip"><span>IDEAS INTO IMPACT.</span>{['SOFTWARE ENGINEERING','ARTIFICIAL INTELLIGENCE','CLOUD & DEVOPS','DIGITAL EXPERIENCES'].map((s,i)=><span key={s}>{[<Cpu key="c"/>,<CircleDot key="d"/>,<Workflow key="w"/>,<ShieldCheck key="s"/>][i]}{s}</span>)}</div><section className="intro-section section-pad reveal" id="intro"><div><span className="eyebrow"><i className="blue-line"/> THE THINKING BEHIND THE BUILD</span><h2>Ambitious ideas deserve<br/><span>exceptional engineering.</span></h2></div><div><p>We’re AENDROX. A software technology brand turning complex challenges into elegant digital solutions.</p><p className="muted">From the first spark of an idea to the systems that power it, we bring intelligence, craft, and a forward-thinking mindset to everything we build.</p><Link className="text-link" href="/about">Meet AENDROX <ArrowUpRight size={17}/></Link></div></section><ServicesShowcase/><Assembly/><MechanicalShowcase/><ContactCTA/><Reveal/></>}
export function ContactCTA(){return <section className="contact-cta"><span className="eyebrow"><i className="status-dot"/> GREAT THINGS START WITH A CONVERSATION</span><h2>Your next big idea.<br/><span>Let’s engineer it.</span></h2><Link className="button primary" href="/contact">Start a conversation <ArrowUpRight size={18}/></Link><span className="cta-watermark" aria-hidden="true">A</span></section>}



