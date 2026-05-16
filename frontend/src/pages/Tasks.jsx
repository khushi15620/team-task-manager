import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

export default function Tasks() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });

  const load = async () => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    const { data } = await api.get('/tasks', { params });
    setTasks(data.tasks);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filters]);

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
      <h1 className="text-2xl font-bold">All Tasks</h1>
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

      {loading ? <Spinner /> : tasks.length === 0 ? (
        <EmptyState title="No tasks found" />
      ) : (
        <div className="grid gap-3">
          {tasks.map((t) => (
            <TaskCard key={t._id} task={t} canManage={isAdmin}
              canChangeStatus={isAdmin || t.assignedTo?._id === user.id}
              onStatusChange={changeStatus} onDelete={remove} onEdit={() => {}} />
          ))}
        </div>
      )}
    </div>
  );
}
