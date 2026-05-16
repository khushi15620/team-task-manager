import { useEffect, useState } from 'react';
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

  if (!data) return <Spinner />;

  const { stats, recent } = data;
  const chart = [
    { name: 'Todo', value: stats.todoTasks, color: '#94a3b8' },
    { name: 'In Progress', value: stats.inProgressTasks, color: '#f59e0b' },
    { name: 'Completed', value: stats.completedTasks, color: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Tasks" value={stats.totalTasks} />
        <StatCard label="Completed" value={stats.completedTasks} color="green" />
        <StatCard label="Pending" value={stats.pendingTasks} color="amber" />
        <StatCard label="Overdue" value={stats.overdueTasks} color="red" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-4">Task Distribution</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={chart} dataKey="value" nameKey="name" outerRadius={90} label>
                {chart.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4">Recent Activity</h2>
          {recent.length === 0 ? (
            <p className="text-sm text-slate-500">No recent tasks</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recent.map((t) => (
                <li key={t._id} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-slate-800">{t.title}</div>
                    <div className="text-xs text-slate-500">
                      {t.project?.title} - {t.assignedTo?.name || 'Unassigned'}
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
