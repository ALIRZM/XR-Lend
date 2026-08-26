const Headset = require('../models/Headset');
module.exports = { addHeadset, getHeadsets };

// R9: a technician adds a headset
const addHeadset = async (req, res) => {
    const { assetTag, model, notes } = req.body;
    try {
        if (!assetTag || !model) {
            return res.status(400).json({ message: 'Asset tag and model are both needed' });
        }
        const exists = await Headset.findOne({ assetTag });
        if (exists) {
            return res.status(400).json({ message: 'That asset tag is already in use' });
        }
        const headset = await Headset.create({ assetTag, model, notes });
        res.status(201).json(headset);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// R10: anyone logged in can browse the list
const getHeadsets = async (req, res) => {
    try {
        const headsets = await Headset.find({ status: { $ne: 'Retired' } }).sort({ assetTag: 1 });
        res.json(headsets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const { findClashingLoans, toWholeDay } = require('../utils/availability');

// R10 and R13: only headsets with no clashing loan across the dates
const getAvailable = async (req, res) => {
    try {
        const { start, end } = req.query;
        if (!start || !end) {
            return res.status(400).json({ message: 'A start and an end date are both needed' });
        }
        const from = toWholeDay(start);
        const to   = toWholeDay(end);
        if (to < from) {
            return res.status(400).json({ message: 'The return date is before the pick-up date' });
        }

        const headsets = await Headset.find({ status: 'Available' });
        const clashes  = await findClashingLoans(headsets.map(h => h._id), from, to);
        const takenIds = new Set(clashes.map(l => String(l.headset)));

        res.json(headsets.filter(h => !takenIds.has(String(h._id))));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};