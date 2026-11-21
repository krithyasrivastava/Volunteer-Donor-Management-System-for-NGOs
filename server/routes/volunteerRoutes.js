const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/volunteerController');
const { requireAuth, requireRole } = require('../middleware/auth');

// Self-service (volunteer role) - declared before /:id to avoid route clashes
router.get('/me/profile', requireAuth, requireRole('volunteer'), ctrl.getMyProfile);
router.put('/me/profile', requireAuth, requireRole('volunteer'), ctrl.updateMyProfile);

// Admin management
router.get('/', requireAuth, requireRole('admin'), ctrl.listVolunteers);
router.post('/', requireAuth, requireRole('admin'), ctrl.createVolunteer);
router.get('/:id', requireAuth, requireRole('admin'), ctrl.getVolunteer);
router.put('/:id', requireAuth, requireRole('admin'), ctrl.updateVolunteerAdmin);
router.patch('/:id/status', requireAuth, requireRole('admin'), ctrl.setVolunteerStatus);
router.delete('/:id', requireAuth, requireRole('admin'), ctrl.deleteVolunteer);

module.exports = router;
