import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';

export default function ProjectDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [data, setData] = useState(null);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(blank());

  function blank() {
    return { title: '', description: '', priority: 'medium', status: 'todo', dueDate: '', assignedTo: '' };
  }

  const load = async () => {
    const { data } = await api.get(`/projects/${id}`);
    setData(data);
  };

  useEffect(() => { load(); }, [id]);

  if (!data) return <Spinner />;
  const { project, tasks, progress } = data;

  const openCreate = () => { setForm(blank()); setModal({ mode: 'create' }); };
  const openEdit = (t) => {
    setForm({
      title: t.title, description: t.description, priority: t.priority,
      status: t.status, dueDate: t.dueDate ? t.dueDate.slice(0, 10) : '',
      assignedTo: t.assignedTo?._id || '',
    });
    setModal({ mode: 'edit', id: t._id });
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, project: id, dueDate: form.dueDate || undefined, assignedTo: form.assignedTo || undefined };
    try {
      if (modal.mode === 'create') await api.post('/tasks', payload);
      else await api.put(`/tasks/${modal.id}`, payload);
      toast.success('Saved');
      setModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const changeStatus = async (task, status) => {
    try {
      await api.patch(`/tasks/${task._id}/status`, { status });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const remove = async (task) => {
    if (!confirm('Delete task?')) return;
    await api.delete(`/tasks/${task._id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <Link to="/projects" className="text-sm text-brand-600">&larr; Back to projects</Link>
      <div className="card">
        <h1 className="text-2xl font-bold">{project.title}</h1>
        <p className="text-slate-500 mt-1">{project.description}</p>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Progress</span><span>{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-brand-600 h-2 rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.members.map((m) => (
            <span key={m._id} className="text-xs bg-slate-100 px-2 py-1 rounded-full">
              {m.name}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tasks</h2>
        {isAdmin && <button className="btn-primary" onClick={openCreate}>+ New Task</button>}
      </div>

      {tasks.length === 0 ? (
        <EmptyState title="No tasks" message={isAdmin ? 'Create one' : 'Nothing assigned yet'} />
      ) : (
        <div className="grid gap-3">
          {tasks.map((t) => (
            <TaskCard key={t._id} task={t} canManage={isAdmin}
              canChangeStatus={isAdmin || t.assignedTo?._id === user.id}
              onStatusChange={changeStatus} onEdit={openEdit} onDelete={remove} />
          ))}
        </div>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)}
        title={modal?.mode === 'create' ? 'New Task' : 'Edit Task'}>
        <form onSubmit={submit} className="space-y-3">
          <div><label className="label">Title</label>
            <input required className="input" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><label className="label">Description</label>
            <textarea className="input" rows={2} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Priority</label>
              <select className="input" value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select></div>
            <div><label className="label">Status</label>
              <select className="input" value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="todo">Todo</option><option value="in_progress">In Progress</option><option value="completed">Completed</option>
              </select></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Due Date</label>
              <input type="date" className="input" value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></div>
            <div><label className="label">Assignee</label>
              <select className="input" value={form.assignedTo}
                onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
                <option value="">Unassigned</option>
                {project.members.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select></div>
          </div>
          <button className="btn-primary w-full">Save</button>
        </form>
      </Modal>
    </div>
  );
}
