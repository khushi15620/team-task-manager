export default function StatCard({ label, value, color = 'brand' }) {
  const accents = {
    brand: 'from-brand-400 to-fuchsia-500',
    green: 'from-emerald-400 to-teal-500',
    amber: 'from-amber-400 to-orange-500',
    red: 'from-rose-400 to-red-600',
  };
  return (
    <div className="card card-hover overflow-hidden">
      <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20 blur-2xl
                       bg-gradient-to-br ${accents[color]}`} />
      <div className="text-[11px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className={`text-3xl font-bold mt-2 bg-gradient-to-br ${accents[color]} bg-clip-text text-transparent`}>
        {value}
      </div>
    </div>
  );
}
