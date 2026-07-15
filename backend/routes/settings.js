const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Get all settings (Public)
router.get('/', (req, res) => {
    db.all(`SELECT setting_key, setting_value FROM settings`, [], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        
        // Convert array of key-values to an object
        const settingsMap = {};
        rows.forEach(row => {
            settingsMap[row.setting_key] = row.setting_value;
        });
        
        res.json(settingsMap);
    });
});

// Update a setting (Admin)
router.put('/:key', auth, (req, res) => {
    const { key } = req.params;
    const { value } = req.body;

    db.run(
        `UPDATE settings SET setting_value = ? WHERE setting_key = ?`,
        [value, key],
        function(err) {
            if (err) return res.status(500).json({ message: 'Database error' });
            res.json({ message: 'Setting updated successfully' });
        }
    );
});

module.exports = router;
