import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import Spinner from '../components/Spinner';
import StatusBadge from '../components/StatusBadge';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats').then(({ data }) => setData(data));
  }, []);

  if (!data) return <div className="flex justify-center py-10"><Spinner /></div>;

  const { stats, recent } = data;
  const chart = [
    { name: 'Todo', value: stats.todoTasks, color: '#94a3b8' },
    { name: 'In Progress', value: stats.inProgressTasks, color: '#f59e0b' },
    { name: 'Completed', value: stats.completedTasks, color: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Welcome back — here's the latest.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/projects" className="btn-secondary text-sm">+ New Project</Link>
          <Link to="/tasks" className="btn-primary text-sm">+ New Task</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Tasks" value={stats.totalTasks} />
        <StatCard label="Completed" value={stats.completedTasks} color="green" />
        <StatCard label="Pending" value={stats.pendingTasks} color="amber" />
        <StatCard label="Overdue" value={stats.overdueTasks} color="red" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-4 text-slate-100">Task Distribution</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={chart} dataKey="value" nameKey="name" outerRadius={90}
                   stroke="rgba(255,255,255,0.08)" label>
                {chart.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'rgba(11,16,32,0.95)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12, color: '#e2e8f0',
                }}
              />
              <Legend wrapperStyle={{ color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4 text-slate-100">Recent Activity</h2>
          {recent.length === 0 ? (
            <p className="text-sm text-slate-400">No recent tasks</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {recent.map((t) => (
                <li key={t._id} className="py-3 flex justify-between items-center gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-slate-100 truncate">{t.title}</div>
                    <div className="text-xs text-slate-400 truncate">
                      {t.project?.title} — {t.assignedTo?.name || 'Unassigned'}
                    </div>
                  </div>
                  <StatusBadge status={t.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
