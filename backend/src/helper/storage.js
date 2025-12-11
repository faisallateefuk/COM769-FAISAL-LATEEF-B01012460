const { BlobServiceClient } = require('@azure/storage-blob');
const { randomUUID } = require("crypto");

const connectionString = process.env.STORAGE_CONN_STRING;
const containerName = 'videos';

if (!connectionString && process.env.NODE_ENV !== "test") {
    console.warn('WARNING: STORAGE_CONN_STRING is not set');
}

const blobServiceClient = connectionString
    ? BlobServiceClient.fromConnectionString(connectionString)
    : null;

async function uploadVideoBuffer(buffer, originalName, mimeType) {
    if (!blobServiceClient) {
        throw new Error('BlobServiceClient not initialised');
    }

    const containerClient = blobServiceClient.getContainerClient(containerName);

    const ext = originalName.split('.').pop() || 'mp4';
    const blobName = `${randomUUID()}.${ext}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: { blobContentType: mimeType }
    });

    return blockBlobClient.url;
}

module.exports = { uploadVideoBuffer };
