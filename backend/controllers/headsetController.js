const Headset = require('../models/Headset');

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

module.exports = { addHeadset, getHeadsets };