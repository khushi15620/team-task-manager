const Project = require('../models/Project');
const Task = require('../models/Task');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const canAccess = (project, user) =>
  user.role === 'admin' ||
  project.createdBy.toString() === user._id.toString() ||
  project.members.some((m) => m.toString() === user._id.toString());

exports.list = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search || '';

  const filter = req.user.role === 'admin'
    ? {}
    : { $or: [{ createdBy: req.user._id }, { members: req.user._id }] };

  if (search) filter.title = { $regex: search, $options: 'i' };

  const total = await Project.countDocuments(filter);
  const projects = await Project.find(filter)
    .populate('members', 'name email role')
    .populate('createdBy', 'name email')
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit);

  const withProgress = await Promise.all(projects.map(async (p) => {
    const [total, completed] = await Promise.all([
      Task.countDocuments({ project: p._id }),
      Task.countDocuments({ project: p._id, status: 'completed' }),
    ]);
    const progress = total ? Math.round((completed / total) * 100) : 0;
    return { ...p.toObject(), progress, taskCount: total };
  }));

  res.json({ projects: withProgress, page, total, pages: Math.ceil(total / limit) });
});

exports.create = asyncHandler(async (req, res) => {
  const { title, description, members = [] } = req.body;
  const project = await Project.create({
    title,
    description,
    members,
    createdBy: req.user._id,
  });
  res.status(201).json({ project });
});

exports.get = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('members', 'name email role')
    .populate('createdBy', 'name email');
  if (!project) throw new ApiError(404, 'Project not found');
  if (!canAccess(project, req.user)) throw new ApiError(403, 'No access');

  const tasks = await Task.find({ project: project._id })
    .populate('assignedTo', 'name email');
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  res.json({ project, tasks, progress });
});

exports.update = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, 'Project not found');
  const { title, description, members } = req.body;
  if (title !== undefined) project.title = title;
  if (description !== undefined) project.description = description;
  if (members !== undefined) project.members = members;
  await project.save();
  res.json({ project });
});

exports.remove = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, 'Project not found');
  await Task.deleteMany({ project: project._id });
  await project.deleteOne();
  res.json({ message: 'Project deleted' });
});
