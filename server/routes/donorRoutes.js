const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/donorController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/me/profile', requireAuth, requireRole('donor'), ctrl.getMyProfile);
router.put('/me/profile', requireAuth, requireRole('donor'), ctrl.updateMyProfile);

router.get('/', requireAuth, requireRole('admin'), ctrl.listDonors);
router.post('/', requireAuth, requireRole('admin'), ctrl.createDonor);
router.get('/:id', requireAuth, requireRole('admin'), ctrl.getDonor);
router.put('/:id', requireAuth, requireRole('admin'), ctrl.updateDonorAdmin);

module.exports = router;
