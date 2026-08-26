const Loan = require('../models/Loan');

// R13: two approved loans for the same headset must never overlap in time.
// Two ranges clash unless one finishes before the other starts.
// Allowed only when  newEnd < existingStart  or  newStart > existingEnd.
const findClashingLoans = async (headsetIds, start, end) => {
    return Loan.find({
        headset: { $in: headsetIds },
        status: { $in: ['Pending', 'Approved', 'Collected'] },
        startDate: { $lte: end },
        endDate:   { $gte: start },
    });
};

const toWholeDay = (value) => {
    const d = new Date(value);
    d.setUTCHours(0, 0, 0, 0);
    return d;
};

module.exports = { findClashingLoans, toWholeDay };