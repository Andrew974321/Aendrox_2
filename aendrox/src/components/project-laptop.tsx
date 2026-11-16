import { LayoutDashboard, Users, CalendarCheck, CalendarDays, TrendingUp, Settings, FlaskConical, Layers, Play, FileBarChart, CheckCircle2, Workflow, Zap, Plug, History, FolderKanban, Palette, Component, Image as ImageIcon, Rocket, Cpu, ClipboardList, BarChart3, Code2, Mountain, Plus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// HD laptop previews for the concept projects: every label, number and chart on the screen is live
// HTML/SVG, so it stays sharp at any size. The screen is tilted in CSS 3D (see .laptop-* in globals.css).

type Screen = {
  brand: string; Logo: LucideIcon; nav: [LucideIcon, string][]; title: string;
  stats: [string, string, string][]; list?: [LucideIcon, string][]; Tile: LucideIcon; tileLabel?: string;
};

const SCREENS: Record<string, Screen> = {
  people: {
    brand: 'PeopleOS', Logo: Users, title: 'A good day to do great work.', Tile: Users,
    nav: [[LayoutDashboard, 'Dashboard'], [Users, 'People'], [CalendarCheck, 'Attendance'], [CalendarDays, 'Leaves'], [TrendingUp, 'Performance'], [Settings, 'Settings']],
    stats: [['Total Employees', '248', '+12%'], ['Attendance', '96%', '+4%']],
    list: [[Users, 'Team Overview'], [ClipboardList, 'Pending Approvals'], [BarChart3, 'Reports & Analytics']],
  },
  test: {
    brand: 'TestAI', Logo: FlaskConical, title: 'A clearer picture of quality.', Tile: Cpu, tileLabel: 'AI',
    nav: [[FlaskConical, 'Tests'], [Layers, 'Suites'], [Play, 'Runs'], [FileBarChart, 'Reports'], [Settings, 'Settings']],
    stats: [['Test Coverage', '98%', '+15%'], ['Passed', '1,245', '+8%']],
    list: [[Play, 'Run Test Suite'], [CheckCircle2, 'Automation Tests'], [Cpu, 'AI Issue Analysis']],
  },
  flow: {
    brand: 'Flow', Logo: Plus, title: 'Make the connection.', Tile: Settings,
    nav: [[Workflow, 'Workflows'], [Zap, 'Automations'], [Plug, 'Integrations'], [History, 'History'], [Settings, 'Settings']],
    stats: [['Active Flows', '12', '+3%'], ['Success Rate', '99%', '+2%']],
  },
  studio: {
    brand: 'Studio', Logo: Palette, title: 'Your next idea starts here.', Tile: Layers,
    nav: [[FolderKanban, 'Projects'], [Palette, 'Design'], [Component, 'Components'], [ImageIcon, 'Assets'], [Rocket, 'Deploy']],
    stats: [],
  },
};

const BARS = [32, 48, 40, 62, 55, 78, 70, 92];

function Bars() {
  return <div className="lp-bars" aria-hidden="true">{BARS.map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>;
}

function FlowGraph() {
  return (
    <svg className="lp-flow" viewBox="0 0 300 90" aria-hidden="true">
      <g fill="none" stroke="#ffffff55" strokeWidth="1.4">
        <path d="M58 45 H86 V20 H112" /><path d="M86 45 V70 H112" /><path d="M150 20 H176 V45 H202" /><path d="M150 70 H176 V45" />
      </g>
      {[[20, 45, 'Trigger'], [130, 20, 'Enrich'], [130, 70, 'Notify'], [240, 45, 'Sync']].map(([x, y, label]) => (
        <g key={label as string} transform={`translate(${x} ${y})`}>
          <rect x="-20" y="-11" width="40" height="22" rx="5" fill="#16181c" stroke="#ffffff44" />
          <rect x="-15" y="-6" width="12" height="12" rx="3" fill="#f2f4f7" />
          <path d="M-11 -3 L-6 0 L-11 3 Z" fill="#111" />
          <rect x="1" y="-2" width="14" height="4" rx="2" fill="#ffffff66" />
          <text x="0" y="22" textAnchor="middle" fontSize="7" fill="#ffffff88">{label}</text>
        </g>
      ))}
    </svg>
  );
}

function StudioBoard() {
  return (
    <div className="lp-studio">
      <div className="lp-studio-hero"><small>Preview</small><Mountain strokeWidth={1.4} /></div>
      <div className="lp-studio-code"><Code2 strokeWidth={1.6} /></div>
      <div className="lp-studio-row"><span><ImageIcon strokeWidth={1.6} /><b>Experiences</b></span><span><Play strokeWidth={1.6} /><b>Showcase</b></span></div>
    </div>
  );
}

export function LaptopPreview({ type }: { type: string }) {
  const s = SCREENS[type] ?? SCREENS.people;
  const { Logo, Tile } = s;
  return (
    <div className={`project-preview lp-${type}`} aria-hidden="true">
      <span className="lp-light" />
      <div className="laptop">
        <div className="laptop-screen">
          <aside className="lp-side">
            <div className="lp-brand"><span><Logo strokeWidth={2} /></span>{s.brand}</div>
            {s.nav.map(([Icon, label]) => <div key={label} className="lp-nav"><Icon strokeWidth={1.6} />{label}</div>)}
          </aside>
          <main className="lp-main">
            <div className="lp-top"><i /><i /></div>
            <div className="lp-title">{s.title}</div>
            {s.stats.length > 0 && (
              <div className="lp-stats">
                {s.stats.map(([label, value, delta]) => <div key={label}><small>{label}</small><b>{value}<em>{delta}</em></b></div>)}
                <div className="lp-chart"><small>Trend</small><Bars /></div>
              </div>
            )}
            {s.list && <div className="lp-list">{s.list.map(([Icon, label]) => <div key={label}><Icon strokeWidth={1.6} /><span>{label}</span><i /></div>)}</div>}
            {type === 'flow' && <FlowGraph />}
            {type === 'studio' && <StudioBoard />}
          </main>
        </div>
        <div className="laptop-base" />
        <div className="laptop-ring" />
      </div>
      <div className="lp-tile"><Tile strokeWidth={1.5} />{s.tileLabel && <b>{s.tileLabel}</b>}</div>
    </div>
  );
}
