const express = require('express');
const Video = require('../models/video_model');

const router = express.Router();

// GET /api/videos - list
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

// POST /api/videos - create metadata (blobUrl already known)
router.post('/', async (req, res) => {
    const { title, description, blobUrl, thumbnailUrl, uploaderId, tags } = req.body;
    if (!title || !blobUrl) {
        return res.status(400).json({ message: 'title and blobUrl are required' });
    }

    const video = await Video.create({
        title,
        description,
        blobUrl,
        thumbnailUrl,
        uploaderId,
        tags: tags || []
    });

    res.status(201).json(video);
});

// POST /api/videos/:id/like - simple like
router.post('/:id/like', async (req, res) => {
    const video = await Video.findByIdAndUpdate(
        req.params.id,
        { $inc: { likes: 1 } },
        { new: true }
    );
    if (!video) return res.status(404).json({ message: 'Not found' });
    res.json(video);
});

module.exports = router;
