const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    student:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    headset:   { type: mongoose.Schema.Types.ObjectId, ref: 'Headset', required: true },
    startDate: { type: Date, required: true },
    endDate:   { type: Date, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Cancelled', 'Collected', 'Returned'],
        default: 'Pending',
    },
    rejectionReason: { type: String },
    purpose:         { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Loan', loanSchema);