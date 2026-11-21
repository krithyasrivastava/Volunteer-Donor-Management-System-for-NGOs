const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/skillController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', requireAuth, ctrl.listSkills);
router.post('/', requireAuth, requireRole('admin'), ctrl.createSkill);

router.get('/mine', requireAuth, requireRole('volunteer'), ctrl.myVolunteerSkills);
router.post('/mine', requireAuth, requireRole('volunteer'), ctrl.addMySkill);
router.delete('/mine/:skillId', requireAuth, requireRole('volunteer'), ctrl.removeMySkill);

module.exports = router;
