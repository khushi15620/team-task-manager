import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

export default function TaskCard({ task, onStatusChange, onEdit, onDelete, canManage, canChangeStatus }) {
  const due = task.dueDate ? new Date(task.dueDate) : null;
  const overdue = due && due < new Date() && task.status !== 'completed';

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-800">{task.title}</h3>
          {task.description && <p className="text-sm text-slate-500 mt-1">{task.description}</p>}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            {task.assignedTo && <span className="text-slate-500">@ {task.assignedTo.name}</span>}
            {task.project?.title && <span className="text-slate-500">in {task.project.title}</span>}
            {due && (
              <span className={overdue ? 'text-red-600 font-medium' : 'text-slate-500'}>
                Due {due.toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {canChangeStatus && (
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task, e.target.value)}
              className="input text-xs py-1"
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          )}
          {canManage && (
            <div className="flex gap-1">
              <button className="btn-secondary text-xs px-2 py-1" onClick={() => onEdit(task)}>Edit</button>
              <button className="btn-danger text-xs px-2 py-1" onClick={() => onDelete(task)}>Del</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
