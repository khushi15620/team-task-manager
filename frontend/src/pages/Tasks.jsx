import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import toast from 'react-hot-toast';

const blankForm = () => ({
  title: '', description: '', priority: 'medium', status: 'todo',
  dueDate: '', assignedTo: '', project: '',
});

export default function Tasks() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });
  const [view, setView] = useState('list'); // 'list' | 'kanban'
  const [selected, setSelected] = useState(new Set());
  const [modal, setModal] = useState(null); // null | { mode, id? }
  const [form, setForm] = useState(blankForm());

  const load = async () => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    const { data } = await api.get('/tasks', { params });
    setTasks(data.tasks);
    setSelected(new Set());
    setLoading(false);
  };

  const loadProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data.projects || data || []);
    } catch { /* ignore */ }
  };

  useEffect(() => { load(); }, [filters]);
  useEffect(() => { loadProjects(); }, []);

  const selectedProject = useMemo(
    () => projects.find((p) => p._id === form.project),
    [projects, form.project]
  );

  const openCreate = () => {
    setForm({ ...blankForm(), project: projects[0]?._id || '' });
    setModal({ mode: 'create' });
  };
  const openEdit = (t) => {
    setForm({
      title: t.title, description: t.description || '',
      priority: t.priority, status: t.status,
      dueDate: t.dueDate ? t.dueDate.slice(0, 10) : '',
      assignedTo: t.assignedTo?._id || '',
      project: t.project?._id || '',
    });
    setModal({ mode: 'edit', id: t._id });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.project) return toast.error('Please pick a project');
    const payload = {
      ...form,
      dueDate: form.dueDate || undefined,
      assignedTo: form.assignedTo || undefined,
    };
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
    try { await api.patch(`/tasks/${task._id}/status`, { status }); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const remove = async (task) => {
    if (!confirm('Delete task?')) return;
    await api.delete(`/tasks/${task._id}`);
    load();
  };

  const toggleSel = (id) => {
    setSelected((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const selectAll = () => setSelected(new Set(tasks.map((t) => t._id)));
  const clearSel = () => setSelected(new Set());

  const bulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} task(s)?`)) return;
    try {
      await Promise.all([...selected].map((id) => api.delete(`/tasks/${id}`)));
      toast.success('Deleted');
      load();
    } catch (err) { toast.error('Bulk delete failed'); }
  };
  const bulkStatus = async (status) => {
    try {
      await Promise.all([...selected].map((id) => api.patch(`/tasks/${id}/status`, { status })));
      toast.success('Updated');
      load();
    } catch (err) { toast.error('Bulk update failed'); }
  };

  const columns = [
    { key: 'todo', label: 'Todo', color: 'from-slate-500/30 to-slate-700/10' },
    { key: 'in_progress', label: 'In Progress', color: 'from-amber-500/30 to-amber-700/10' },
    { key: 'completed', label: 'Completed', color: 'from-emerald-500/30 to-emerald-700/10' },
  ];
  const grouped = useMemo(() => {
    const g = { todo: [], in_progress: [], completed: [] };
    tasks.forEach((t) => g[t.status]?.push(t));
    return g;
  }, [tasks]);

  const SelCheckbox = ({ id }) => (
    <input
      type="checkbox"
      checked={selected.has(id)}
      onChange={() => toggleSel(id)}
      onClick={(e) => e.stopPropagation()}
      className="absolute top-3 right-3 w-4 h-4 accent-brand-500 cursor-pointer"
    />
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">All Tasks</h1>
          <p className="text-sm text-slate-400 mt-1">Browse, filter, and manage every task.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-0.5">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                view === 'list' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >List</button>
            <button
              onClick={() => setView('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                view === 'kanban' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >Kanban</button>
          </div>
          {isAdmin && (
            <button className="btn-primary" onClick={openCreate} disabled={projects.length === 0}>
              + New Task
            </button>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <input className="input" placeholder="Search title..." value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        <select className="input" value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All statuses</option>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select className="input" value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="card flex flex-wrap items-center gap-2 !py-3">
          <span className="text-sm font-medium">{selected.size} selected</span>
          <button className="btn-secondary text-xs" onClick={selectAll}>Select all</button>
          <button className="btn-secondary text-xs" onClick={clearSel}>Clear</button>
          <div className="h-6 w-px bg-white/10 mx-1" />
          <span className="text-xs text-slate-400">Set status:</span>
          <button className="btn-secondary text-xs" onClick={() => bulkStatus('todo')}>Todo</button>
          <button className="btn-secondary text-xs" onClick={() => bulkStatus('in_progress')}>In Progress</button>
          <button className="btn-secondary text-xs" onClick={() => bulkStatus('completed')}>Completed</button>
          <div className="ml-auto">
            <button className="btn-danger text-xs" onClick={bulkDelete}>Delete</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10"><Spinner /></div>
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No tasks found"
          message={isAdmin ? 'Create one to get started.' : 'Nothing matches your filters.'}
          action={isAdmin && projects.length > 0 && (
            <button className="btn-primary" onClick={openCreate}>+ New Task</button>
          )}
        />
      ) : view === 'list' ? (
        <div className="grid gap-3">
          {tasks.map((t) => (
            <div key={t._id} className="relative">
              <SelCheckbox id={t._id} />
              <TaskCard
                task={t}
                canManage={isAdmin}
                canChangeStatus={isAdmin || t.assignedTo?._id === user.id}
                onStatusChange={changeStatus}
                onEdit={openEdit}
                onDelete={remove}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {columns.map((col) => (
            <div key={col.key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <div className={`rounded-xl px-3 py-2 mb-3 bg-gradient-to-r ${col.color} flex items-center justify-between`}>
                <span className="text-sm font-semibold">{col.label}</span>
                <span className="text-xs chip">{grouped[col.key].length}</span>
              </div>
              <div className="space-y-3">
                {grouped[col.key].length === 0 ? (
                  <div className="text-xs text-slate-500 px-2 py-6 text-center">Nothing here</div>
                ) : grouped[col.key].map((t) => (
                  <div key={t._id} className="relative">
                    <SelCheckbox id={t._id} />
                    <TaskCard
                      task={t}
                      canManage={isAdmin}
                      canChangeStatus={isAdmin || t.assignedTo?._id === user.id}
                      onStatusChange={changeStatus}
                      onEdit={openEdit}
                      onDelete={remove}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === 'create' ? 'New Task' : 'Edit Task'}
      >
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="label">Project</label>
            <select required className="input" value={form.project}
              onChange={(e) => setForm({ ...form, project: e.target.value, assignedTo: '' })}>
              <option value="">Choose a project...</option>
              {projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Title</label>
            <input required className="input" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" rows={2} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Priority</label>
              <select className="input" value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Due Date</label>
              <input type="date" className="input" value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
            <div>
              <label className="label">Assignee</label>
              <select className="input" value={form.assignedTo}
                onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
                <option value="">Unassigned</option>
                {(selectedProject?.members || []).map((m) => (
                  <option key={m._id || m} value={m._id || m}>{m.name || 'Member'}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs text-slate-400">Preview:</span>
            <StatusBadge status={form.status} />
            <PriorityBadge priority={form.priority} />
          </div>
          <button className="btn-primary w-full">Save</button>
        </form>
      </Modal>
    </div>
  );
}
