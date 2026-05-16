const { body } = require('express-validator');

exports.signupRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'member']),
];

exports.loginRules = [
  body('email').isEmail(),
  body('password').notEmpty(),
];
