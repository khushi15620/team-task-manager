const map = {
  low: 'bg-blue-100 text-blue-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};
export default function PriorityBadge({ priority }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${map[priority]}`}>
      {priority}
    </span>
  );
}
