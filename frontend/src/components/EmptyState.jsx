export default function EmptyState({ title, message, action }) {
  return (
    <div className="card text-center py-12">
      <div className="text-4xl mb-3 text-slate-300">—</div>
      <h3 className="font-semibold text-slate-800">{title}</h3>
      {message && <p className="text-sm text-slate-500 mt-1">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
