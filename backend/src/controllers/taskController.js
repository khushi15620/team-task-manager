const Task = require('../models/Task');
const Project = require('../models/Project');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

exports.list = asyncHandler(async (req, res) => {
  const { project, status, priority, search, assignedTo } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;

  const filter = {};
  if (project) filter.project = project;
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignedTo) filter.assignedTo = assignedTo;
  if (search) filter.title = { $regex: search, $options: 'i' };

  if (req.user.role !== 'admin') {
    const myProjects = await Project.find({
      $or: [{ createdBy: req.user._id }, { members: req.user._id }],
    }).select('_id');
    filter.project = filter.project
      ? filter.project
      : { $in: myProjects.map((p) => p._id) };
  }

  const total = await Task.countDocuments(filter);
  const tasks = await Task.find(filter)
    .populate('assignedTo', 'name email')
    .populate('project', 'title')
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({ tasks, total, page, pages: Math.ceil(total / limit) });
});

exports.create = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.body.project);
  if (!project) throw new ApiError(404, 'Project not found');

  const task = await Task.create({ ...req.body, createdBy: req.user._id });
  const populated = await Task.findById(task._id)
    .populate('assignedTo', 'name email')
    .populate('project', 'title');
  res.status(201).json({ task: populated });
});

exports.update = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(404, 'Task not found');

  Object.assign(task, req.body);
  await task.save();
  const populated = await Task.findById(task._id)
    .populate('assignedTo', 'name email')
    .populate('project', 'title');
  res.json({ task: populated });
});

exports.remove = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(404, 'Task not found');
  await task.deleteOne();
  res.json({ message: 'Task deleted' });
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(404, 'Task not found');

  const isAdmin = req.user.role === 'admin';
  const isAssignee = task.assignedTo?.toString() === req.user._id.toString();
  if (!isAdmin && !isAssignee) throw new ApiError(403, 'Only assignee or admin can change status');

  task.status = req.body.status;
  await task.save();
  res.json({ task });
});
