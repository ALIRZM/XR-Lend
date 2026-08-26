const express = require('express');
const { addHeadset, getHeadsets } = require('../controllers/headsetController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, getHeadsets)
    .post(protect, requireRole('technician'), addHeadset);

module.exports = router;