export default function StatCard({ label, value, color = 'brand' }) {
  const colors = {
    brand: 'text-brand-600',
    green: 'text-emerald-600',
    amber: 'text-amber-600',
    red: 'text-red-600',
  };
  return (
    <div className="card">
      <div className="text-sm text-slate-500">{label}</div>
      <div className={`text-3xl font-bold mt-2 ${colors[color]}`}>{value}</div>
    </div>
  );
}
