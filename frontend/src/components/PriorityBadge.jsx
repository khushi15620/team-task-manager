const map = {
  low: 'bg-sky-500/15 text-sky-200 border-sky-400/30',
  medium: 'bg-yellow-500/15 text-yellow-200 border-yellow-400/30',
  high: 'bg-rose-500/15 text-rose-200 border-rose-400/30',
};
export default function PriorityBadge({ priority }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${map[priority]}`}>
      {priority}
    </span>
  );
}
