const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');
const auth = require('../middleware/auth');
const fs = require('fs');

// Ensure uploads dir exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

// Get all products (Public)
router.get('/', (req, res) => {
    db.all(`SELECT * FROM products ORDER BY createdAt DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(rows);
    });
});

// Get single product (Public)
router.get('/:id', (req, res) => {
    db.get(`SELECT * FROM products WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (!row) return res.status(404).json({ message: 'Product not found' });
        res.json(row);
    });
});

// Create product (Admin)
router.post('/', [auth, upload.single('image')], (req, res) => {
    const { name, description, price, specifications } = req.body;
    let imageUrl = null;
    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
    }

    db.run(
        `INSERT INTO products (name, description, price, imageUrl, specifications) VALUES (?, ?, ?, ?, ?)`,
        [name, description, price, imageUrl, specifications],
        function(err) {
            if (err) return res.status(500).json({ message: 'Database error' });
            res.json({ id: this.lastID, name, description, price, imageUrl, specifications });
        }
    );
});

// Update product (Admin)
router.put('/:id', [auth, upload.single('image')], (req, res) => {
    const { name, description, price, specifications } = req.body;
    
    db.get(`SELECT imageUrl FROM products WHERE id = ?`, [req.params.id], (err, row) => {
        if (err || !row) return res.status(404).json({ message: 'Product not found' });

        let imageUrl = row.imageUrl;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        db.run(
            `UPDATE products SET name = ?, description = ?, price = ?, imageUrl = ?, specifications = ? WHERE id = ?`,
            [name, description, price, imageUrl, specifications, req.params.id],
            function(err) {
                if (err) return res.status(500).json({ message: 'Database error' });
                res.json({ id: req.params.id, name, description, price, imageUrl, specifications });
            }
        );
    });
});

// Delete product (Admin)
router.delete('/:id', auth, (req, res) => {
    db.run(`DELETE FROM products WHERE id = ?`, [req.params.id], function(err) {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'Product deleted' });
    });
});

module.exports = router;
