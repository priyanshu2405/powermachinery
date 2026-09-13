const express = require('express');
const router = express.Router();
const { Product } = require('../models');
const auth = require('../middleware/auth');
const { upload, getFileUrl } = require('../middleware/upload');

// Get all products (Public)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 }).lean();
        res.json(products.map(p => ({ ...p, id: p._id })));
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single product (Public)
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean();
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ ...product, id: product._id });
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create product (Admin)
router.post('/', [auth, upload.single('image')], async (req, res) => {
    try {
        const { name, description, price, specifications } = req.body;
        const imageUrl = getFileUrl(req.file);

        const newProduct = await Product.create({
            name,
            description,
            price: price ? Number(price) : undefined,
            imageUrl,
            specifications
        });

        res.json({ ...newProduct.toObject(), id: newProduct._id });
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update product (Admin)
router.put('/:id', [auth, upload.single('image')], async (req, res) => {
    try {
        const { name, description, price, specifications } = req.body;
        const updateData = {
            name,
            description,
            price: price ? Number(price) : undefined,
            specifications
        };

        if (req.file) {
            updateData.imageUrl = getFileUrl(req.file);
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).lean();

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ ...updatedProduct, id: updatedProduct._id });
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete product (Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
