const { body } = require('express-validator');

exports.projectRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().isString(),
  body('members').optional().isArray(),
];
