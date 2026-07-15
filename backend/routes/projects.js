const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');
const auth = require('../middleware/auth');

const uploadDir = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// CASE STUDIES
router.get('/case-studies', (req, res) => {
    db.all(`SELECT * FROM case_studies ORDER BY display_order ASC, id ASC`, [], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(rows);
    });
});

router.post('/case-studies', [auth, upload.single('image')], (req, res) => {
    const { client, type, description, display_order } = req.body;
    let imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    db.run(
        `INSERT INTO case_studies (client, type, description, imageUrl, display_order) VALUES (?, ?, ?, ?, ?)`,
        [client, type, description, imageUrl, display_order || 0],
        function(err) {
            if (err) return res.status(500).json({ message: 'Database error' });
            res.json({ id: this.lastID, client, type, description, imageUrl, display_order });
        }
    );
});

router.put('/case-studies/:id', [auth, upload.single('image')], (req, res) => {
    const { client, type, description, display_order } = req.body;
    const { id } = req.params;

    db.get(`SELECT imageUrl FROM case_studies WHERE id = ?`, [id], (err, row) => {
        if (err || !row) return res.status(404).json({ message: 'Not found' });
        let imageUrl = req.file ? `/uploads/${req.file.filename}` : row.imageUrl;

        db.run(
            `UPDATE case_studies SET client = ?, type = ?, description = ?, imageUrl = ?, display_order = ? WHERE id = ?`,
            [client, type, description, imageUrl, display_order || 0, id],
            function(err) {
                if (err) return res.status(500).json({ message: 'Database error' });
                res.json({ message: 'Updated successfully' });
            }
        );
    });
});

router.delete('/case-studies/:id', auth, (req, res) => {
    db.run(`DELETE FROM case_studies WHERE id = ?`, [req.params.id], (err) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'Deleted successfully' });
    });
});

// PARTNERS
router.get('/partners', (req, res) => {
    db.all(`SELECT * FROM partners ORDER BY display_order ASC, id ASC`, [], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(rows);
    });
});

router.post('/partners', auth, (req, res) => {
    const { name, display_order } = req.body;
    db.run(`INSERT INTO partners (name, display_order) VALUES (?, ?)`, [name, display_order || 0], function(err) {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ id: this.lastID, name, display_order });
    });
});

router.put('/partners/:id', auth, (req, res) => {
    const { name, display_order } = req.body;
    db.run(`UPDATE partners SET name = ?, display_order = ? WHERE id = ?`, [name, display_order || 0, req.params.id], function(err) {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'Updated successfully' });
    });
});

router.delete('/partners/:id', auth, (req, res) => {
    db.run(`DELETE FROM partners WHERE id = ?`, [req.params.id], (err) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'Deleted successfully' });
    });
});

module.exports = router;
