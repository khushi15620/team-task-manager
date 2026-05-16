import { Link } from 'react-router-dom';

export default function ProjectCard({ project, onEdit, onDelete, canManage }) {
  const pct = project.progress ?? 0;
  return (
    <div className="card card-hover">
      <div className="flex items-start justify-between gap-3">
        <Link to={`/projects/${project._id}`} className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-100 truncate group-hover:text-brand-300">
            {project.title}
          </h3>
          <p className="text-sm text-slate-400 mt-1 line-clamp-2">
            {project.description || 'No description'}
          </p>
        </Link>
        {canManage && (
          <div className="flex gap-1.5 shrink-0">
            <button className="btn-secondary text-xs px-2.5 py-1" onClick={() => onEdit(project)}>Edit</button>
            <button className="btn-danger text-xs px-2.5 py-1" onClick={() => onDelete(project)}>Del</button>
          </div>
        )}
      </div>

      <div className="mt-5">
        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
          <span>Progress</span>
          <span className="font-medium text-slate-200">{pct}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-400 to-fuchsia-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between text-xs text-slate-400 mt-4">
        <span className="chip">{project.members?.length || 0} members</span>
        <span className="chip">{project.taskCount ?? 0} tasks</span>
      </div>
    </div>
  );
}
