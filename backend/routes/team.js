const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { TeamMember } = require('../models');
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

router.get('/', async (req, res) => {
    try {
        const docs = await TeamMember.find().sort('display_order _id').lean();
        res.json(docs.map(d => ({ ...d, id: d._id })));
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', [auth, upload.single('image')], async (req, res) => {
    try {
        const { name, role, bio, display_order } = req.body;
        let imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        
        const newMember = await TeamMember.create({
            name, role, bio, imageUrl, display_order: display_order || 0
        });
        
        res.json({ ...newMember.toObject(), id: newMember._id });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', [auth, upload.single('image')], async (req, res) => {
    try {
        const { name, role, bio, display_order } = req.body;
        const updateData = { name, role, bio, display_order: display_order || 0 };
        
        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;
        }

        await TeamMember.findByIdAndUpdate(req.params.id, updateData);
        res.json({ message: 'Updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await TeamMember.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
