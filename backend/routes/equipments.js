const express = require('express');
const router = express.Router();
const { Equipment } = require('../models');
const auth = require('../middleware/auth');
const { upload, getFileUrl } = require('../middleware/upload');

router.get('/', async (req, res) => {
    try {
        const docs = await Equipment.find().sort('display_order _id').lean();
        res.json(docs.map(d => ({ ...d, id: d._id })));
    } catch (err) {
        console.error('Error fetching equipment:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', [auth, upload.single('image')], async (req, res) => {
    try {
        const { name, category, display_order } = req.body;
        const imageUrl = getFileUrl(req.file);
        
        const newEq = await Equipment.create({
            name,
            category,
            imageUrl,
            display_order: display_order || 0
        });
        
        res.json({ ...newEq.toObject(), id: newEq._id });
    } catch (err) {
        console.error('Error creating equipment:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', [auth, upload.single('image')], async (req, res) => {
    try {
        const { name, category, display_order } = req.body;
        const updateData = { name, category, display_order: display_order || 0 };
        
        if (req.file) {
            updateData.imageUrl = getFileUrl(req.file);
        }

        await Equipment.findByIdAndUpdate(req.params.id, updateData);
        res.json({ message: 'Updated successfully' });
    } catch (err) {
        console.error('Error updating equipment:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await Equipment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error('Error deleting equipment:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
