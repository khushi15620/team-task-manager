import { NavLink } from 'react-router-dom';

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: 'D' },
  { to: '/projects', label: 'Projects', icon: 'P' },
  { to: '/tasks', label: 'Tasks', icon: 'T' },
  { to: '/profile', label: 'Profile', icon: 'U' },
];

export default function Sidebar() {
  return (
    <aside className="w-60 bg-white border-r border-slate-200 hidden md:flex flex-col">
      <div className="px-6 py-5 text-xl font-bold text-brand-700">TeamTasks</div>
      <nav className="flex-1 px-3 space-y-1">
        {items.map((i) => (
          <NavLink
            key={i.to}
            to={i.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            <span className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-xs font-bold">{i.icon}</span>
            {i.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
