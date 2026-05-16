const map = {
  todo: 'bg-slate-500/15 text-slate-200 border-slate-400/20',
  in_progress: 'bg-amber-500/15 text-amber-200 border-amber-400/30',
  completed: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/30',
};
const label = { todo: 'Todo', in_progress: 'In Progress', completed: 'Completed' };

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${map[status]}`}>
      {label[status]}
    </span>
  );
}
