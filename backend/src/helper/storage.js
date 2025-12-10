const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');

const connectionString = process.env.STORAGE_CONN_STRING;
const containerName = 'videos';

if (!connectionString) {
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
    const blobName = `${uuidv4()}.${ext}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: { blobContentType: mimeType }
    });

    return blockBlobClient.url;
}

module.exports = { uploadVideoBuffer };
