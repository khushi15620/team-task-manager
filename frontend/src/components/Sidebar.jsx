import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const Icon = ({ d }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const items = [
  { to: '/dashboard', label: 'Dashboard',
    icon: <Icon d="M3 13h8V3H3zM13 21h8V11h-8zM3 21h8v-6H3zM13 9h8V3h-8z" /> },
  { to: '/projects', label: 'Projects',
    icon: <Icon d="M3 7h18M3 12h18M3 17h12" /> },
  { to: '/tasks', label: 'Tasks',
    icon: <Icon d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /> },
  { to: '/profile', label: 'Profile',
    icon: <Icon d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /> },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const w = collapsed ? 'w-[72px]' : 'w-64';

  return (
    <aside
      className={`${w} hidden md:flex flex-col shrink-0 transition-[width] duration-300
                  border-r border-white/10 bg-white/[0.03] backdrop-blur-xl`}
    >
      <div className="flex items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-700
                          flex items-center justify-center text-white font-bold shadow-glow">T</div>
          {!collapsed && (
            <span className="font-semibold text-slate-100 tracking-tight whitespace-nowrap">
              TeamTasks
            </span>
          )}
        </div>
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="text-slate-400 hover:text-slate-100 p-1 rounded-md hover:bg-white/5"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {collapsed
              ? <path d="M9 18l6-6-6-6" />
              : <path d="M15 18l-6-6 6-6" />}
          </svg>
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {items.map((i) => (
          <NavLink
            key={i.to}
            to={i.to}
            title={collapsed ? i.label : undefined}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
               transition-all border border-transparent
               ${isActive
                 ? 'bg-gradient-to-r from-brand-500/20 to-brand-500/0 text-white border-brand-500/30 shadow-glow'
                 : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'}`
            }
          >
            <span className="shrink-0">{i.icon}</span>
            {!collapsed && <span className="truncate">{i.label}</span>}
          </NavLink>
        ))}
      </nav>

      {!collapsed && (
        <div className="m-3 p-3 rounded-xl border border-white/10 bg-white/[0.03]">
          <div className="text-[11px] uppercase tracking-wider text-slate-500">Tip</div>
          <div className="text-xs text-slate-400 mt-1">Press the arrow to collapse the sidebar.</div>
        </div>
      )}
    </aside>
  );
}
