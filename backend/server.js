require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/team', require('./routes/team'));
app.use('/api/equipments', require('./routes/equipments'));
app.use('/api/projects', require('./routes/projects'));

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
