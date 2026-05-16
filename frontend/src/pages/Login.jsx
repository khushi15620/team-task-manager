import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="card w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
        <p className="text-sm text-slate-500 mb-6">Sign in to your account</p>
        <div className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input type="email" required className="input"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" required className="input"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? <Spinner /> : 'Login'}
          </button>
        </div>
        <p className="text-sm text-center mt-4 text-slate-500">
          No account? <Link to="/signup" className="text-brand-600 font-medium">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
