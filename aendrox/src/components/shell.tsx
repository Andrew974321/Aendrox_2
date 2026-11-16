'use client';
import Link from 'next/link';
import { RobotChat } from './robot-chat';
import { usePathname } from 'next/navigation';
import { useEffect,useState } from 'react';
import { ArrowUpRight, Menu, X, ArrowUp } from 'lucide-react';
import { navigation,hrefFor } from '@/lib/data';
export function Shell({children}:{children:React.ReactNode}){
 const pathname=usePathname();const [open,setOpen]=useState(false);
 useEffect(()=>{setOpen(false)},[pathname]);
 return <><a className="skip-link" href="#main">Skip to content</a><header className="header"><Link href="/" aria-label="AENDROX home" className="brand"><img src="/assets/wordmark.webp" alt="AENDROX" width="174" height="46"/></Link><nav className={open?'navigation open':'navigation'} aria-label="Main navigation">{navigation.map(n=><Link key={n} href={hrefFor(n)} aria-current={pathname===hrefFor(n)?'page':undefined}>{n}</Link>)}</nav><Link className="nav-cta" href="/contact">Let’s talk <ArrowUpRight size={15}/></Link><button className="menu-toggle" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></header><main id="main" key={pathname}>{children}</main><footer><div className="footer-top"><div><Link href="/" className="footer-brand">AENDROX<span>®</span></Link><p>Intelligence. Innovation. Beyond Limits.</p><p className="muted">Engineering the future, one idea at a time.</p></div><div><span className="eyebrow">EXPLORE</span>{['About','Services','Projects','Skills'].map(n=><Link href={hrefFor(n)} key={n}>{n}</Link>)}</div><div><span className="eyebrow">CONNECT</span><Link href="/contact">Start a project ↗</Link><Link href="/experience">Our expertise</Link><Link href="/privacy-policy">Privacy policy</Link><Link href="/terms-and-conditions">Terms & conditions</Link></div><button className="back-top" onClick={()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})} aria-label="Back to top"><ArrowUp/></button></div><div className="footer-bottom"><span>© {new Date().getFullYear()} AENDROX. All rights reserved.</span><span><i className="status-dot"/> BUILT WITH PURPOSE. ENGINEERED FOR TOMORROW.</span></div></footer><RobotChat/></>
}
