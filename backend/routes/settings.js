const express = require('express');
const router = express.Router();
const { Setting } = require('../models');
const auth = require('../middleware/auth');

const { upload, getFileUrl } = require('../middleware/upload');

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

router.post('/upload', [auth, upload.single('image')], async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }
        const imageUrl = getFileUrl(req.file);
        const { key } = req.body;
        if (key) {
            await Setting.findOneAndUpdate(
                { setting_key: key },
                { setting_value: imageUrl },
                { upsert: true, new: true }
            );
        }
        res.json({ imageUrl, message: 'Image uploaded successfully' });
    } catch (err) {
        console.error('Error uploading setting image:', err);
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
