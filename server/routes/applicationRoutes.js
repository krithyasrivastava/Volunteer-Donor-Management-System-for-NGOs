const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/applicationController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/volunteers', requireAuth, requireRole('admin'), ctrl.listVolunteerApplications);
router.get('/events', requireAuth, requireRole('admin'), ctrl.listEventApplications);
router.get('/mine', requireAuth, requireRole('volunteer'), ctrl.myEventApplications);

module.exports = router;
