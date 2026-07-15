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
    db.all(`SELECT * FROM team_members ORDER BY display_order ASC, id ASC`, [], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(rows);
    });
});

router.post('/', [auth, upload.single('image')], (req, res) => {
    const { name, role, bio, display_order } = req.body;
    let imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    db.run(
        `INSERT INTO team_members (name, role, bio, imageUrl, display_order) VALUES (?, ?, ?, ?, ?)`,
        [name, role, bio, imageUrl, display_order || 0],
        function(err) {
            if (err) return res.status(500).json({ message: 'Database error' });
            res.json({ id: this.lastID, name, role, bio, imageUrl, display_order });
        }
    );
});

router.put('/:id', [auth, upload.single('image')], (req, res) => {
    const { name, role, bio, display_order } = req.body;
    const { id } = req.params;

    db.get(`SELECT imageUrl FROM team_members WHERE id = ?`, [id], (err, row) => {
        if (err || !row) return res.status(404).json({ message: 'Member not found' });
        let imageUrl = req.file ? `/uploads/${req.file.filename}` : row.imageUrl;

        db.run(
            `UPDATE team_members SET name = ?, role = ?, bio = ?, imageUrl = ?, display_order = ? WHERE id = ?`,
            [name, role, bio, imageUrl, display_order || 0, id],
            function(err) {
                if (err) return res.status(500).json({ message: 'Database error' });
                res.json({ message: 'Updated successfully' });
            }
        );
    });
});

router.delete('/:id', auth, (req, res) => {
    db.run(`DELETE FROM team_members WHERE id = ?`, [req.params.id], (err) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'Deleted successfully' });
    });
});

module.exports = router;
