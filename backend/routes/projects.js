const express = require('express');
const router = express.Router();
const { CaseStudy, Partner } = require('../models');
const auth = require('../middleware/auth');
const { upload, getFileUrl } = require('../middleware/upload');

// CASE STUDIES
router.get('/case-studies', async (req, res) => {
    try {
        const docs = await CaseStudy.find().sort('display_order _id').lean();
        res.json(docs.map(d => ({ ...d, id: d._id })));
    } catch (err) {
        console.error('Error fetching case studies:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/case-studies', [auth, upload.single('image')], async (req, res) => {
    try {
        const { client, type, description, display_order } = req.body;
        const imageUrl = getFileUrl(req.file);
        
        const newCase = await CaseStudy.create({
            client,
            type,
            description,
            imageUrl,
            display_order: display_order || 0
        });
        res.json({ ...newCase.toObject(), id: newCase._id });
    } catch (err) {
        console.error('Error creating case study:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/case-studies/:id', [auth, upload.single('image')], async (req, res) => {
    try {
        const { client, type, description, display_order } = req.body;
        const updateData = { client, type, description, display_order: display_order || 0 };
        
        if (req.file) {
            updateData.imageUrl = getFileUrl(req.file);
        }

        await CaseStudy.findByIdAndUpdate(req.params.id, updateData);
        res.json({ message: 'Updated successfully' });
    } catch (err) {
        console.error('Error updating case study:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/case-studies/:id', auth, async (req, res) => {
    try {
        await CaseStudy.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error('Error deleting case study:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PARTNERS
router.get('/partners', async (req, res) => {
    try {
        const docs = await Partner.find().sort('display_order _id').lean();
        res.json(docs.map(d => ({ ...d, id: d._id })));
    } catch (err) {
        console.error('Error fetching partners:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/partners', auth, async (req, res) => {
    try {
        const { name, display_order } = req.body;
        const newPartner = await Partner.create({ name, display_order: display_order || 0 });
        res.json({ ...newPartner.toObject(), id: newPartner._id });
    } catch (err) {
        console.error('Error creating partner:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/partners/:id', auth, async (req, res) => {
    try {
        const { name, display_order } = req.body;
        await Partner.findByIdAndUpdate(req.params.id, { name, display_order: display_order || 0 });
        res.json({ message: 'Updated successfully' });
    } catch (err) {
        console.error('Error updating partner:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/partners/:id', auth, async (req, res) => {
    try {
        await Partner.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error('Error deleting partner:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
