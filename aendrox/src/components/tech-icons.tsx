import { Server, Network, Cpu, Database, Zap, Leaf, Table2, Globe2, Theater, Send, ShieldCheck, ListChecks, Cloud, GitBranch, GitPullRequest, Wrench, Container, Workflow, Sparkles, Bot, Plug, FlaskConical, Box } from 'lucide-react';
import type { ReactNode, ReactElement } from 'react';
import type { LucideIcon } from 'lucide-react';

// Monochrome vector marks for the Skills cards. Frontend tools get simple drawn marks; everything
// else uses a matching line icon. All are SVG, so they stay sharp at any size.

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

function Mark({ children }: { children: ReactNode }) {
  return <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">{children}</svg>;
}

const MARKS: Record<string, () => ReactElement> = {
  React: () => <Mark><g {...stroke}><ellipse cx="24" cy="24" rx="20" ry="7.6" /><ellipse cx="24" cy="24" rx="20" ry="7.6" transform="rotate(60 24 24)" /><ellipse cx="24" cy="24" rx="20" ry="7.6" transform="rotate(120 24 24)" /></g><circle cx="24" cy="24" r="3.6" fill="currentColor" /></Mark>,
  'Next.js': () => <Mark><circle cx="24" cy="24" r="20" {...stroke} /><path d="M17.5 32V16l13 16.5M30.5 16v11" {...stroke} strokeWidth={2} /></Mark>,
  TypeScript: () => <Mark><rect x="5" y="5" width="38" height="38" rx="3" {...stroke} /><text x="38" y="38" textAnchor="end" fontSize="17" fontWeight="700" fill="currentColor" fontFamily="Inter, Arial, sans-serif">TS</text></Mark>,
  JavaScript: () => <Mark><rect x="5" y="5" width="38" height="38" rx="3" {...stroke} /><text x="38" y="38" textAnchor="end" fontSize="17" fontWeight="700" fill="currentColor" fontFamily="Inter, Arial, sans-serif">JS</text></Mark>,
  HTML: () => <Mark><path d="M8 4h32l-3 34-13 5-13-5Z" fill="currentColor" opacity=".92" /><path d="M24 7.5v32.4l10.3-3.9L37 7.5Z" fill="#0b0c0f" opacity=".22" /><path d="M31 13H17.5l.6 7.5h12.3l-.9 10L24 32.3l-5.6-1.8-.3-4.2" fill="none" stroke="#0b0c0f" strokeWidth="3.2" strokeLinejoin="round" /></Mark>,
  CSS: () => <Mark><path d="M8 4h32l-3 34-13 5-13-5Z" fill="currentColor" opacity=".92" /><path d="M24 7.5v32.4l10.3-3.9L37 7.5Z" fill="#0b0c0f" opacity=".22" /><path d="M17.5 13H31l-.7 7.5H18.3M30.3 20.5l-.9 10L24 32.3l-5.6-1.8-.3-4.2" fill="none" stroke="#0b0c0f" strokeWidth="3.2" strokeLinejoin="round" /></Mark>,
  'Tailwind CSS': () => <Mark><path d="M8 20c3-7 8-9 14-6 3 1.5 4.5 4.5 8 5 3.4.5 6-1 8-4-3 7-8 9-14 6-3-1.5-4.5-4.5-8-5-3.4-.5-6 1-8 4Z" fill="currentColor" /><path d="M4 32c3-7 8-9 14-6 3 1.5 4.5 4.5 8 5 3.4.5 6-1 8-4-3 7-8 9-14 6-3-1.5-4.5-4.5-8-5-3.4-.5-6 1-8 4Z" fill="currentColor" /></Mark>,
  Vercel: () => <Mark><path d="M24 8 42 39H6Z" fill="currentColor" /></Mark>,
};

const LINE_ICONS: Record<string, LucideIcon> = {
  'Node.js': Server, 'REST APIs': Network, 'Server-side applications': Cpu,
  PostgreSQL: Database, Supabase: Zap, MongoDB: Leaf, SQL: Table2,
  Selenium: Globe2, Playwright: Theater, Postman: Send, 'REST Assured': ShieldCheck, TestNG: ListChecks,
  AWS: Cloud, Git: GitBranch, GitHub: GitPullRequest, Jenkins: Wrench, Docker: Container, 'CI/CD': Workflow,
  'AI-assisted development': Sparkles, Automation: Bot, 'AI integration': Plug, 'Intelligent testing': FlaskConical,
};

export function TechIcon({ name }: { name: string }) {
  const M = MARKS[name];
  if (M) return <M />;
  const Icon = LINE_ICONS[name] ?? Box;
  return <Icon strokeWidth={1.4} aria-hidden="true" />;
}
