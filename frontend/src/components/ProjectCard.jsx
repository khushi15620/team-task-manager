import { Link } from 'react-router-dom';

export default function ProjectCard({ project, onEdit, onDelete, canManage }) {
  return (
    <div className="card hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <Link to={`/projects/${project._id}`} className="flex-1">
          <h3 className="font-semibold text-slate-800 hover:text-brand-600">{project.title}</h3>
          <p className="text-sm text-slate-500 mt-1 line-clamp-2">{project.description || 'No description'}</p>
        </Link>
        {canManage && (
          <div className="flex gap-1">
            <button className="btn-secondary text-xs px-2 py-1" onClick={() => onEdit(project)}>Edit</button>
            <button className="btn-danger text-xs px-2 py-1" onClick={() => onDelete(project)}>Del</button>
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Progress</span>
          <span>{project.progress ?? 0}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div className="bg-brand-600 h-2 rounded-full" style={{ width: `${project.progress ?? 0}%` }} />
        </div>
      </div>
      <div className="flex justify-between text-xs text-slate-500 mt-3">
        <span>{project.members?.length || 0} members</span>
        <span>{project.taskCount ?? 0} tasks</span>
      </div>
    </div>
  );
}
