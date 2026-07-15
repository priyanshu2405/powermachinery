const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { CaseStudy, Partner } = require('../models');
const auth = require('../middleware/auth');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// CASE STUDIES
router.get('/case-studies', async (req, res) => {
    try {
        const docs = await CaseStudy.find().sort('display_order _id').lean();
        res.json(docs.map(d => ({ ...d, id: d._id })));
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/case-studies', [auth, upload.single('image')], async (req, res) => {
    try {
        const { client, type, description, display_order } = req.body;
        let imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        
        const newCase = await CaseStudy.create({
            client, type, description, imageUrl, display_order: display_order || 0
        });
        res.json({ ...newCase.toObject(), id: newCase._id });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/case-studies/:id', [auth, upload.single('image')], async (req, res) => {
    try {
        const { client, type, description, display_order } = req.body;
        const updateData = { client, type, description, display_order: display_order || 0 };
        if (req.file) updateData.imageUrl = `/uploads/${req.file.filename}`;

        await CaseStudy.findByIdAndUpdate(req.params.id, updateData);
        res.json({ message: 'Updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/case-studies/:id', auth, async (req, res) => {
    try {
        await CaseStudy.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PARTNERS
router.get('/partners', async (req, res) => {
    try {
        const docs = await Partner.find().sort('display_order _id').lean();
        res.json(docs.map(d => ({ ...d, id: d._id })));
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/partners', auth, async (req, res) => {
    try {
        const { name, display_order } = req.body;
        const newPartner = await Partner.create({ name, display_order: display_order || 0 });
        res.json({ ...newPartner.toObject(), id: newPartner._id });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/partners/:id', auth, async (req, res) => {
    try {
        const { name, display_order } = req.body;
        await Partner.findByIdAndUpdate(req.params.id, { name, display_order: display_order || 0 });
        res.json({ message: 'Updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/partners/:id', auth, async (req, res) => {
    try {
        await Partner.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
