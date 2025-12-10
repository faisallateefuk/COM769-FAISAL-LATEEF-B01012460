const { Schema, model } = require('mongoose');

const videoSchema = new Schema(
    {
        title: { type: String, required: true },
        description: String,
        uploaderId: String,
        blobUrl: { type: String, required: true },
        thumbnailUrl: String,
        tags: [String],
        likes: { type: Number, default: 0 }
    },
    { timestamps: true }
);

module.exports = model('Video', videoSchema);
