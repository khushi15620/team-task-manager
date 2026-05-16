import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import ProjectCard from '../components/ProjectCard';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import Spinner from '../components/Spinner';

export default function Projects() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', members: [] });

  const load = async () => {
    setLoading(true);
    const { data } = await api.get('/projects', { params: { search } });
    setProjects(data.projects);
    setLoading(false);
  };

  useEffect(() => { load(); }, [search]);
  useEffect(() => { if (isAdmin) api.get('/auth/users').then(({ data }) => setUsers(data.users)); }, [isAdmin]);

  const openCreate = () => {
    setForm({ title: '', description: '', members: [] });
    setModal({ mode: 'create' });
  };
  const openEdit = (p) => {
    setForm({ title: p.title, description: p.description, members: p.members.map((m) => m._id) });
    setModal({ mode: 'edit', id: p._id });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (modal.mode === 'create') {
        await api.post('/projects', form);
        toast.success('Project created');
      } else {
        await api.put(`/projects/${modal.id}`, form);
        toast.success('Project updated');
      }
      setModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const remove = async (p) => {
    if (!confirm(`Delete "${p.title}"? All tasks will be removed.`)) return;
    await api.delete(`/projects/${p._id}`);
    toast.success('Deleted');
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex gap-2">
          <input className="input" placeholder="Search..." value={search}
            onChange={(e) => setSearch(e.target.value)} />
          {isAdmin && <button className="btn-primary whitespace-nowrap" onClick={openCreate}>+ New</button>}
        </div>
      </div>

      {loading ? <Spinner /> : projects.length === 0 ? (
        <EmptyState title="No projects yet" message={isAdmin ? 'Create one to get started' : 'You have no assigned projects'} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <ProjectCard key={p._id} project={p} canManage={isAdmin}
              onEdit={openEdit} onDelete={remove} />
          ))}
        </div>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)}
        title={modal?.mode === 'create' ? 'New Project' : 'Edit Project'}>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input required className="input" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" rows={3} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="label">Members</label>
            <select multiple className="input h-32" value={form.members}
              onChange={(e) => setForm({ ...form, members: [...e.target.selectedOptions].map((o) => o.value) })}>
              {users.map((u) => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
            </select>
            <p className="text-xs text-slate-500 mt-1">Hold Ctrl/Cmd to multi-select</p>
          </div>
          <button className="btn-primary w-full">Save</button>
        </form>
      </Modal>
    </div>
  );
}
