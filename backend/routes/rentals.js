const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { RentalMachine } = require('../models');
const auth = require('../middleware/auth');
const { upload, getFileUrls } = require('../middleware/upload');

const uploadDir = path.join(__dirname, '..', 'uploads');

// Get all rental machines
router.get('/', async (req, res) => {
    try {
        const docs = await RentalMachine.find().sort('display_order _id').lean();
        res.json(docs.map(d => ({ ...d, id: d._id })));
    } catch (err) {
        console.error('Error fetching rentals:', err);
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
        console.error('Error fetching rental machine:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a rental machine (auth + upload images)
router.post('/', [auth, upload.array('images', 5)], async (req, res) => {
    try {
        const { name, price, details, display_order } = req.body;
        const imageUrls = req.files ? getFileUrls(req.files) : [];
        
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
        
        const newImages = req.files ? getFileUrls(req.files) : [];
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
        
        // If images were stored on local disk, clean them up
        if (deletedDoc.imageUrls && deletedDoc.imageUrls.length > 0) {
            deletedDoc.imageUrls.forEach(imgUrl => {
                if (imgUrl.startsWith('/uploads/')) {
                    const filename = imgUrl.split('/').pop();
                    const filePath = path.join(uploadDir, filename);
                    if (fs.existsSync(filePath)) {
                        try {
                            fs.unlinkSync(filePath);
                        } catch (e) {
                            console.error('Error deleting local file:', filePath, e);
                        }
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
