const router = require('express').Router();
const { signup, login, me, listUsers } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { signupRules, loginRules } = require('../validators/authValidator');

router.post('/signup', signupRules, validate, signup);
router.post('/login', loginRules, validate, login);
router.get('/me', protect, me);
router.get('/users', protect, listUsers);

module.exports = router;
