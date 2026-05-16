const Task = require('../models/Task');
const Project = require('../models/Project');
const asyncHandler = require('../utils/asyncHandler');

exports.stats = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === 'admin';

  let projectFilter = {};
  if (!isAdmin) {
    const myProjects = await Project.find({
      $or: [{ createdBy: req.user._id }, { members: req.user._id }],
    }).select('_id');
    projectFilter = { project: { $in: myProjects.map((p) => p._id) } };
  }

  const now = new Date();
  const [total, completed, inProgress, todo, overdue, recent] = await Promise.all([
    Task.countDocuments(projectFilter),
    Task.countDocuments({ ...projectFilter, status: 'completed' }),
    Task.countDocuments({ ...projectFilter, status: 'in_progress' }),
    Task.countDocuments({ ...projectFilter, status: 'todo' }),
    Task.countDocuments({ ...projectFilter, dueDate: { $lt: now }, status: { $ne: 'completed' } }),
    Task.find(projectFilter)
      .populate('project', 'title')
      .populate('assignedTo', 'name')
      .sort('-updatedAt')
      .limit(5),
  ]);

  const totalProjects = await Project.countDocuments(
    isAdmin ? {} : { $or: [{ createdBy: req.user._id }, { members: req.user._id }] }
  );

  res.json({
    stats: {
      totalTasks: total,
      completedTasks: completed,
      pendingTasks: todo + inProgress,
      inProgressTasks: inProgress,
      todoTasks: todo,
      overdueTasks: overdue,
      totalProjects,
    },
    recent,
  });
});
