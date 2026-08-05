const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { RentalMachine } = require('../models');
const auth = require('../middleware/auth');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// Get all rental machines
router.get('/', async (req, res) => {
    try {
        const docs = await RentalMachine.find().sort('display_order _id').lean();
        res.json(docs.map(d => ({ ...d, id: d._id })));
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a single rental machine
router.get('/:id', async (req, res) => {
    try {
        const doc = await RentalMachine.findById(req.params.id).lean();
        if (!doc) {
            return res.status(404).json({ message: 'Machine not found' });
        }
        res.json({ ...doc, id: doc._id });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a rental machine (auth + upload images)
router.post('/', [auth, upload.array('images', 5)], async (req, res) => {
    try {
        const { name, price, details, display_order } = req.body;
        const imageUrls = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
        
        const newDoc = await RentalMachine.create({
            name,
            price,
            imageUrls,
            details,
            display_order: display_order || 0
        });
        
        res.json({ ...newDoc.toObject(), id: newDoc._id });
    } catch (err) {
        console.error('Error creating rental machine:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a rental machine (auth + upload images)
router.put('/:id', [auth, upload.array('images', 5)], async (req, res) => {
    try {
        const { name, price, details, display_order } = req.body;
        
        let existingImages = [];
        if (req.body.existingImages) {
            existingImages = Array.isArray(req.body.existingImages) 
                ? req.body.existingImages 
                : [req.body.existingImages];
        }
        
        const newImages = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
        const imageUrls = [...existingImages, ...newImages];
        
        const updateData = {
            name,
            price,
            imageUrls,
            details,
            display_order: display_order || 0
        };
        
        const updatedDoc = await RentalMachine.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedDoc) {
            return res.status(404).json({ message: 'Machine not found' });
        }
        
        res.json({ ...updatedDoc.toObject(), id: updatedDoc._id });
    } catch (err) {
        console.error('Error updating rental machine:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a rental machine
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedDoc = await RentalMachine.findByIdAndDelete(req.params.id);
        if (!deletedDoc) {
            return res.status(404).json({ message: 'Machine not found' });
        }
        
        // Delete corresponding uploaded image files from disk to keep clean
        if (deletedDoc.imageUrls && deletedDoc.imageUrls.length > 0) {
            deletedDoc.imageUrls.forEach(imgUrl => {
                const filename = imgUrl.split('/').pop();
                const filePath = path.join(uploadDir, filename);
                if (fs.existsSync(filePath)) {
                    try {
                        fs.unlinkSync(filePath);
                    } catch (e) {
                        console.error('Error deleting file:', filePath, e);
                    }
                }
            });
        }
        
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error('Error deleting rental machine:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
