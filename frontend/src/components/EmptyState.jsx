export default function EmptyState({ title, message, action }) {
  return (
    <div className="card text-center py-14">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500/30 to-fuchsia-500/30
                      flex items-center justify-center mb-4 border border-white/10">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-200">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </div>
      <h3 className="font-semibold text-slate-100">{title}</h3>
      {message && <p className="text-sm text-slate-400 mt-1">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
