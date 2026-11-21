const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/donationController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/mine', requireAuth, requireRole('donor'), ctrl.myDonations);
router.get('/', requireAuth, requireRole('admin'), ctrl.listDonations);
router.post('/', requireAuth, requireRole('admin', 'donor'), ctrl.createDonation);
router.get('/:id', requireAuth, requireRole('admin', 'donor'), ctrl.getDonation);
router.get('/:id/receipt', requireAuth, requireRole('admin', 'donor'), ctrl.getReceipt);
router.put('/:id', requireAuth, requireRole('admin'), ctrl.updateDonation);

module.exports = router;
