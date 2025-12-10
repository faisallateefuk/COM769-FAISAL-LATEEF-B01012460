import { useEffect, useState } from "react";
import axios from "axios";
import VideoUpload from "../Components/Video_Upload";

const API_BASE =
    import.meta.env.VITE_API_BASE || "https://com769-b01012460-staging.azurewebsites.net";

function VideoList() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadVideos = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE}/api/videos`);
            setVideos(res.data.items || []);
        } catch (err) {
            console.error("Failed to load videos", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVideos();
    }, []);

    return (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
            <h1>ClipCloud</h1>
            <p>Mini TikTok-style video feed (staging)</p>

            <VideoUpload onUploaded={loadVideos} />

            <section>
                {loading && <p>Loading videos...</p>}
                {!loading && videos.length === 0 && (
                    <p>No videos yet. Upload something!</p>
                )}

                {videos.map((v) => (
                    <div
                        key={v._id}
                        style={{
                            marginBottom: 24,
                            border: "1px solid #ddd",
                            borderRadius: 8,
                            padding: 12,
                        }}
                    >
                        <h3>{v.title}</h3>
                        {v.description && <p>{v.description}</p>}

                        {/* Video playback */}
                        {v.blobUrl && (
                            <video
                                src={v.blobUrl}
                                controls
                                style={{ width: "100%", maxHeight: 400 }}
                            />
                        )}

                        <p style={{ marginTop: 8 }}>
                            Likes: {v.likes ?? 0}
                        </p>
                        {Array.isArray(v.tags) && v.tags.length > 0 && (
                            <p style={{ marginTop: 4 }}>
                                <strong>Tags:</strong>{" "}
                                {v.tags.map((t) => (
                                    <span
                                        key={t}
                                        style={{
                                            display: "inline-block",
                                            padding: "2px 6px",
                                            marginRight: 4,
                                            marginTop: 4,
                                            borderRadius: 12,
                                            border: "1px solid #ccc",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        {t}
                                    </span>
                                ))}
                            </p>
                        )}
                    </div>
                ))}
            </section>
        </div>
    );
}

export default VideoList;
