const multer = require('multer');
const path = require('path');
const fs = require('fs');

let storage;
const hasCloudinary = Boolean(
    (process.env.CLOUDINARY_CLOUD_NAME &&
     process.env.CLOUDINARY_API_KEY &&
     process.env.CLOUDINARY_API_SECRET) ||
    process.env.CLOUDINARY_URL
);

if (hasCloudinary) {
    const cloudinary = require('cloudinary').v2;
    const { CloudinaryStorage } = require('multer-storage-cloudinary');

    if (process.env.CLOUDINARY_URL) {
        cloudinary.config({
            cloudinary_url: process.env.CLOUDINARY_URL
        });
    } else {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }

    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'powermachinery',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'],
            transformation: [{ quality: 'auto', fetch_format: 'auto' }]
        }
    });

    console.log('[Storage] Cloudinary storage configured for persistent cloud uploads.');
} else {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadDir),
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });

    console.log('[Storage] Using local disk storage (/uploads). For persistent production storage, configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment.');
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

/**
 * Returns the public URL for an uploaded file.
 * If Cloudinary is used, file.path or file.secure_url contains the HTTPS URL.
 * If local disk is used, returns the relative path /uploads/{filename}.
 */
function getFileUrl(file) {
    if (!file) return null;
    if (file.path && (file.path.startsWith('http://') || file.path.startsWith('https://'))) {
        return file.path;
    }
    if (file.secure_url) {
        return file.secure_url;
    }
    return `/uploads/${file.filename}`;
}

/**
 * Returns an array of public URLs for multiple uploaded files.
 */
function getFileUrls(files) {
    if (!files || !Array.isArray(files)) return [];
    return files.map(getFileUrl).filter(Boolean);
}

module.exports = {
    upload,
    getFileUrl,
    getFileUrls,
    isCloudinaryConfigured: () => hasCloudinary
};
