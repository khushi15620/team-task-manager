const router = require('express').Router();
const ctrl = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const validate = require('../middleware/validate');
const { projectRules } = require('../validators/projectValidator');

router.use(protect);

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post('/', requireRole('admin'), projectRules, validate, ctrl.create);
router.put('/:id', requireRole('admin'), projectRules, validate, ctrl.update);
router.delete('/:id', requireRole('admin'), ctrl.remove);

module.exports = router;
