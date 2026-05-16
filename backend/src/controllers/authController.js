const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const generateToken = require('../utils/generateToken');

exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(400, 'Email already in use');

  const user = await User.create({ name, email, password, role });
  res.status(201).json({
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid credentials');
  }
  res.json({
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

exports.me = asyncHandler(async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

exports.listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select('name email role');
  res.json({ users });
});
