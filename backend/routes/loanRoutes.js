const express = require('express');
const { requestLoan, getMyLoans, getPendingLoans } = require('../controllers/loanController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const router = express.Router();

router.post('/', protect, requireRole('student'), requestLoan);
router.get('/mine', protect, requireRole('student'), getMyLoans);
router.get('/pending', protect, requireRole('technician'), getPendingLoans);
router.put('/:id/approve', protect, requireRole('technician'), approveLoan);
router.put('/:id/reject',  protect, requireRole('technician'), rejectLoan);
module.exports = router;