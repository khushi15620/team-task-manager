const map = {
  todo: 'bg-slate-100 text-slate-700',
  in_progress: 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
};
const label = { todo: 'Todo', in_progress: 'In Progress', completed: 'Completed' };

export default function StatusBadge({ status }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[status]}`}>
      {label[status]}
    </span>
  );
}
