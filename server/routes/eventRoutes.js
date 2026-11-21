const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/eventController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', requireAuth, ctrl.listEvents);
router.post('/', requireAuth, requireRole('admin'), ctrl.createEvent);
router.get('/:id', requireAuth, ctrl.getEvent);
router.put('/:id', requireAuth, requireRole('admin'), ctrl.updateEvent);
router.delete('/:id', requireAuth, requireRole('admin'), ctrl.cancelEvent);

router.put('/:id/requirements', requireAuth, requireRole('admin'), ctrl.setRequirements);
router.get('/:id/matches', requireAuth, requireRole('admin'), ctrl.getMatches);
router.post('/:id/assign', requireAuth, requireRole('admin'), ctrl.assignVolunteer);

router.post('/:id/apply', requireAuth, requireRole('volunteer'), ctrl.applyToEvent);
router.patch('/:id/volunteers/:volunteerId', requireAuth, requireRole('admin'), ctrl.updateEventVolunteer);

module.exports = router;
