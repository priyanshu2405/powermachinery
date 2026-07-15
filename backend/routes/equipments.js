const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');
const auth = require('../middleware/auth');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

router.get('/', (req, res) => {
    db.all(`SELECT * FROM equipments ORDER BY display_order ASC, id ASC`, [], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(rows);
    });
});

router.post('/', [auth, upload.single('image')], (req, res) => {
    const { name, category, display_order } = req.body;
    let imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    db.run(
        `INSERT INTO equipments (name, category, imageUrl, display_order) VALUES (?, ?, ?, ?)`,
        [name, category, imageUrl, display_order || 0],
        function(err) {
            if (err) return res.status(500).json({ message: 'Database error' });
            res.json({ id: this.lastID, name, category, imageUrl, display_order });
        }
    );
});

router.put('/:id', [auth, upload.single('image')], (req, res) => {
    const { name, category, display_order } = req.body;
    const { id } = req.params;

    db.get(`SELECT imageUrl FROM equipments WHERE id = ?`, [id], (err, row) => {
        if (err || !row) return res.status(404).json({ message: 'Equipment not found' });
        let imageUrl = req.file ? `/uploads/${req.file.filename}` : row.imageUrl;

        db.run(
            `UPDATE equipments SET name = ?, category = ?, imageUrl = ?, display_order = ? WHERE id = ?`,
            [name, category, imageUrl, display_order || 0, id],
            function(err) {
                if (err) return res.status(500).json({ message: 'Database error' });
                res.json({ message: 'Updated successfully' });
            }
        );
    });
});

router.delete('/:id', auth, (req, res) => {
    db.run(`DELETE FROM equipments WHERE id = ?`, [req.params.id], (err) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'Deleted successfully' });
    });
});

module.exports = router;
