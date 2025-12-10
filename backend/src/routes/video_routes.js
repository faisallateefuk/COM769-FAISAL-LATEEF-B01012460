// backend/src/videos.routes.js
const express = require('express');
const Video = require('../models/video_model');
const { uploadVideoBuffer } = require('../helper/storage');

const router = express.Router();
const upload = multer();

// GET /api/videos - list with pagination
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
        Video.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
        Video.countDocuments()
    ]);

    res.json({ items, total, page, limit });
});

// GET /api/videos/:id - detail
router.get('/:id', async (req, res) => {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Not found' });
    res.json(video);
});

// POST /api/videos/:id/like - increment likes
router.post('/:id/like', async (req, res) => {
    const video = await Video.findByIdAndUpdate(
        req.params.id,
        { $inc: { likes: 1 } },
        { new: true }
    );
    if (!video) return res.status(404).json({ message: 'Not found' });
    res.json(video);
});

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { title, description, uploaderId } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'title is required' });
        }

        const blobUrl = await uploadVideoBuffer(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype
        );

        const video = await Video.create({
            title,
            description,
            uploaderId,
            blobUrl,
            thumbnailUrl: null,
            tags: []
        });

        res.status(201).json(video);
    } catch (err) {
        console.error('Upload error', err);
        res.status(500).json({ message: 'Upload failed' });
    }
});

module.exports = router;
