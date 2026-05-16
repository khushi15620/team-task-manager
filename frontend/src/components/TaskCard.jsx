import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

export default function TaskCard({ task, onStatusChange, onEdit, onDelete, canManage, canChangeStatus }) {
  const due = task.dueDate ? new Date(task.dueDate) : null;
  const overdue = due && due < new Date() && task.status !== 'completed';

  return (
    <div className="card card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-100">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-slate-400 mt-1">{task.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            {task.assignedTo && <span className="chip">@ {task.assignedTo.name}</span>}
            {task.project?.title && <span className="chip">in {task.project.title}</span>}
            {due && (
              <span className={`chip ${overdue ? '!text-rose-300 !border-rose-500/40 !bg-rose-500/10' : ''}`}>
                Due {due.toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          {canChangeStatus && (
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task, e.target.value)}
              className="input text-xs py-1.5"
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          )}
          {canManage && (
            <div className="flex gap-1.5">
              <button className="btn-secondary text-xs px-2.5 py-1" onClick={() => onEdit(task)}>Edit</button>
              <button className="btn-danger text-xs px-2.5 py-1" onClick={() => onDelete(task)}>Del</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
