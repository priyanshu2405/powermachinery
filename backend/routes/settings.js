const express = require('express');
const router = express.Router();
const { Setting } = require('../models');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const settings = await Setting.find().lean();
        const settingsObj = {};
        settings.forEach(s => {
            settingsObj[s.setting_key] = s.setting_value;
        });
        res.json(settingsObj);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:key', auth, async (req, res) => {
    try {
        const { value } = req.body;
        await Setting.findOneAndUpdate(
            { setting_key: req.params.key },
            { setting_value: value },
            { upsert: true, new: true }
        );
        res.json({ message: 'Updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
