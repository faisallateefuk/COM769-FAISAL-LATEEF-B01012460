const axios = require("axios");

const endpoint = process.env.LANGUAGE_ENDPOINT;
const key = process.env.LANGUAGE_KEY;

async function extractKeyPhrases(text) {
    if (!endpoint || !key) {
        console.warn("Text Analytics not configured");
        return [];
    }

    if (!text || !text.trim()) {
        return [];
    }

    const url = `${endpoint}/text/analytics/v3.1/keyPhrases`;

    const body = {
        documents: [
            {
                id: "1",
                language: "en",
                text,
            },
        ],
    };

    const res = await axios.post(url, body, {
        headers: {
            "Ocp-Apim-Subscription-Key": key,
            "Content-Type": "application/json",
        },
    });

    const doc = res.data.documents?.[0];
    return doc?.keyPhrases || [];
}

module.exports = { extractKeyPhrases };
