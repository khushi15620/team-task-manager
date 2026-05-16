const router = require('express').Router();
const ctrl = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const validate = require('../middleware/validate');
const { taskRules, statusRules } = require('../validators/taskValidator');

router.use(protect);

router.get('/', ctrl.list);
router.post('/', requireRole('admin'), taskRules, validate, ctrl.create);
router.put('/:id', requireRole('admin'), ctrl.update);
router.delete('/:id', requireRole('admin'), ctrl.remove);
router.patch('/:id/status', statusRules, validate, ctrl.updateStatus);

module.exports = router;
