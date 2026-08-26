const mongoose = require('mongoose');

const headsetSchema = new mongoose.Schema({
    assetTag: { type: String, required: true, unique: true },
    model:    { type: String, required: true },
    status:   { type: String, enum: ['Available', 'Maintenance', 'Retired'], default: 'Available' },
    notes:    { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Headset', headsetSchema);