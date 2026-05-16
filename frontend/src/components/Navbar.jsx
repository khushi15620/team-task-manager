import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-3 flex items-center justify-between">
      <div className="md:hidden text-lg font-bold text-brand-700">TeamTasks</div>
      <div className="flex items-center gap-4 ml-auto">
        <div className="text-sm text-right">
          <div className="font-medium text-slate-800">{user?.name}</div>
          <div className="text-xs text-slate-500 capitalize">{user?.role}</div>
        </div>
        <button
          className="btn-secondary text-sm"
          onClick={() => { logout(); navigate('/login'); }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
