require('dotenv').config();
require("./helper/telemetry");
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const videoRoutes = require('./routes/video_routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/videos', videoRoutes);

app.get("/", (req, res) => {
    res.status(200).send("Yayyyy i am working!")
})

const PORT = process.env.PORT || 4000;

async function start() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Cosmos DB (Mongo)');
        app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
    } catch (err) {
        console.error('Failed to start server', err);
        process.exit(1);
    }
}

if (require.main === module) {
    start();
}

module.exports = app;
