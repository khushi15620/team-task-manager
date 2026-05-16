import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="card space-y-3">
        <div><div className="text-xs text-slate-500">Name</div><div className="font-medium">{user.name}</div></div>
        <div><div className="text-xs text-slate-500">Email</div><div className="font-medium">{user.email}</div></div>
        <div><div className="text-xs text-slate-500">Role</div><div className="font-medium capitalize">{user.role}</div></div>
      </div>
    </div>
  );
}
