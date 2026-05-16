const { body } = require('express-validator');

exports.taskRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('project').notEmpty().withMessage('Project is required'),
  body('status').optional().isIn(['todo', 'in_progress', 'completed']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('dueDate').optional().isISO8601().toDate(),
  body('assignedTo').optional({ nullable: true }),
];

exports.statusRules = [
  body('status').isIn(['todo', 'in_progress', 'completed']),
];
