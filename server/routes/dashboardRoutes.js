const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/dashboardController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/admin', requireAuth, requireRole('admin'), ctrl.adminDashboard);
router.get('/volunteer', requireAuth, requireRole('volunteer'), ctrl.volunteerDashboard);
router.get('/donor', requireAuth, requireRole('donor'), ctrl.donorDashboard);
router.get('/reports', requireAuth, requireRole('admin'), ctrl.reports);

module.exports = router;
