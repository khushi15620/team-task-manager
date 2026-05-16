import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initials = (user?.name || '?').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 px-4 md:px-8 py-3 flex items-center justify-between
                       border-b border-white/10 bg-ink-950/60 backdrop-blur-xl">
      <div className="md:hidden flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-brand-400 to-brand-700
                        flex items-center justify-center text-white font-bold text-sm">T</div>
        <span className="font-semibold">TeamTasks</span>
      </div>
      <div className="flex items-center gap-3 ml-auto">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-medium text-slate-100 leading-tight">{user?.name}</div>
          <div className="text-[11px] text-slate-500 capitalize tracking-wide">{user?.role}</div>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-fuchsia-600
                        flex items-center justify-center text-white text-sm font-semibold shadow-glow">
          {initials}
        </div>
        <button className="btn-secondary text-sm"
                onClick={() => { logout(); navigate('/login'); }}>
          Logout
        </button>
      </div>
    </header>
  );
}
